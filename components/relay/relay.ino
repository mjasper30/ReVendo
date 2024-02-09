#include <ESP8266WiFi.h>

// Replace with your network credentials
const char *ssid = "seedsphere";
const char *password = "YssabelJane25*";

// Define the pins connected to the relay module
const int relay1Pin = D1;  // GPIO pin for Relay 1
const int relay2Pin = D2;  // GPIO pin for Relay 2

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Set relay pins as OUTPUT
  pinMode(relay1Pin, OUTPUT);
  pinMode(relay2Pin, OUTPUT);

  // Initialize relays to OFF state
  digitalWrite(relay1Pin, HIGH);  // HIGH is OFF for most relay modules
  digitalWrite(relay2Pin, HIGH);

  Serial.println("Initialization complete");
}

void loop() {
  // Your main code goes here

  // Example: Turn on Relay 1 for 2 seconds, then turn it off
  digitalWrite(relay1Pin, LOW);  // LOW is ON for most relay modules
  Serial.println("Relay 1 ON");
  delay(2000);  // Wait for 2 seconds
  digitalWrite(relay1Pin, HIGH);
  Serial.println("Relay 1 OFF");

  // Repeat for Relay 2
  digitalWrite(relay2Pin, LOW);
  Serial.println("Relay 2 ON");
  delay(2000);
  digitalWrite(relay2Pin, HIGH);
  Serial.println("Relay 2 OFF");

  // Your main code continues...

  delay(5000);  // Delay between operations (5 seconds in this example)
}
