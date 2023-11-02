import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests

reader = SimpleMFRC522()

url = "http://192.168.68.113/Revendo/receiveRFID.php"

try:
    id, text = reader.read()
    rfidUID = format(id, 'x')  # Convert the RFID number to hexadecimal format
    print("RFID UID:", rfidUID)

    payload = {'rfid': rfidUID}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=payload, headers=headers)
    if response.status_code == 200:
        print("HTTP Response:", response.text)
    else:
        print("Error on sending POST:", response.status_code)
finally:
    GPIO.cleanup()