import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import os
import subprocess
from tkinter import Tk, Label, StringVar, Entry, Button
from mfrc522 import SimpleMFRC522
import requests
import time
import RPi.GPIO as GPIO
import math
from ultralytics import YOLO
from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
from hx711 import HX711

# API endpoints
url_check_rfid = "http://192.168.68.111:3001/check_rfid"
url_update_data = "http://192.168.68.111:3001/addDataHistory"
url_update_points = "http://192.168.68.111:3001/updatePoints"

global_points = 0
scan_processed = True  # Flag to indicate if a scan has been processed

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
buzzer_pin = 18
GPIO.setup(buzzer_pin, GPIO.OUT)

# Camera and object detection setup
fov_vertical_degrees = 60
distance = 19
plastic_bottles_detected = 0
total_small, total_medium, total_large = 0, 0, 0

app = tk.Tk()
app.title("ReVendo")
app.geometry("800x480")

global_points = ""

revendo_logo = None
label = None
get_points_button = None
check_balance_button = None
image_button = None
image_label = None
new_button = None
tutorial_header = None
tutorial_steps = None
button = None
image_tutorial = None
okay_button = None
balance_label = None
points_entry = None

# HX711 setup and calibration
hx = HX711(dout_pin=6, pd_sck_pin=5)
calibration_file = "calibration_data.txt"


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


def detect_weight():
    # Weight check
    # weight = hx.get_weight_mean()
    # print(abs(int(weight)) - 344)

    # For weight value testing purposes
    weight = 17  # Replace with actual weight reading
    print(weight)

    # Check if the value of weight if greater than expected weight value
    if abs(weight) >= 9:
        GPIO.output(buzzer_pin, True)
        time.sleep(0.2)
        GPIO.output(buzzer_pin, False)
        time.sleep(0.5)
    else:
        pass


def yolo_process():
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


def object_classification():
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


def reset_servo():
    # Reset servo angle
    servo.angle = 0
    time.sleep(2)


def insert_data():
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


def do_you_want_to_continue():
    # User prompt to continue
    choice = input("Do you want to continue (y/n)? ")
    if choice.lower() != "y":
        print("Total Small Plastic Bottle:", total_small)
        print("Total Medium Plastic Bottle:", total_medium)
        print("Total Large Plastic Bottle:", total_large)
        print("Total Plastic Bottles Detected:", plastic_bottles_detected)
        total_points = (total_large * 3) + (total_medium * 2) + total_small
        print("Total Points:", total_points)

        # API update points
        data_to_update_points = {'rfid': rfid_uid,
                                 'additionalPoints': total_points}
        response_update_points = requests.post(
            url_update_points, json=data_to_update_points)

        if response_update_points.status_code == 200:
            print("Points updated in the database successfully.")
        else:
            print("Failed to update points in the database.")

# Function to update points on the UI


def update_points():
    points_var.set(str(global_points))
    global scan_processed
    scan_processed = True  # Set the flag to indicate that the scan has been processed

# Handle RFID scan in check balance


def handle_rfid_scan():
    global global_points, scan_processed

    try:
        # RFID setup
        reader = SimpleMFRC522()

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]

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
                global_points = points

                # Update points on the UI
                update_points()

                # Rest of the code for processing when RFID is registered...
            else:
                print("RFID is not registered in the database. Attempt",
                      current_attempt)
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
    global global_points, scan_processed

    try:
        # RFID setup
        reader = SimpleMFRC522()

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]

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
                global_points = points

                # Update points on the UI
                update_points()

                # Rest of the code for processing when RFID is registered...
            else:
                print("RFID is not registered in the database. Attempt",
                      current_attempt)
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

# Testing


def trigger_script():
    os.system('python hello.py')

# Trigger claim points


def claim_points():
    os.system('python hello.py')


# DESTROY ELEMENTS
def destroy_elements_scan_rfid():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    new_button.place_forget()
    image_label.place_forget()
    tutorial_header.place_forget()

    menu()


def destroy_elements_tutorial():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    button.place_forget()
    image_tutorial.place_forget()

    menu()


def destroy_elements_process():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    background_label
    your_balance_header.place_forget()
    image_label_process.place_forget()
    points_entry.place_forget()
    largebottle_text.place_forget()
    smallbottle_text.place_forget()
    totalplasticbottle_text.place_forget()
    mediumbottle_text.place_forget()
    totalpoints_text.place_forget()
    smallbottle_text.place_forget()
    cancel_button.place_forget()
    claim_button.place_forget()

    points_var.set(str(""))

    menu()


def destroy_elements_check_points():
    balance_header.place_forget()
    balance_text.place_forget()
    button.place_forget()

    menu()


def destroy_elements_check_balance():
    tutorial_header.place_forget()
    image_label.place_forget()
    balance_label.place_forget()
    points_entry.place_forget()
    okay_button.place_forget()

    points_var.set(str(""))

    menu()

# Get points scan rfid


def get_points_scan_rfid_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='#8599e0', fg="white")
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    image_path = get_image_path("rfid-reader1.jpg")
    img = Image.open(image_path)
    img = img.resize((200, 150))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.5, anchor='center')

    new_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=process_plastic_bottles, bg='#8599e0', padx=20, fg='white')
    new_button.place(relx=0.5, rely=0.8, anchor='center',
                     width=150, height=40)

    # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()

    app.after(1000, handle_rfid_scan_get_points)

# Process plastic bottle page


def process_plastic_bottles():
    global your_balance_header, image_label_process, largebottle_text, balance_text, smallbottle_text, totalplasticbottle_text, mediumbottle_text, totalpoints_text, smallbottle_text, cancel_button, claim_button, points_entry

    your_balance_header = tk.Label(
        app, text="Balance", font=("Arial", 24), bg='#8599e0', fg='white')
    your_balance_header.place(relx=0.2, rely=0.1, anchor='center')

    image_path = get_image_path("process_plastic_bottle1.png")
    img = Image.open(image_path)
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

    largebot_value = 3  # Example value
    largebottle_text.config(state='normal')
    largebottle_text.delete(0, 'end')  # Clear the current value
    largebottle_text.insert(0, str(largebot_value))  # Insert the new value
    largebottle_text.config(state='disabled')

    totalplasticbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    totalplasticbottle_text.insert(0, "Your balance")
    totalplasticbottle_text.place(relx=0.41, rely=0.35, anchor='center',
                                  width=100, height=40)

    totalplasticbottle_value = 18  # Example value
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

    mediumbottle_value = 3  # Example value
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

    totalpoints_value = 123  # Example value
    totalpoints_text.config(state='normal')
    totalpoints_text.delete(0, 'end')  # Clear the current value
    totalpoints_text.insert(
        0, str(totalpoints_value))  # Insert the new value
    totalpoints_text.config(state='disabled')

    smallbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    smallbottle_text.insert(0, "Your balance")
    smallbottle_text.place(relx=0.21, rely=0.82, anchor='center',
                           width=60, height=40)

    smallbottle_value = 12  # Example value
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
    tutorial_header.place_forget()
    image_label.place_forget()
    new_button.place_forget()


def check_points_scan_rfid_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, balance_label, points_entry, okay_button

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 20), bg='#8599e0', fg='white')
    tutorial_header.place(relx=0.5, rely=0.1, anchor='center')

    image_path = get_image_path("rfid-reader1.jpg")
    img = Image.open(image_path)
    img = img.resize((190, 120))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.4, anchor='center')

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
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()

    # Trigger RFID scan explicitly
    # handle_rfid_scan()
    app.after(1000, handle_rfid_scan)


def check_points_page():
    global balance_header, balance_text, button, global_points, balance_label, points_entry, okay_button

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

    balance_value = global_points  # Display the global points variable
    update_balance_text(balance_value)

    button = tk.Button(app, text="Okay", font=(
        "Arial", 16), command=destroy_elements_check_points, bg='#8599e0', padx=20)
    button.place(relx=0.5, rely=0.6, anchor='center', width=150, height=40)

    tutorial_header.place_forget()
    new_button.place_forget()
    image_label.place_forget()


def show_image_modal():
    # Load the image for the pop-up
    modal_image_path = get_image_path("rfid-reader1.jpg")
    modal_img = Image.open(modal_image_path)
    modal_img = modal_img.resize((300, 200))
    modal_photo = ImageTk.PhotoImage(modal_img)

    # Create a Toplevel window for the modal
    modal_window = tk.Toplevel(app)
    modal_window.title("Scan your ReVendo Card")

    # Set the image in a Label widget
    modal_image_label = tk.Label(modal_window, image=modal_photo)
    modal_image_label.image = modal_photo
    modal_image_label.pack()

    # Add an "OK" button to close the modal
    ok_button = tk.Button(modal_window, text="OK",
                          command=modal_window.destroy)
    ok_button.pack()


def update_balance_text(value):
    balance_text.config(state='normal')
    balance_text.delete(0, 'end')  # Clear the current value
    balance_text.insert(0, str(value))  # Insert the new value
    balance_text.config(state='disabled')


def tutorial_page():
    global revendo_logo, label, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, image_tutorial, image_tutorial_path

    image_tutorial_path = get_image_path("tutorial.png")
    img = Image.open(image_tutorial_path)
    photo = ImageTk.PhotoImage(img)
    image_tutorial = tk.Label(app, image=photo)
    image_tutorial.image = photo
    image_tutorial.place(relx=0.5, rely=0.45, anchor='center')

    button = tk.Button(app, text="Okay", font=("Arial", 16),
                       command=destroy_elements_tutorial, bg='#8599e0', padx=20)
    button.place(relx=0.5, rely=0.9, anchor='center', width=150, height=40)

   # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()


def menu():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, image_tutorial, image_tutorial_path

    revendo_logo_path = get_image_path("RevendoLOGO.png")
    center_revendo_logo = Image.open(revendo_logo_path)
    center_revendo_logo = center_revendo_logo.resize((200, 200))

    center_revendo_logo = center_revendo_logo.convert("RGBA")
    image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)

    revendo_logo = tk.Label(app, image=image_with_alpha)
    revendo_logo.image = image_with_alpha
    revendo_logo.place(relx=0.5, rely=0.4, anchor='center')

    get_points_button = tk.Button(app, text="Get Points", font=("Arial", 16),
                                  command=get_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')

    get_points_button.place(
        relx=0.3, rely=0.7, anchor='center', width=130, height=40)

    check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 16),
                                     command=check_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')
    check_balance_button.place(
        relx=0.7, rely=0.7, anchor='center', width=160, height=40)

    tutorial_button_path = get_image_path("question1.png")
    tutorial_button = Image.open(tutorial_button_path)
    tutorial_button = tutorial_button.resize((30, 30))
    photo_button = ImageTk.PhotoImage(tutorial_button)

    image_button = tk.Button(app, image=photo_button,
                             command=tutorial_page, border=0)

    image_button.image = photo_button
    image_button.place(relx=0.5, rely=0.75, anchor='center')


# Maximum number of attempts allowed
max_attempts = 3
current_attempt = 1

# Variable to hold points
points_var = StringVar()
points_var.set(str(global_points))  # Initialize with global points

# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

image_path = get_image_path("ReVendo-newBG.jpg")
img = Image.open(image_path)
img = img.resize((800, 480))  # Set the size to 800x480
background_image = ImageTk.PhotoImage(img)
background_label = tk.Label(app, image=background_image)
background_label.place(x=0, y=0, relwidth=1, relheight=1)

# Set the application to run in full screen - uncomment this if you are in raspberry pi
# app.attributes('-fullscreen', True)
# app.wm_attributes('-fullscreen', True)

# Run the application
menu()
app.mainloop()
