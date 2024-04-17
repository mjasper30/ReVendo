#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define TRIG_PIN D1
#define ECHO_PIN D2

// Replace with your network credentials
const char *ssid1 = "seedsphere";
const char *password1 = "YssabelJane25*";
const char *ssid2 = "forfreewifi";
const char *password2 = "forfreefy";
const char *ssid3 = "Tangerine";
const char *password3 = "dhengrosalie29";

const char *ssidList[] = {ssid1, ssid2, ssid3};
const char *passwordList[] = {password1, password2, password3};

const int numWiFiNetworks = 3;  // Adjust this based on the number of WiFi networks you have

//Local
// const char *lights_status = "https://192.168.68.111:3001/light_status";
// const char *bin_status = "https://192.168.68.111:3001/updateBin";

//Hosting
const char *lights_status = "https://revendo-backend-main.onrender.com/light_status";
const char *bin_status = "https://revendo-backend-main.onrender.com/updateBin";

// Define the pins connected to the relay module
const int relay1Pin = D3;  // GPIO pin for Relay 1
const int threshold_distance = 44;

WiFiClientSecure client;
HTTPClient http;

void setup() {
  Serial.begin(115200);

  connectToWiFi();
  
  Serial.println("Connected to WiFi");

  // Set relay pins as OUTPUT
  pinMode(relay1Pin, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Initialize relays to OFF state
  digitalWrite(relay1Pin, LOW);

  Serial.println("Initialization complete");
}

void loop() {
  // Use setInsecure() to bypass certificate verification
  client.setInsecure();

  if (http.begin(client, lights_status)) {
    int httpCode = http.GET();
    Serial.println(httpCode);

    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("API Response: " + payload);

      // Parse JSON response
      if (payload.indexOf("status\":\"on\"") != -1) {
        // If status is "on", turn on Relay 1 and set delay based on time
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 ON");

        http.end(); // Close connection                  
      } else {
        // If status is not "on", turn off Relay 1
        digitalWrite(relay1Pin, LOW);
        Serial.println("Relay 1 OFF");
      }
    } else {
      Serial.println("http request failed");
    }
  }

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();

  // Send status to Express.js API
  if (WiFi.status() == WL_CONNECTED) {
    long duration, distance;
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    duration = pulseIn(ECHO_PIN, HIGH);
    distance = (duration / 2) / 29.1; // Calculate distance in cm
    Serial.print("Distance: ");
    Serial.println(distance);
    delay(1000); // Delay for readability, adjust as needed
    
    http.begin(client, bin_status);
    http.addHeader("Content-Type", "application/json");

    // Prepare the JSON payload
    String bin_status_payload = "{\"status\": ";
    if (distance < threshold_distance) {
      bin_status_payload += "\"Full\"";
    } else {
      bin_status_payload += "\"Not Full\"";
    }
    bin_status_payload += "}";

    int httpCode = http.PUT(bin_status_payload);
    Serial.println(httpCode);

    if (httpCode == HTTP_CODE_OK) {
      String response = http.getString();
      Serial.println("Database Update Response: " + response);
    } else {
      Serial.println("Database update request failed");
    }

    http.end(); // Close connection
  } else {
    Serial.println("Error in WiFi connection");
  }

  // Delay between API requests (e.g., 3 seconds)
  delay(3000);
}

void connectToWiFi() {
  int attempts = 0;

  while (attempts < numWiFiNetworks) {
    WiFi.begin(ssidList[attempts], passwordList[attempts]);
    
    Serial.print("Connecting to WiFi Network: ");
    Serial.println(ssidList[attempts]);

    int attemptTimeout = 0;
    while (WiFi.status() != WL_CONNECTED && attemptTimeout < 20) {
      delay(500);
      Serial.print(".");
      attemptTimeout++;
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nConnected to WiFi");
      break;  // Exit the loop if connected successfully
    } else {
      Serial.println("\nConnection failed, trying next network...");
      WiFi.disconnect();
      attempts++;
    }
  }

  if (attempts == numWiFiNetworks) {
    Serial.println("Failed to connect to any WiFi network. Please check your credentials.");
    // You can add additional error handling or fallback mechanisms here
  }
}
