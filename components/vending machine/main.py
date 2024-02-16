import os
import cv2
import subprocess
import time
import RPi.GPIO as GPIO
from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
from hx711 import HX711
from mfrc522 import SimpleMFRC522
import requests
import math
from ultralytics import YOLO

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
buzzer_pin = 18
GPIO.setup(buzzer_pin, GPIO.OUT)

# HX711 setup and calibration
hx = HX711(dout_pin=6, pd_sck_pin=5)
calibration_file = "calibration_data.txt"

# Reading if there is existing calibration file
try:
    with open(calibration_file, "r") as file:
        ratio = float(file.read().strip())
        hx.set_scale_ratio(ratio)
except FileNotFoundError:
    print("Calibration file not found. Performing calibration.")
    hx.zero()
    input("Place a known weight on the scale and press Enter: ")
    reading = hx.get_data_mean(readings=100)
    value = float(input("Enter the known weight in grams and press Enter: "))
    ratio = reading / value
    hx.set_scale_ratio(ratio)
    with open(calibration_file, "w") as file:
        file.write(str(ratio))

# RFID setup
reader = SimpleMFRC522()

# Servo setup
Device.pin_factory = PiGPIOFactory(host='localhost', port=8888)
servo = AngularServo(26, min_pulse_width=0.0006, max_pulse_width=0.0023)

# API endpoints
# Sigue
url_check_rfid = "http://192.168.43.85:3001/check_rfid"
url_update_data = "http://192.168.43.85:3001/addDataHistory"
url_update_points = "http://192.168.43.85:3001/updatePoints"

# Jasper
# url_check_rfid = "http://192.168.68.111:3001/check_rfid"
# url_update_data = "http://192.168.68.111:3001/addDataHistory"
# url_update_points = "http://192.168.68.111:3001/updatePoints"

# Hosting
# url_check_rfid = "http://revendo-030702.et.r.appspot.com/check_rfid"
# url_update_data = "http://revendo-030702.et.r.appspot.com/addDataHistory"
# url_update_points = "http://revendo-030702.et.r.appspot.com/updatePoints"

# Camera and object detection setup
fov_vertical_degrees = 60
distance = 19
plastic_bottles_detected = 0
total_small, total_medium, total_large = 0, 0, 0

# Main loop
try:
    while True:
        # Weight check
        weight = hx.get_weight_mean() - 117
        print(abs(int(weight)))

        # For weight value testing purposes
        # weight = 12  # Replace with actual weight reading
        # print(weight)

        # Check if the value of weight if greater than expected weight value
        if abs(weight) >= 9:
            print("The object has been place on loadcell")
        else:
            continue

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]
        print("RFID Number: ", rfid_uid)

        # API check RFID
        response_check_rfid = requests.post(
            url_check_rfid, data={'rfid': rfid_uid})
        if response_check_rfid.status_code == 200 and "yes" in response_check_rfid.text:
            print("RFID is registered in the database.")
            GPIO.output(buzzer_pin, True)
            time.sleep(0.2)
            GPIO.output(buzzer_pin, False)
            time.sleep(0.5)

            # Capturing of image script execution
            subprocess.run(['bash', 'capture_image.sh'], check=True)

            # Image processing
            IMAGE_DIR = os.path.join('.', 'capture')
            output_dir = os.path.join('.', 'output')
            os.makedirs(output_dir, exist_ok=True)
            model = YOLO(os.path.join('.', 'model', 'best4.pt'))
            threshold, pixels_to_cm = 0.5, 0.0264583333

            for image_file in [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.jpg', '.png', '.jpeg'))]:
                image_path = os.path.join(IMAGE_DIR, image_file)
                frame = cv2.imread(image_path)
                image_height = frame.shape[0]
                fov_vertical_radians = math.radians(fov_vertical_degrees)
                height_cm = int(
                    (image_height / frame.shape[0]) * distance * math.tan(fov_vertical_radians / 2) * 2)
                results = model(frame)[0]

                for result in results.boxes.data.tolist():
                    x1, y1, x2, y2, score, class_id = result
                    if score > threshold:
                        plastic_bottles_detected += 1
                        height_cm = int((y2 - y1) * pixels_to_cm)
                        cv2.rectangle(frame, (int(x1), int(y1)),
                                      (int(x2), int(y2)), (0, 255, 0), 4)
                        text = f'Height: {height_cm} '
                        cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)
                        class_label = results.names[int(class_id)].upper()
                        cv2.putText(frame, class_label, (int(x1), int(
                            y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

                output_image_path = os.path.join(output_dir, image_file)
                cv2.imwrite(output_image_path, frame)
                print("Object detection on images completed.")
                print(height_cm)

            # Object classification
            size_of_object = ""
            if weight <= 0 or height_cm == 21:
                size_of_object = "No Object"
                height_cm = 0
                GPIO.output(buzzer_pin, True)
                time.sleep(0.5)
                GPIO.output(buzzer_pin, False)
            elif weight >= 57:
                size_of_object = "Heavy Object"
                height_cm = 0
            elif weight <= 8:
                size_of_object = "Light Object"
                height_cm = 0
                GPIO.output(buzzer_pin, True)
                time.sleep(0.5)
                GPIO.output(buzzer_pin, False)
            elif height_cm >= 8:
                total_large += 1
                size_of_object = "Large"
                GPIO.output(buzzer_pin, True)
                time.sleep(0.2)
                GPIO.output(buzzer_pin, False)
                servo.angle = 90
                time.sleep(2)
            elif height_cm >= 5:
                total_medium += 1
                size_of_object = "Medium"
                GPIO.output(buzzer_pin, True)
                time.sleep(0.2)
                GPIO.output(buzzer_pin, False)
                servo.angle = 90
                time.sleep(2)
            elif height_cm >= 2:
                total_small += 1
                size_of_object = "Small"
                GPIO.output(buzzer_pin, True)
                time.sleep(0.2)
                GPIO.output(buzzer_pin, False)
                servo.angle = 90
                time.sleep(2)

            # API send data
            data = {'rfid': rfid_uid, 'height': height_cm, 'weight': int(
                weight), 'size': size_of_object, 'no_object': 'no' if not results.boxes.data.tolist() else 'yes'}
            files = {'image': open(image_path, 'rb')}
            response_update_data = requests.post(
                url_update_data, data=data, files=files)
            if response_update_data.status_code == 200:
                print("Data sent to the server successfully.")
            else:
                print("Failed to send data to the server.")

            # Reset servo angle
            servo.angle = 0
            time.sleep(2)

            # User prompt to continue
            choice = input("Do you want to continue (y/n)? ")
            if choice.lower() != "y":
                print("Total Small Plastic Bottle:", total_small)
                print("Total Medium Plastic Bottle:", total_medium)
                print("Total Large Plastic Bottle:", total_large)
                print("Total Plastic Bottles Detected:",
                      plastic_bottles_detected)
                total_points = (total_large * 3) + \
                    (total_medium * 2) + total_small
                print("Total Points:", total_points)

                # API update points
                data_to_update_points = {
                    'rfid': rfid_uid, 'additionalPoints': total_points}
                response_update_points = requests.post(
                    url_update_points, json=data_to_update_points)

                if response_update_points.status_code == 200:
                    print("Points updated in the database successfully.")
                else:
                    print("Failed to update points in the database.")
                break

finally:
    print("Program ended.")
    GPIO.cleanup()
