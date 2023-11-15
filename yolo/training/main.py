import os
import cv2
from ultralytics import YOLO
import subprocess
import time
import RPi.GPIO as GPIO
from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
from hx711 import HX711
from mfrc522 import SimpleMFRC522
import requests
import math

GPIO.setwarnings(False)

# Replace 'your_script.sh' with the path to your bash script.
script_path = 'capture_image.sh'

reader = SimpleMFRC522()

# MACARAEG PLACE
# Update with your actual API endpoint
url_check_rfid = "http://192.168.68.113:3001/check_rfid"
url_update_data = "http://192.168.68.113:3001/addDataHistory"
url_update_points = "http://192.168.68.113:3001/updatePoints"

# CUSTODIO PLACE
# Update with your actual API endpoint
# url_check_rfid = "http://192.168.1.105:3001/check_rfid"
# url_update_data = "http://192.168.1.105:3001/addDataHistory"
# url_update_points = "http://192.168.1.105:3001/updatePoints"

# Assuming the camera has a vertical field of view of 60 degrees,
# you may need to adjust this value based on your camera specifications.
fov_vertical_degrees = 60

# Set the actual distance from the camera to the object in inches
distance = 19

plastic_bottles_detected = 0
total_small = 0
total_medium = 0
total_large = 0
size_of_object = ""

# GPIO.cleanup()

id, text = reader.read()

# Set up pigpio pin factory
Device.pin_factory = PiGPIOFactory(host='localhost', port=8888)

# Your existing code
servo = AngularServo(26, min_pulse_width=0.0006, max_pulse_width=0.0023)

try:
    while True:
        weight = input("Enter weight: ")
        # Convert the RFID number to hexadecimal format
        rfidUID = format(id, 'x')

        rfidUID = rfidUID[:-2]  # Removing the last two characters from rfidUID

        print("RFID UID:", rfidUID)

        payload = {'rfid': rfidUID}
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}

        response_check_rfid = requests.post(
            url_check_rfid, data=payload, headers=headers)
        if response_check_rfid.status_code == 200:
            print("HTTP Response:", response_check_rfid.text)
            if "yes" in response_check_rfid.text:
                print("RFID is registered in the database.")

                # Run the script using the subprocess module.
                try:
                    subprocess.run(['bash', script_path], check=True)
                except subprocess.CalledProcessError as e:
                    print(f"An error occurred: {e}")
                else:
                    print("Script executed successfully.")

                    # Define the paths
                    # Replace 'images' with the folder containing your images
                    IMAGE_DIR = os.path.join('.', 'capture')
                    output_dir = os.path.join('.', 'output')

                    # Create the output directory if it doesn't exist
                    os.makedirs(output_dir, exist_ok=True)

                    # Path to the YOLO model weights
                    model_path = os.path.join('.', 'model', 'best4.pt')
                    # model_path = os.path.join('.', 'model', 'best1.pt')

                    # Load the YOLO model
                    model = YOLO(model_path)

                    # Threshold for object detection
                    threshold = 0.5

                    # Conversion factor from pixels to centimeters
                    pixels_to_cm = 0.0264583333  # Change this to your actual conversion factor

                    # List all image files in the directory
                    image_files = [f for f in os.listdir(
                        IMAGE_DIR) if f.endswith(('.jpg', '.png', '.jpeg'))]

                    for image_file in image_files:
                        image_path = os.path.join(IMAGE_DIR, image_file)

                        # Read the image
                        frame = cv2.imread(image_path)

                        # Assuming the image height is the vertical resolution of the image.
                        image_height = frame.shape[0]

                        # Convert the FOV to radians for the trigonometric calculations.
                        fov_vertical_radians = fov_vertical_degrees * \
                            (3.141592653589793 / 180.0)

                        # Calculate the height of the object in centimeters.
                        height_cm = int(
                            (image_height / frame.shape[0]) * distance * math.tan(fov_vertical_radians / 2) * 2)

                        # Perform object detection
                        results = model(frame)[0]

                        for result in results.boxes.data.tolist():
                            x1, y1, x2, y2, score, class_id = result

                            if score > threshold:
                                # Increment the counter for plastic bottles
                                plastic_bottles_detected += 1

                                # Calculate the height of the bounding box in centimeters
                                height_cm = int((y2 - y1) * pixels_to_cm)

                                # Draw the bounding box
                                cv2.rectangle(frame, (int(x1), int(y1)),
                                              (int(x2), int(y2)), (0, 255, 0), 4)

                                # Annotate the height in centimeters
                                text = f'Height: {height_cm} '
                                cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30),
                                            cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

                                # Make the class label text bigger
                                class_label = results.names[int(
                                    class_id)].upper()
                                cv2.putText(frame, class_label, (int(x1), int(y1) - 10),
                                            cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

                        # Save the annotated image to the output directory
                        output_image_path = os.path.join(
                            output_dir, image_file)
                        cv2.imwrite(output_image_path, frame)

                        print("Object detection on images completed.")

                    if int(weight) <= 19 or int(weight) >= 44:
                        print("Rejected")
                        size_of_object = "Invalid Object"
                        height_cm = 0
                        servo.angle = -90
                        time.sleep(2)
                    elif height_cm >= 8 and int(weight) >= 43:
                        print("Accepted Large Plastic Bottle")
                        total_large += 1
                        size_of_object = "Large"
                        servo.angle = 90
                        time.sleep(2)
                    elif height_cm >= 5 and int(weight) >= 30:
                        print("Accepted Medium Plastic Bottle")
                        total_medium += 1
                        size_of_object = "Medium"
                        servo.angle = 90
                        time.sleep(2)
                    elif height_cm >= 2 and int(weight) >= 20:
                        print("Accepted Small Plastic Bottle")
                        total_small += 1
                        size_of_object = "Small"
                        servo.angle = 90
                        time.sleep(2)
                    else:
                        pass

                    # Send RFID, height, and image data to the API
                    data = {'rfid': rfidUID, 'height': height_cm, 'weight': weight, 'size': size_of_object,
                            'no_object': 'no' if not results.boxes.data.tolist() else 'yes'}
                    files = {'image': open(image_path, 'rb')}
                    response_update_data = requests.post(
                        url_update_data, data=data, files=files)
                    if response_update_data.status_code == 200:
                        print("Data sent to the server successfully.")
                    else:
                        print("Failed to send data to the server.")

                    # Reset angle
                    servo.angle = 0
                    time.sleep(2)

            else:
                print("RFID is not registered in the database.")

        choice = input("Do you want to continue (y/n)? ")
        if choice.lower() != "y":
            print("Total Small Plastic Bottle:", total_small)
            print("Total Medium Plastic Bottle:", total_medium)
            print("Total Large Plastic Bottle:", total_large)
            print("Total Plastic Bottles Detected:", plastic_bottles_detected)
            # Replace POINTS_PER_BOTTLE with your actual points value
            total_points = (total_large * 3) + \
                (total_medium * 2) + (total_small)
            print("Total Points:", total_points)
            # Prepare the data to be sent to the API
            data_to_update_points = {'rfid': rfidUID,
                                     'additionalPoints': total_points}
            response_update_points = requests.post(
                url_update_points, json=data_to_update_points)

            if response_update_points.status_code == 200:
                print("Points updated in the database successfully.")
            else:
                print("Failed to update points in the database.")

            break

finally:
    print("Program ended.")

# Clean up GPIO at the end of the program
GPIO.cleanup()
