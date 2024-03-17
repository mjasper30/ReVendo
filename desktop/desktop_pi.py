import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import os
import subprocess
import keyboard
import RPi.GPIO as GPIO
from tkinter import Tk, Label, StringVar, Entry, Button
from mfrc522 import SimpleMFRC522
from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
import requests
import time
import math
import cv2
import threading
from ultralytics import YOLO
from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
from hx711 import HX711
from functools import partial

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# HX711 setup and calibration
hx = HX711(dout_pin=6, pd_sck_pin=5)
calibration_file = "calibration_data.txt"

# Servo setup
Device.pin_factory = PiGPIOFactory(host='localhost', port=8888)
servo = AngularServo(26, min_pulse_width=0.0006, max_pulse_width=0.0023)

# Local
# url_check_rfid = "http://192.168.68.111:3001/check_rfid"
# url_update_data = "http://192.168.68.111:3001/addDataHistory"
# url_update_points = "http://192.168.68.111:3001/updatePoints"

# Hosting
url_check_rfid = "https://revendo-backend-main.onrender.com/check_rfid"
url_update_data = "https://revendo-backend-main.onrender.com/addDataHistory"
url_update_points = "https://revendo-backend-main.onrender.com/updatePoints"

global_rfid = ""
scan_processed = True  # Flag to indicate if a scan has been processed

# Camera and object detection setup
fov_vertical_degrees = 60
distance = 19
plastic_bottles_detected = 0
total_small, total_medium, total_large = 0, 0, 0

global_balance = ""
total_points = 0
weight = 0
height_cm = 0

rfid_uid = ""
check_more = True
check_yolo = True
sleep_me = 0

revendo_logo = None
get_points_button = None
check_balance_button = None
tutorial_button = None
rfid_reader_image = None
cancel_button = None
scan_rfid_header = None
okay_button = None
image_tutorial = None
balance_label = None
points_entry = None

# Variable to hold points
points_var = StringVar()
points_var.set(str(global_balance))  # Initialize with global points


def calibration_test():
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
        value = float(
            input("Enter the known weight in grams and press Enter: "))
        ratio = reading / value
        hx.set_scale_ratio(ratio)
        with open(calibration_file, "w") as file:
            file.write(str(ratio))


def update_real_time_values():
    global total_large, total_medium, total_small, plastic_bottles_detected, total_points
    largebottle_text.config(state='normal')
    largebottle_text.delete(0, 'end')
    largebottle_text.insert(0, str(total_large))
    largebottle_text.config(state='disabled')

    smallbottle_text.config(state='normal')
    smallbottle_text.delete(0, 'end')
    smallbottle_text.insert(0, str(total_small))
    smallbottle_text.config(state='disabled')

    mediumbottle_text.config(state='normal')
    mediumbottle_text.delete(0, 'end')
    mediumbottle_text.insert(0, str(total_medium))
    mediumbottle_text.config(state='disabled')

    totalplasticbottle_text.config(state='normal')
    totalplasticbottle_text.delete(0, 'end')
    totalplasticbottle_text.insert(0, str(plastic_bottles_detected))
    totalplasticbottle_text.config(state='disabled')

    totalpoints_text.config(state='normal')
    totalpoints_text.delete(0, 'end')
    totalpoints_text.insert(0, str(total_points))
    totalpoints_text.config(state='disabled')

    # Schedule the update again after 1000 milliseconds (1 second)
    app.after(1000, update_real_time_values)


def get_points_process():
    global sleep_me, total_points, plastic_bottles_detected, total_small, total_medium, total_large, global_rfid, check_more, check_yolo
    # weight = 6 #test

    while check_more:
        # Weight check
        weight = hx.get_weight_mean() - 130
        print("Weight: " + str(abs(int(weight))) + " grams")

        # For weight value testing purposes
        # print("Weight: ", weight)
        # weight = 15  # test

        if (sleep_me == 30):
            check_more = False
            check_yolo = False
            sleep_me = 0
            destroy_elements_process()
            break

        # Check if the value of weight if greater than expected weight value
        if abs(weight) >= 9:
            time.sleep(1)
            # continue
            check_more = False
            print("The object has been place on loadcell")
        else:
            time.sleep(1)
            sleep_me += 1
            continue

    if (check_yolo == True):
        # Capturing of image script execution
        subprocess.run(['bash', 'capture_image.sh'], check=True)

        # Image processing
        IMAGE_DIR = os.path.join('.', 'capture')
        output_dir = os.path.join('.', 'output')
        os.makedirs(output_dir, exist_ok=True)
        model = YOLO(os.path.join('.', 'model', 'best8.pt'))
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
                    formatted_score = " {:.2f}".format(score)
                    cv2.rectangle(frame, (int(x1), int(y1)),
                                  (int(x2), int(y2)), (0, 255, 0), 4)
                    text = f'Height: {height_cm}'
                    cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)
                    class_label = results.names[int(
                        class_id)].upper() + str(formatted_score)
                    cv2.putText(frame, class_label, (int(x1), int(
                        y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

            output_image_path = os.path.join(output_dir, image_file)
            cv2.imwrite(output_image_path, frame)
            print("Object detection on images completed.")
            print("Height: ", height_cm)

            # Object classification
            size_of_object = ""
            # weight = 12  # for testing purposes
            # height_cm = 8  # L 8, M 5, S 2 for testing purposes
            if height_cm == 21:
                size_of_object = "Invalid Object"
                print(size_of_object)
            elif weight >= 57:
                size_of_object = "Heavy Object"
                print(size_of_object)
                height_cm = 0
            elif height_cm >= 8:
                total_large += 1
                plastic_bottles_detected += 1
                size_of_object = "Large"
                print(size_of_object)
                servo.angle = 90
                time.sleep(2)
            elif height_cm >= 5:
                total_medium += 1
                plastic_bottles_detected += 1
                size_of_object = "Medium"
                print(size_of_object)
                servo.angle = 90
                time.sleep(2)
            elif height_cm >= 2:
                total_small += 1
                plastic_bottles_detected += 1
                size_of_object = "Small"
                print(size_of_object)
                servo.angle = 90
                time.sleep(2)

            # Reset servo angle
            servo.angle = 0
            time.sleep(2)

            # Ultrasonic sensor code checking before sending to database

            # Claim Points - API send data
            data = {'rfid': global_rfid, 'height': height_cm, 'weight': int(
                weight), 'size': size_of_object, 'no_object': 'no' if not results.boxes.data.tolist() else 'yes'}
            files = {'image': open(output_image_path, 'rb')}
            response_update_data = requests.post(
                url_update_data, data=data, files=files)
            if response_update_data.status_code == 200:
                print("Data sent to the server successfully.")
                total_points = (total_large * 3) + \
                    (total_medium * 2) + total_small
                print("Total Points:", total_points)
                app.after(100, update_real_time_values)
            else:
                print("Failed to send data to the server.")

            check_more = True

        app.after(3000, get_points_process)

# Trigger claim points


def claim_points():
    global total_points, check_more, check_yolo, total_small, total_medium, total_large, plastic_bottles_detected, total_points

    print("Total Small Plastic Bottle:", total_small)
    print("Total Medium Plastic Bottle:", total_medium)
    print("Total Large Plastic Bottle:", total_large)
    print("Total Plastic Bottles Detected:", plastic_bottles_detected)
    total_points = (total_large * 3) + (total_medium * 2) + total_small
    print("Total Points:", total_points)

    # API update points
    data_to_update_points = {'rfid': global_rfid,
                             'additionalPoints': total_points}
    response_update_points = requests.post(
        url_update_points, json=data_to_update_points)

    if response_update_points.status_code == 200:
        print("Points updated in the database successfully.")
        check_more = False
        check_yolo = False
        app.after(100, destroy_elements_process)
    else:
        print("Failed to update points in the database.")
        check_more = False
        app.after(100, destroy_elements_process)

# Function to update points on the UI


def update_points():
    points_var.set(str(global_balance))
    global scan_processed
    scan_processed = True  # Set the flag to indicate that the scan has been processed

# Handle RFID scan in check balance


def handle_rfid_scan():
    global global_balance, scan_processed, global_rfid

    try:
        # RFID setup
        reader = SimpleMFRC522()

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]

        # Update the global rfid variable
        global_rfid = rfid_uid

        # Process scan only if the flag is True
        if scan_processed:
            # API check RFID
            response_check_rfid = requests.post(
                url_check_rfid, data={'rfid': rfid_uid})
            if response_check_rfid.status_code == 200:
                print("RFID is registered in the database.")
                print("RFID Number:", rfid_uid)
                # Extract points information from the API response
                points = response_check_rfid.json().get('points', 0)

                print("Points:", points)

                # Update the global points variable
                global_balance = points

                # Update points on the UI
                update_points()

                # Rest of the code for processing when RFID is registered...
            else:
                print("RFID is not registered in the database. Attempt")
                # Additional actions when RFID is not registered...

            # Set the flag to False to prevent further scans until the next update
            scan_processed = True

    except KeyboardInterrupt:
        print("KeyboardInterrupt. Exiting...")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Additional error handling if needed

    finally:
        # Cleanup GPIO after RFID operations
        GPIO.cleanup()

# Handle RFID scan in get points


def handle_rfid_scan_get_points():
    global global_balance, scan_processed, global_rfid, check_more, check_yolo

    try:
        # RFID setup
        reader = SimpleMFRC522()

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]

        # Update the global rfid variable
        global_rfid = rfid_uid

        check_more = True
        check_yolo = True

        # Process scan only if the flag is True
        if scan_processed:
            # API check RFID
            response_check_rfid = requests.post(
                url_check_rfid, data={'rfid': rfid_uid})
            if response_check_rfid.status_code == 200:
                print("RFID is registered in the database.")
                print("RFID Number:", rfid_uid)
                # Extract points information from the API response
                points = response_check_rfid.json().get('points', 0)

                print("Points:", points)

                # Update the global points variable
                global_balance = points

                # Update points on the UI
                update_points()

                # Rest of the code for processing when RFID is registered...
            else:
                print("RFID is not registered in the database.")
                # Additional actions when RFID is not registered...

            # Set the flag to False to prevent further scans until the next update
            scan_processed = True

    except KeyboardInterrupt:
        print("KeyboardInterrupt. Exiting...")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Additional error handling if needed

    finally:
        # Cleanup GPIO after RFID operations
        # GPIO.cleanup()
        app.after(1000, process_plastic_bottles)

# Function to exit the program


def exit_program():
    print("Exiting program...")
    app.destroy()

# Function to get the script's directory


def get_script_directory():
    return os.path.dirname(os.path.abspath(__file__))

# Function to construct a relative path to an image file


def get_image_path(image_filename):
    return os.path.join(get_script_directory(), image_filename)

# DESTROY ELEMENTS


def destroy_elements_scan_rfid():
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    tutorial_button.destroy()
    cancel_button.destroy()
    rfid_reader_image.destroy()
    scan_rfid_header.destroy()

    menu()


def destroy_elements_tutorial():
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    okay_button.destroy()
    image_tutorial.destroy()

    menu()


def destroy_elements_process():
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    tutorial_button.destroy()
    background.destroy()
    your_balance_header.destroy()
    image_label_process.destroy()
    points_entry.destroy()
    largebottle_text.destroy()
    smallbottle_text.destroy()
    totalplasticbottle_text.destroy()
    mediumbottle_text.destroy()
    totalpoints_text.destroy()
    smallbottle_text.destroy()
    cancel_button.destroy()
    claim_button.destroy()

    points_var.set(str(""))
    check_more = True
    total_points = 0
    total_small = 0
    total_medium = 0
    total_large = 0
    plastic_bottles_detected = 0

    menu()


def destroy_elements_check_points():
    balance_header.destroy()
    balance_text.destroy()
    okay_button.destroy()

    menu()


def destroy_elements_check_balance():
    scan_rfid_header.destroy()
    rfid_reader_image.destroy()
    balance_label.destroy()
    points_entry.destroy()
    okay_button.destroy()

    points_var.set(str(""))

    menu()


def get_points_scan_rfid_page():
    global rfid_reader_image, cancel_button, scan_rfid_header

    scan_rfid_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='#8599e0', fg="white")
    scan_rfid_header.place(relx=0.5, rely=0.2, anchor='center')

    scan_rfid_image_path = get_image_path("rfid-reader.jpg")
    img = Image.open(scan_rfid_image_path)
    img = img.resize((200, 150))
    photo = ImageTk.PhotoImage(img)
    rfid_reader_image = tk.Label(app, image=photo)
    rfid_reader_image.image = photo
    rfid_reader_image.place(relx=0.5, rely=0.5, anchor='center')

    cancel_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=process_plastic_bottles, bg='#8599e0', padx=20, fg='white')
    cancel_button.place(relx=0.5, rely=0.8, anchor='center',
                        width=150, height=40)

    # Hiding specific elements
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    tutorial_button.destroy()

    app.after(1000, handle_rfid_scan_get_points)


def process_plastic_bottles():
    global your_balance_header, image_label_process, largebottle_text, balance_text, total_points, smallbottle_text, totalplasticbottle_text, mediumbottle_text, totalpoints_text, smallbottle_text, cancel_button, claim_button, points_entry

    your_balance_header = tk.Label(
        app, text="Balance", font=("Arial", 24), bg='#8599e0', fg='white')
    your_balance_header.place(relx=0.2, rely=0.1, anchor='center')

    scan_rfid_image_path = get_image_path("process-plastic-bottle-image.png")
    img = Image.open(scan_rfid_image_path)
    img = img.resize((380, 350))
    photo = ImageTk.PhotoImage(img)
    image_label_process = tk.Label(app, image=photo)
    image_label_process.image = photo
    image_label_process.place(relx=0.3, rely=0.55, anchor='center')

    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=(
        "Helvetica", 16), state='readonly', readonlybackground='white', justify='center')
    points_entry.place(relx=0.5, rely=0.1, anchor='center',
                       width=300, height=40)

    largebottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    largebottle_text.insert(0, "Your balance")
    largebottle_text.place(relx=0.21, rely=0.35, anchor='center',
                           width=60, height=40)

    largebot_value = 0  # Example value
    largebottle_text.config(state='normal')
    largebottle_text.delete(0, 'end')  # Clear the current value
    largebottle_text.insert(0, str(largebot_value))  # Insert the new value
    largebottle_text.config(state='disabled')

    totalplasticbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    totalplasticbottle_text.insert(0, "Your balance")
    totalplasticbottle_text.place(relx=0.41, rely=0.35, anchor='center',
                                  width=100, height=40)

    totalplasticbottle_value = 0  # Example value
    totalplasticbottle_text.config(state='normal')
    totalplasticbottle_text.delete(0, 'end')  # Clear the current value
    totalplasticbottle_text.insert(
        0, str(totalplasticbottle_value))  # Insert the new value
    totalplasticbottle_text.config(state='disabled')

    mediumbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    mediumbottle_text.insert(0, "Your balance")
    mediumbottle_text.place(relx=0.21, rely=0.6, anchor='center',
                            width=60, height=40)

    mediumbottle_value = 0  # Example value
    mediumbottle_text.config(state='normal')
    mediumbottle_text.delete(0, 'end')  # Clear the current value
    mediumbottle_text.insert(0, str(mediumbottle_value)
                             )  # Insert the new value
    mediumbottle_text.config(state='disabled')

    totalpoints_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    totalpoints_text.insert(0, "Your balance")
    totalpoints_text.place(relx=0.41, rely=0.6, anchor='center',
                           width=100, height=40)

    totalpoints_value = 0  # Example value
    totalpoints_text.config(state='normal')
    totalpoints_text.delete(0, 'end')  # Clear the current value
    totalpoints_text.insert(
        0, str(total_points))  # Insert the new value
    totalpoints_text.config(state='disabled')

    smallbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    smallbottle_text.insert(0, "Your balance")
    smallbottle_text.place(relx=0.21, rely=0.82, anchor='center',
                           width=60, height=40)

    smallbottle_value = 0  # Example value
    smallbottle_text.config(state='normal')
    smallbottle_text.delete(0, 'end')  # Clear the current value
    smallbottle_text.insert(0, str(smallbottle_value)
                            )  # Insert the new value
    smallbottle_text.config(state='disabled')

    cancel_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=destroy_elements_process, bg='#8599e0', padx=20, fg='white')
    cancel_button.place(relx=0.8, rely=0.8, anchor='center',
                        width=150, height=40)

    claim_button = tk.Button(app, text="Claim Points", font=(
        "Arial", 16), command=claim_points, bg='#8599e0', padx=20, fg='white')
    claim_button.place(relx=0.8, rely=0.7, anchor='center',
                       width=150, height=40)

    # Hiding specific elements
    scan_rfid_header.destroy()
    rfid_reader_image.destroy()
    cancel_button.destroy()

    app.after(1000, get_points_process)


def check_points_scan_rfid_page():
    global rfid_reader_image, scan_rfid_header, okay_button, balance_label, points_entry, okay_button

    scan_rfid_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 20), bg='#8599e0', fg='white')
    scan_rfid_header.place(relx=0.5, rely=0.1, anchor='center')

    scan_rfid_image_path = get_image_path("rfid-reader.jpg")
    img = Image.open(scan_rfid_image_path)
    img = img.resize((190, 120))
    photo = ImageTk.PhotoImage(img)
    rfid_reader_image = tk.Label(app, image=photo)
    rfid_reader_image.image = photo
    rfid_reader_image.place(relx=0.5, rely=0.4, anchor='center')

    # Label to display "Balance"
    balance_label = Label(app, text="Your Balance", font=(
        "Helvetica", 14), bg='#8599e0', fg='white')
    balance_label.place(relx=0.5, rely=0.6, anchor='center',
                        width=250, height=40)

    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=(
        "Helvetica", 16), state='readonly', readonlybackground='white', justify='center')
    points_entry.place(relx=0.5, rely=0.7, anchor='center',
                       width=250, height=40)

    # Okay button
    okay_button = tk.Button(app, text="Okay", font=(
        "Arial", 16), command=destroy_elements_check_balance, bg='#8599e0', padx=20, fg='white')
    okay_button.place(relx=0.5, rely=0.8, anchor='center',
                      width=150, height=40)

    # Hiding specific elements
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    tutorial_button.destroy()

    # Trigger RFID scan explicitly
    # handle_rfid_scan()
    app.after(1000, handle_rfid_scan)
    global balance_header, balance_text, global_balance

    balance_header = tk.Label(app, text="Your Balance", font=(
        "Arial", 24), bg='#8599e0', fg='white')
    balance_header.place(relx=0.5, rely=0.4, anchor='center')

    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=(
        "Helvetica", 16), state='readonly', readonlybackground='white', bg='#8599e0', justify='center')
    points_entry.place(relx=0.5, rely=0.5, anchor='center',
                       width=400, height=40)

    balance_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#8599e0', justify='center')
    balance_text.insert(0, "Your balance")
    balance_text.place(relx=0.5, rely=0.5, anchor='center',
                       width=400, height=40)

    balance_value = global_balance  # Display the global points variable
    update_balance_text(balance_value)

    okay_button = tk.Button(app, text="Okay", font=(
        "Arial", 16), command=destroy_elements_check_points, bg='#8599e0', padx=20)
    okay_button.place(relx=0.5, rely=0.6, anchor='center',
                      width=150, height=40)

    scan_rfid_header.destroy()
    cancel_button.destroy()
    rfid_reader_image.destroy()


def update_balance_text(value):
    balance_text.config(state='normal')
    balance_text.delete(0, 'end')  # Clear the current value
    balance_text.insert(0, str(value))  # Insert the new value
    balance_text.config(state='disabled')


def tutorial_page():
    global okay_button, image_tutorial

    # Tutorial Picture
    image_tutorial_path = get_image_path("tutorial.png")
    img = Image.open(image_tutorial_path)
    photo = ImageTk.PhotoImage(img)
    image_tutorial = tk.Label(app, image=photo)
    image_tutorial.image = photo
    image_tutorial.place(relx=0.5, rely=0.45, anchor='center')

    # Okay Button - Tutorial
    okay_button = tk.Button(app, text="Okay", font=("Arial", 16),
                            command=destroy_elements_tutorial, bg='#8599e0', padx=20)
    okay_button.place(relx=0.5, rely=0.9, anchor='center',
                      width=150, height=40)

   # Hiding specific elements
    revendo_logo.destroy()
    get_points_button.destroy()
    check_balance_button.destroy()
    tutorial_button.destroy()


def menu():
    global revendo_logo, get_points_button, check_balance_button, tutorial_button

    # Revendo Logo
    revendo_logo_path = get_image_path("revendo-logo.png")
    center_revendo_logo = Image.open(revendo_logo_path)
    center_revendo_logo = center_revendo_logo.resize((200, 200))
    center_revendo_logo = center_revendo_logo.convert("RGBA")
    image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)
    revendo_logo = tk.Label(app, image=image_with_alpha)
    revendo_logo.image = image_with_alpha
    revendo_logo.place(relx=0.5, rely=0.4, anchor='center')

    # Get Points Button
    get_points_button = tk.Button(app, text="Get Points", font=("Arial", 16),
                                  command=get_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')
    get_points_button.place(
        relx=0.3, rely=0.7, anchor='center', width=130, height=40)

    # Check Balance Button
    check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 16),
                                     command=check_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')
    check_balance_button.place(
        relx=0.7, rely=0.7, anchor='center', width=160, height=40)

    # Tutorial Button
    tutorial_button_path = get_image_path("question.png")
    tutorial_button = Image.open(tutorial_button_path)
    tutorial_button = tutorial_button.resize((30, 30))
    photo_button = ImageTk.PhotoImage(tutorial_button)
    tutorial_button = tk.Button(app, image=photo_button,
                                command=tutorial_page, border=0)
    tutorial_button.image = photo_button
    tutorial_button.place(relx=0.5, rely=0.75, anchor='center')


app = tk.Tk()
app.title("ReVendo")
app.geometry("800x480")

# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

image_path = get_image_path("revendo-background.jpg")
img = Image.open(image_path)
img = img.resize((800, 480))  # Set the size to 800x480
background_image = ImageTk.PhotoImage(img)
background = tk.Label(app, image=background_image)
background.place(x=0, y=0, relwidth=1, relheight=1)

# Set the application to run in full screen - uncomment this if you are in raspberry pi
app.attributes('-fullscreen', True)
# app.wm_attributes('-fullscreen', True)

# Run the application
calibration_test()
menu()
app.mainloop()
