from gpiozero import AngularServo, Device
from gpiozero.pins.pigpio import PiGPIOFactory
from time import sleep

# Set up pigpio pin factory
Device.pin_factory = PiGPIOFactory(host='localhost', port=8888)

# Your existing code
servo = AngularServo(26, min_pulse_width=0.0006, max_pulse_width=0.0023)

while True:
    servo.angle = 90
    print("OPEN")
    sleep(2)
    servo.angle = 0
    print("CLOSE")
    sleep(2)


