#include <ESP8266WiFi.h>

// Define your WiFi credentials
const char *ssid = "your-ssid";
const char *password = "your-password";

// Define GPIO pins for the buttons
const int buttonPinIncrement = D2; // Button to increment the number
const int buttonPinDecrement = D3; // Button to decrement the number

// Define initial value
int number = 0;

void setup() {
  // Start Serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Set button pins as input
  pinMode(buttonPinIncrement, INPUT);
  pinMode(buttonPinDecrement, INPUT);
}

void loop() {
  // Check if the increment button is pressed
  if (digitalRead(buttonPinIncrement) == HIGH) {
    // Increment the number
    number++;
    Serial.print("Number: ");
    Serial.println(number);
    delay(500); // Debounce delay
  }

  // Check if the decrement button is pressed
  if (digitalRead(buttonPinDecrement) == HIGH) {
    // Decrement the number
    number--;
    Serial.print("Number: ");
    Serial.println(number);
    delay(500); // Debounce delay
  }

  // Add any other code you want to run in the loop
}
