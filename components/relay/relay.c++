// Include the necessary libraries
#include <ESP8266WiFi.h>

// Replace with your network credentials
const char *ssid = "your-ssid";
const char *password = "your-password";

// Define the GPIO pin connected to the relay
const int relayPin = D1; // D1 is GPIO 5 on NodeMCU

void setup() {
  // Start serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Set the relay pin as an output
  pinMode(relayPin, OUTPUT);
}

void loop() {
  // Turn on the relay
  digitalWrite(relayPin, HIGH);
  Serial.println("Relay is ON");

  // Wait for 5 seconds
  delay(5000);

  // Turn off the relay
  digitalWrite(relayPin, LOW);
  Serial.println("Relay is OFF");

  // Wait for 5 seconds before repeating
  delay(5000);
}
