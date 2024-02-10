import RPi.GPIO as GPIO
import time

# Set the GPIO pins for the ultrasonic sensor
TRIG_PIN = 23  # GPIO pin connected to the trigger input of the ultrasonic sensor
ECHO_PIN = 24  # GPIO pin connected to the echo output of the ultrasonic sensor

# Set the bin full threshold distance (adjust based on your setup)
BIN_FULL_THRESHOLD = 30

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(TRIG_PIN, GPIO.OUT)
    GPIO.setup(ECHO_PIN, GPIO.IN)

def measure_distance():
    # Trigger the ultrasonic sensor
    GPIO.output(TRIG_PIN, GPIO.LOW)
    time.sleep(0.2)
    GPIO.output(TRIG_PIN, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, GPIO.LOW)

    # Measure the duration of the echo pulse
    while GPIO.input(ECHO_PIN) == 0:
        pulse_start_time = time.time()
    while GPIO.input(ECHO_PIN) == 1:
        pulse_end_time = time.time()

    # Calculate the distance in centimeters
    pulse_duration = pulse_end_time - pulse_start_time
    distance = pulse_duration * 17150
    return distance

def main():
    try:
        setup()
        while True:
            distance = measure_distance()
            print(f"Distance: {distance} cm")

            # Check if the bin is full based on the threshold
            if distance < BIN_FULL_THRESHOLD:
                print("Bin is full!")
                # Add any additional actions you want to perform when the bin is full
            else:
                print("Bin is not full.")

            # Wait for a short delay before taking the next measurement
            time.sleep(1)

    except KeyboardInterrupt:
        print("Measurement stopped by user")
    finally:
        GPIO.cleanup()

if __name__ == "__main__":
    main()
