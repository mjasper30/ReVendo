from hx711 import HX711
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

hx = HX711(dout_pin=6, pd_sck_pin=5)

# Check if a calibration file exists
try:
    with open("calibration_data.txt", "r") as file:
        content = file.read().strip()
        if content:
            ratio = float(content)
            hx.set_scale_ratio(ratio)
        else:
            raise ValueError("Calibration file is empty.")
except FileNotFoundError:
    print("Calibration file not found. Perform calibration.")
    hx.zero()

    # Wait for the user to place a known weight on the scale
    input("Place a known weight on the scale and press Enter: ")

    # Get and set the calibration ratio
    reading = hx.get_data_mean(readings=100)
    known_weight_grams = input(
        "Enter the known weight in grams and press Enter: ")
    value = float(known_weight_grams)
    ratio = reading / value
    hx.set_scale_ratio(ratio)

    # Save the calibration ratio to a file
    with open("calibration_data.txt", "w") as file:
        file.write(str(ratio))

while True:
    weight = hx.get_weight_mean()
    print(abs(int(weight)) - 215)
