import os
import cv2
from ultralytics import YOLO
import subprocess
import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests

# Replace 'your_script.sh' with the path to your bash script.
script_path = 'capture_image.sh'

reader = SimpleMFRC522()

url = "http://192.168.68.113/Revendo/registeredRFID.php"

try:
    id, text = reader.read()
    rfidUID = format(id, 'x')  # Convert the RFID number to hexadecimal format

    rfidUID = rfidUID[:-2]  # Removing the last two characters from rfidUID

    print("RFID UID:", rfidUID)
    
    payload = {'rfid': rfidUID}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=payload, headers=headers)
    if response.status_code == 200:
        print("HTTP Response:", response.text)
        if "success" in response.text:
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
            model_path = os.path.join('.', 'model', 'best3.pt')
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

                # Perform object detection
                results = model(frame)[0]

                for result in results.boxes.data.tolist():
                    x1, y1, x2, y2, score, class_id = result

                    if score > threshold:
                        # Calculate the height of the bounding box in centimeters
                        height_cm = int((y2 - y1) * pixels_to_cm)

                        # Draw the bounding box
                        cv2.rectangle(frame, (int(x1), int(y1)),
                                      (int(x2), int(y2)), (0, 255, 0), 4)
                                      
                        # Add a delay before drawing the bounding box
                        time.sleep(3)  # Adjust the delay time as needed

                        # Annotate the height in centimeters
                        text = f'Height: {height_cm} cm'
                        cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

                        # Make the class label text bigger
                        class_label = results.names[int(class_id)].upper()
                        cv2.putText(frame, class_label, (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1, cv2.LINE_AA)

                                    
                        # Add a delay before drawing the bounding box
                        time.sleep(3)  # Adjust the delay time as needed

                # Save the annotated image to the output directory
                output_image_path = os.path.join(output_dir, image_file)
                cv2.imwrite(output_image_path, frame)

            print("Object detection on images completed.")
        else:
            print("RFID is not registered in the database.")
    else:
        print("Error on sending POST:", response.status_code)
finally:
    GPIO.cleanup()
