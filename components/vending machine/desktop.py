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

# Set GPIO Pins
GPIO_TRIGGER = 17
GPIO_ECHO = 18

# Set the GPIO pin for the buzzer
buzzer_pin = 21

# Set up the buzzer pin as output
GPIO.setup(buzzer_pin, GPIO.OUT)

# HX711 setup and calibration
hx = HX711(dout_pin=6, pd_sck_pin=5)
calibration_file = "calibration_data.txt"

# Servo setup
Device.pin_factory = PiGPIOFactory(host='localhost', port=8888)
servo = AngularServo(26, min_pulse_width=0.0006, max_pulse_width=0.0023)

# Local
#url_check_rfid = "http://192.168.43.85:3001/check_rfid"
#url_update_data = "http://192.168.43.85:3001/addDataHistory"
#url_update_points = "http://192.168.43.85:3001/updatePoints"

# Hosting
url_check_rfid = "http://revendo-backend-main.onrender.com/check_rfid"
url_update_data = "http://revendo-backend-main.onrender.com/addDataHistory"
url_update_points = "http://revendo-backend-main.onrender.com/updatePoints"
url_update_light_status = "http://revendo-backend-main.onrender.com/update_light_status"
url_update_bin_status = "http://revendo-backend-main.onrender.com/api/getStorageStatus"

global_points = 0
global_rfid = ""
scan_processed = True  # Flag to indicate if a scan has been processed

# Camera and object detection setup
fov_vertical_degrees = 60
distance = 23
plastic_bottles_detected = 0
total_small, total_medium, total_large = 0, 0, 0

app = tk.Tk()
app.title("ReVendo")
app.geometry("800x480")

global_points = ""
total_points = 0
weight = 0
height_cm = 0
sleep_me = 0
timer_counter = 0
distance_threshold = 24.0
adjust_weight = 277

rfid_uid = ""
check_more = True
check_more1 = True

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

# Global flag to control the loop in the long-running task
stop_long_task = False
stop_long_task_bin = False

# Initialize index
index = 0

# List of words to cycle through
words = ["Place your plastic bottle", "Processing...", "Accepted", "Rejected", "Heavy Object"]
# List of corresponding GIF filenames
gif_filenames = [
    "processing.gif", "processing.gif", "accept.gif", "reject.gif", "reject.gif"
]

distance_status = True

class AnimatedGIFLabel(tk.Label):
    def __init__(self, master, filename):
        self.master = master
        self.filename = filename
        self.gif = Image.open(filename)
        self.frames = []
        self.load_frames()
        self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        super().__init__(master, image=self.photo)

    def load_frames(self):
        try:
            while True:
                self.frames.append(self.gif.copy())
                self.gif.seek(len(self.frames))
        except EOFError:
            pass

    def next_frame(self):
        self.idx += 1
        if self.idx >= len(self.frames):
            self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        self.config(image=self.photo)
        self.master.after(100, self.next_frame)

    def resize(self, width, height):
        for i, frame in enumerate(self.frames):
            self.frames[i] = frame.resize((width, height), Image.LANCZOS)

    def update_filename(self, filename):
        self.filename = filename
        self.gif = Image.open(filename)
        self.frames.clear()
        self.load_frames()
        self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        self.config(image=self.photo)

animated_label = AnimatedGIFLabel(
    app, "/home/revendo/Desktop/ReVendo-main/processing.gif")
status_text = tk.Label(app, text="")

def distance_relay():
    # Set GPIO direction (IN / OUT)
    GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
    GPIO.setup(GPIO_ECHO, GPIO.IN)

    # Set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)

    # Set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    StartTime = time.time()
    StopTime = time.time()

    # Save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()

    # Save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    # Time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # Multiply with the sonic speed (34300 cm/s) and divide by 2, because there and back
    distance = int((TimeElapsed * 34300) / 2)

    return distance

def update_label(index):
    global animated_label  # Make animated_label accessible within the function
    # Update label text with the word at the current index
    status_text.config(text=words[index])
    # Update the GIF based on the current word
    animated_label.update_filename(
        "/home/revendo/Desktop/ReVendo-main/" + gif_filenames[index])
    animated_label.resize(200, 200)
    # Increment the index or reset to 0 if it exceeds the length of the list
    #index = (index + 1) % len(words)
    # Schedule the update_label function to run again after 1000 milliseconds (1 second)
    #app.after(5000, update_label, index)

def buzz(pitch, duration):
    period = 1.0 / pitch
    delay = period / 2
    cycles = int(duration * pitch)
    for i in range(cycles):
        GPIO.output(buzzer_pin, True)
        time.sleep(delay)
        GPIO.output(buzzer_pin, False)
        time.sleep(delay)

def accept_tone():
    buzz(1000, 0.5)  # Change pitch and duration as needed
    time.sleep(0.2)   # Pause between tones

def reject_tone():
    buzz(300, 0.5)   # Change pitch and duration as needed
    time.sleep(0.2)   # Pause between tones

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
        value = float(input("Enter the known weight in grams and press Enter: "))
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
    global timer_counter, distance_status, total_points, plastic_bottles_detected, total_small, total_medium, total_large, global_rfid, check_more, check_more1, stop_long_task
    
    while check_more:
        timer_counter = 0
        if stop_long_task:
            print("Task stopped.")
            stop_long_task = False
            return
        
        update_label(0)    
        # Weight check
        weight = hx.get_weight_mean() - adjust_weight
        print("Weight: " + str(abs(int(weight))) + " grams")
            
        #Check if the value of weight if greater than expected weight value
        if abs(weight) >= 9:
            #continue #Uncomment this to weight test
            check_more = False
            print("The object has been place on loadcell")
        else:
            continue
    
        if(check_more1 == True):
            update_label(1)
            # Capturing of image script execution
            subprocess.run(['bash', 'capture_image.sh'], check=True)

            # Image processing
            IMAGE_DIR = os.path.join('.', 'capture')
            output_dir = os.path.join('.', 'output')
            os.makedirs(output_dir, exist_ok=True)
            model = YOLO(os.path.join('.', 'model', 'best9.pt'))
            threshold, pixels_to_cm = 0.5 , 0.0264583333

            for image_file in [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.jpg', '.png', '.jpeg'))]:
                image_path = os.path.join(IMAGE_DIR, image_file)
                frame = cv2.imread(image_path)
                image_height = frame.shape[0]
                fov_vertical_radians = math.radians(fov_vertical_degrees)
                height_cm = int((image_height / frame.shape[0]) * distance * math.tan(fov_vertical_radians / 2) * 2)
                results = model(frame)[0]

                for result in results.boxes.data.tolist():
                    x1, y1, x2, y2, score, class_id = result
                    if score > threshold:
                        height_cm = int((y2 - y1) * pixels_to_cm)
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
                        text = f'Height: {height_cm}'
                        cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)
                        class_label = results.names[int(class_id)].upper() + "  {:.2f}".format(score)
                        cv2.putText(frame, class_label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)
                        print("Class Label: ", class_label)
                        
                output_image_path = os.path.join(output_dir, image_file)
                cv2.imwrite(output_image_path, frame)
                print("Object detection on images completed.")
                print("Height cm", height_cm)
    
                # Object classification
                size_of_object = ""
                #weight = 12 #for testing purposes
                #height_cm = 8 #L 8, M 5, S 2 for testing purposes
                
                if weight >= 57:
                    reject_tone()
                    update_label(4)
                    size_of_object = "Heavy Object"
                    height_cm = 0
                    servo.angle = 0
                    distance_status = False
                elif height_cm == 26:
                    reject_tone()
                    update_label(3)
                    height_cm = 0
                    size_of_object = "Invalid"
                    servo.angle = 0
                    distance_status = False
                elif height_cm >= 2:
                    accept_tone()
                    update_label(2)
                    servo.angle = 90
                    distance_status = True
                
                while distance_status:
                    dist = distance_relay()
                    print ("Measured Distance = %.1f cm" % dist)
                    
                    if dist < distance_threshold:
                        print("Bottle has been pass inside")
                        print(size_of_object)
                        timer_counter = 0
                        if height_cm >= 8:
                            plastic_bottles_detected += 1
                            total_large += 1
                            size_of_object = "Large"
                        elif height_cm >= 5:
                            plastic_bottles_detected += 1
                            total_medium += 1                    
                            size_of_object = "Medium"
                        elif height_cm >= 2:
                            plastic_bottles_detected += 1
                            total_small += 1
                            size_of_object = "Small"
                        # Reset servo angle
                        servo.angle = 0
                        break
                    else:
                        print("No bottle has been pass yet")
                        
                        if timer_counter == 20:
                            update_label(3)
                            print("Invalid there is no bottle pass inside the machine")
                            # Reset servo angle
                            servo.angle = 0
                            break
                    
                    time.sleep(0.1)
                    timer_counter+=1
                
                # Send data and image to database per bottle that is processed
                data = {'rfid': global_rfid, 'height': height_cm, 'weight': int(weight), 'size': size_of_object, 'no_object': 'no' if not results.boxes.data.tolist() or size_of_object == "Heavy Object" else 'yes'}
                files = {'image': open(output_image_path, 'rb')}
                response_update_data = requests.post(url_update_data, data=data, files=files)
                if response_update_data.status_code == 200:
                    print("Data sent to the server successfully.")
                    total_points = (total_large * 3) + (total_medium * 2) + total_small
                    print("Total Points:", total_points)
                    app.after(0, update_real_time_values)
                else:
                    print("Failed to send data to the server.")
                    
                print("Height: ", height_cm)
                update_label(0)
                check_more = True
                distance_status = True
                time.sleep(1)
            
# Trigger claim points
def claim_points():
    global stop_long_task, check_more, total_points, check_more, check_more1, total_small, total_medium, total_large, plastic_bottles_detected, total_points

    stop_long_task = True
    total_points = (total_large * 3) + (total_medium * 2) + total_small
    
    print("Total Small Plastic Bottle:", total_small)
    print("Total Medium Plastic Bottle:", total_medium)
    print("Total Large Plastic Bottle:", total_large)
    print("Total Plastic Bottles Detected:", plastic_bottles_detected)
    print("Total Points:", total_points)

    # API update points
    data_to_update_points = {'rfid': global_rfid, 'additionalPoints': total_points}
    response_update_points = requests.post(url_update_points, json=data_to_update_points)

    if response_update_points.status_code == 200:
        print("Points updated in the database successfully.")
        check_more = False
        check_more1 = False
        app.after(0, destroy_elements_process)
    else:
        print("Failed to update points in the database.")
        check_more = False
        app.after(0, destroy_elements_process)
    
    data = {'status': "off"}
    response_light_update_data = requests.put(url_update_light_status, data=data)
    if response_light_update_data.status_code == 200:
        print("Light update to the server successfully.")
    else:
        print("Failed to update data to the server.")
                
# Function to update points on the UI
def update_points():
    points_var.set(str(global_points))
    global scan_processed
    scan_processed = True  # Set the flag to indicate that the scan has been processed

# Handle RFID scan in check balance
def handle_rfid_scan():
    global global_points, scan_processed, global_rfid
    
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
            accept_tone()
            # API check RFID
            response_check_rfid = requests.post(url_check_rfid, data={'rfid': rfid_uid})
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
                print("RFID is not registered in the database. Attempt", current_attempt)
                # Additional actions when RFID is not registered...

            # Set the flag to False to prevent further scans until the next update
            scan_processed = True

    except KeyboardInterrupt:
        print("KeyboardInterrupt. Exiting...")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Additional error handling if needed

    finally:
        print("RFID Scan Done")
        # Cleanup GPIO after RFID operations
        # GPIO.cleanup()

# Handle RFID scan in get points
def handle_rfid_scan_get_points():
    global global_points, scan_processed, global_rfid, check_more, check_more1
    
    try:
        # RFID setup
        reader = SimpleMFRC522()

        # RFID read
        id, text = reader.read()
        rfid_uid = format(id, 'x')[:-2]
        
        # Update the global rfid variable
        global_rfid = rfid_uid 
        
        check_more = True
        check_more1 = True

        # Process scan only if the flag is True
        if scan_processed:
            accept_tone()
            # API check RFID
            response_check_rfid = requests.post(url_check_rfid, data={'rfid': rfid_uid})
            if response_check_rfid.status_code == 200:
                print("RFID is registered in the database.")
                print("RFID Number:", rfid_uid)
                # Extract points information from the API response
                points = response_check_rfid.json().get('points', 0)

                print("Points:", points)
                
                # Send data and image to database per bottle that is processed
                data = {'status': "on"}
                response_light_update_data = requests.put(url_update_light_status, data=data)
                if response_light_update_data.status_code == 200:
                    print("Light update to the server successfully.")
                else:
                    print("Failed to update data to the server.")
                
                # Update the global points variable
                global_points = points  

                # Update points on the UI
                update_points()

                # Rest of the code for processing when RFID is registered...
            else:
                print("RFID is not registered in the database.")
                # Additional actions when RFID is not registered...

    except KeyboardInterrupt:
        print("KeyboardInterrupt. Exiting...")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Additional error handling if needed

    finally:
        # Cleanup GPIO after RFID operations
        #GPIO.cleanup()
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

# DESTROY ELEMENTS
def destroy_bin_warning():
    bin_header.place_forget()
    
    menu()
    
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
    button.place_forget()
    image_tutorial.place_forget()

    menu()

def destroy_elements_get_points_scan():
    global stop_long_task
    
    stop_long_task = True
    tutorial_header.place_forget()
    image_label.place_forget()
    
    menu()

def destroy_elements_process():
    global stop_long_task, check_more, total_points, total_small, total_medium, total_large, plastic_bottles_detected
    
    data = {'status': "off"}
    response_light_update_data = requests.put(url_update_light_status, data=data)
    if response_light_update_data.status_code == 200:
        print("Light update to the server successfully.")
    else:
        print("Failed to update data to the server.")
        
    stop_long_task = True
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
    animated_label.place_forget()
    status_text.place_forget()
    
    points_var.set(str(""))
    check_more = True
    total_points = 0
    total_small = 0
    total_medium = 0
    total_large = 0
    plastic_bottles_detected = 0

    bin_status()

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
    global stop_long_task, revendo_logo, get_points_button, check_balance_button, image_button, image_label, tutorial_header, tutorial_steps, button

    stop_long_task = False
    check_more = False
    check_more1 = False
    thread = threading.Thread(target=handle_rfid_scan_get_points)
    thread.start()
    
    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='#8599e0', fg="white")
    tutorial_header.place(relx=0.5, rely=0.1, anchor='center')

    # Create an AnimatedGIFLabel widget with the GIF filename
    image_label = AnimatedGIFLabel(app, "rfid-scan.gif")
    image_label.resize(300, 300)  # Set the size
    # Start the animation
    image_label.next_frame()
    image_label.place(relx=0.5, rely=0.5, anchor='center')

    # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()

# Process plastic bottle page
def process_plastic_bottles():
    global stop_long_task, index, status_text, animated_label, revendo_logo, total_large, total_medium, total_small, your_balance_header, image_label_process, largebottle_text, balance_text, total_points, smallbottle_text, totalplasticbottle_text, mediumbottle_text, totalpoints_text, smallbottle_text, cancel_button, claim_button, points_entry

    stop_long_task = False
    check_more = True
    check_more1 = True
    thread = threading.Thread(target=get_points_process)
    thread.start()
    
    your_balance_header = tk.Label(
        app, text="Balance", font=("Arial", 24), bg='#8599e0', fg='white')
    your_balance_header.place(relx=0.21, rely=0.1, anchor='center')

    image_path = get_image_path("process-plastic-bottle-image.png")
    img = Image.open(image_path)
    img = img.resize((380, 350))
    photo = ImageTk.PhotoImage(img)
    image_label_process = tk.Label(app, image=photo)
    image_label_process.image = photo
    image_label_process.place(relx=0.3, rely=0.55, anchor='center')

    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=("Helvetica", 16), state='readonly', readonlybackground='white', justify='center')
    points_entry.place(relx=0.4, rely=0.1, anchor='center',
                     width=100, height=40)

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
    totalplasticbottle_text.place(relx=0.40, rely=0.40, anchor='center',
                                  width=100, height=40)

    totalplasticbottle_value = 0  # Example value
    totalplasticbottle_text.config(state='normal')
    totalplasticbottle_text.delete(0, 'end')  # Clear the current value
    totalplasticbottle_text.insert(
        0, str(total_large + total_medium + total_small))  # Insert the new value
    totalplasticbottle_text.config(state='disabled')

    mediumbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    mediumbottle_text.insert(0, "Your balance")
    mediumbottle_text.place(relx=0.21, rely=0.56, anchor='center',
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
    totalpoints_text.place(relx=0.40, rely=0.65, anchor='center',
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
    smallbottle_text.place(relx=0.21, rely=0.77, anchor='center',
                           width=60, height=40)

    smallbottle_value = 0  # Example value
    smallbottle_text.config(state='normal')
    smallbottle_text.delete(0, 'end')  # Clear the current value
    smallbottle_text.insert(0, str(smallbottle_value)
                            )  # Insert the new value
    smallbottle_text.config(state='disabled')
    
    # Create an AnimatedGIFLabel widget with the GIF filename
    animated_label = AnimatedGIFLabel(app, "processing.gif")
    animated_label.resize(200, 200)
    animated_label.pack()
    # Start the animation
    animated_label.next_frame()
    animated_label.place(relx=0.8, rely=0.4, anchor='center')
    
    status_text = tk.Label(
        app, text="Place your plastic bottle", font=("Arial", 14), bg='#8599e0', fg='white')
    status_text.place(relx=0.8, rely=0.67, anchor='center')

    cancel_button = tk.Button(app, text="X", font=(
        "Arial", 16), command=destroy_elements_process, bg='#8599e0', padx=20, fg='white')
    cancel_button.place(relx=0.9, rely=0.1, anchor='center',
                        width=50, height=50)

    claim_button = tk.Button(app, text="Claim Points", font=(
        "Arial", 16), command=claim_points, bg='#8599e0', padx=20, fg='white')
    claim_button.place(relx=0.8, rely=0.8, anchor='center',
                       width=200, height=50)

    # Hiding specific elements
    tutorial_header.place_forget()
    image_label.place_forget()

def check_points_scan_rfid_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, balance_label, points_entry, okay_button

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 20), bg='#8599e0', fg='white')
    tutorial_header.place(relx=0.75, rely=0.25, anchor='center')
    
    # Create an AnimatedGIFLabel widget with the GIF filename
    image_label = AnimatedGIFLabel(app, "rfid-scan.gif")
    image_label.resize(300, 300)  # Set the size
    # Start the animation
    image_label.next_frame()
    image_label.place(relx=0.3, rely=0.5, anchor='center')
    
    # Label to display "Balance"
    balance_label = Label(app, text="Balance", font=("Helvetica", 14), bg='#8599e0', fg='white')
    balance_label.place(relx=0.75, rely=0.45, anchor='center',
                     width=250, height=50)

    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=("Helvetica", 16), state='readonly', readonlybackground='white', justify='center')
    points_entry.place(relx=0.75, rely=0.55, anchor='center',
                     width=250, height=50)

    # Okay button
    okay_button = tk.Button(app, text="Okay", font=(
        "Arial", 16), command=destroy_elements_check_balance, bg='#8599e0', padx=20, fg='white')
    okay_button.place(relx=0.75, rely=0.75, anchor='center',
                      width=150, height=50)

    # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()

    # Trigger RFID scan explicitly
    app.after(1000, handle_rfid_scan)

def check_points_page():
    global balance_header, balance_text, button, global_points, balance_label, points_entry, okay_button

    balance_header = tk.Label(app, text="Your Balance", font=(
        "Arial", 24), bg='#8599e0', fg='white')
    balance_header.place(relx=0.5, rely=0.4, anchor='center')
    
    # Entry (textbox) to display points
    points_entry = Entry(app, textvariable=points_var, font=("Helvetica", 16), state='readonly', readonlybackground='white', bg='#8599e0', justify='center')
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

def bin_full_page():
    global bin_header, stop_long_task_bin
    
    stop_long_task_bin = False
    thread = threading.Thread(target=get_bin_status)
    thread.start()
    print("Task start for bin checking")
    
    bin_header = tk.Label(app, text="SORRY THE BIN IS FULL", font=(
        "Arial", 41), bg='#8599e0', fg='white')
    bin_header.place(relx=0.5, rely=0.5, anchor='center')
    
    servo.angle = 0

def menu():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, image_tutorial, image_tutorial_path
    
    revendo_logo_path = get_image_path("revendo-logo.png")
    center_revendo_logo = Image.open(revendo_logo_path)
    center_revendo_logo = center_revendo_logo.resize((200, 200))

    center_revendo_logo = center_revendo_logo.convert("RGBA")
    image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)

    revendo_logo = tk.Label(app, image=image_with_alpha)
    revendo_logo.image = image_with_alpha
    revendo_logo.place(relx=0.5, rely=0.35, anchor='center')

    get_points_button = tk.Button(app, text="Get Points", font=("Arial", 21),
                                  command=get_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')

    get_points_button.place(
        relx=0.25, rely=0.75, anchor='center', width=250, height=70)

    check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 21),
                                     command=check_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')
    check_balance_button.place(
        relx=0.75, rely=0.75, anchor='center', width=250, height=70)

    tutorial_button_path = get_image_path("question.png")
    tutorial_button = Image.open(tutorial_button_path)
    tutorial_button = tutorial_button.resize((30, 30))
    photo_button = ImageTk.PhotoImage(tutorial_button)

    image_button = tk.Button(app, image=photo_button,
                             command=tutorial_page, border=0)

    image_button.image = photo_button
    image_button.place(relx=0.5, rely=0.75, anchor='center')
    
    servo.angle = 0
    
def do_nothing(event):
    # This function does nothing, effectively preventing the event
    pass
    
def get_bin_status():
    global stop_long_task_bin
    
    while True:
        if stop_long_task_bin:
            print("Task stopped.")
            stop_long_task_bin = False
            return
        
        # Send GET request to the API endpoint
        response = requests.get(url_update_bin_status)
        data = response.json()

        # Check the status from the response
        if data["status"] == "Not Full":
            stop_long_task_bin = True
            print("Bin is now Not Full")
            destroy_bin_warning()
        else:
            print("Bin is Full")
    
def bin_status():
    try:
        # Send GET request to the API endpoint
        response = requests.get(url_update_bin_status)
        data = response.json()

        # Check the status from the response
        if data["status"] == "Full":
            print("Bin is Full")
            bin_full_page()
        else:
            print("Bin is Not Full")
            menu()
            
    except Exception as e:
        print("Error occurred:", e)
        
# Maximum number of attempts allowed
max_attempts = 3
current_attempt = 1

# Variable to hold points
points_var = StringVar()
points_var.set(str(global_points))  # Initialize with global points

# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

image_path = get_image_path("revendo-background.jpg")
img = Image.open(image_path)
img = img.resize((800, 480))  # Set the size to 800x480
background_image = ImageTk.PhotoImage(img)
background_label = tk.Label(app, image=background_image)
background_label.place(x=0, y=0, relwidth=1, relheight=1)

# Set the application to run in full screen - uncomment this if you are in raspberry pi
app.attributes('-fullscreen', True)
#app.wm_attributes('-fullscreen', True)

# Binding events to the root window
app.bind("<ButtonPress-2>", do_nothing) # Right-click
app.bind("<ButtonPress-3>", do_nothing) # Middle-click
app.bind("<Double-Button-1>", do_nothing) # Double-click

# Touchscreen specific events
app.bind("<Button-1>", do_nothing) # Single tap
app.bind("<Double-Button-1>", do_nothing) # Double tap
app.bind("<ButtonRelease-1>", do_nothing) # Tap release

# Run the application
calibration_test()
bin_status()
app.mainloop()
