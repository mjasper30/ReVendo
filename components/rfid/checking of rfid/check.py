import mysql.connector
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests

mydb = mysql.connector.connect(
    host="localhost",
    user="revendo",
    password="revendo",
    database="revendo"
)

mycursor = mydb.cursor()
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
        # Check if the RFID is registered in the database
        mycursor.execute(
            "SELECT * FROM rfid WHERE rfid_number = %s", (rfidUID,))
        result = mycursor.fetchone()
        if result:
            print("RFID is registered in the database.")
        else:
            print("RFID is not registered in the database.")
    else:
        print("Error on sending POST:", response.status_code)
finally:
    GPIO.cleanup()
