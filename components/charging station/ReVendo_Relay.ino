#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

// Replace with your network credentials
const char *ssid1 = "seedsphere";
const char *password1 = "YssabelJane25*";
const char *ssid2 = "Tangerine";
const char *password2 = "dhengrosalie29";

const char *ssidList[] = {ssid1, ssid2};
const char *passwordList[] = {password1, password2};

const int numWiFiNetworks = 2;  // Adjust this based on the number of WiFi networks you have

//Local
// const char *get_status = "http://192.168.68.111:3001/charging_station";
// const char *update_status_to_off = "http://192.168.68.111:3001/update_charging_station";

//Hosting
const char *get_status = "https://revendo-backend-main.onrender.com/charging_station";
const char *update_status_to_off = "https://revendo-backend-main.onrender.com/update_charging_station";

// Define the pins connected to the relay module
const int relay1Pin = D1;  // GPIO pin for Relay 1

// Make http request to the Express.js API
WiFiClientSecure client;
HTTPClient http;

void setup() {
  Serial.begin(115200);

  connectToWiFi();
  // Use setInsecure() to bypass certificate verification
  client.setInsecure();
  Serial.println("Connected to WiFi");

  // Set relay pins as OUTPUT
  pinMode(relay1Pin, OUTPUT);
  // pinMode(relay2Pin, OUTPUT);

  // Initialize relays to OFF state
  digitalWrite(relay1Pin, HIGH);  // HIGH is OFF for most relay modules

  Serial.println("Initialization complete");
}

void loop() {
  if (http.begin(client, get_status)) {
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("API Response: " + payload);

      // Parse JSON response
      if (payload.indexOf("status\":\"on\"") != -1) {
        // If status is "on", turn on Relay 1 and set delay based on time
        digitalWrite(relay1Pin, LOW);
        Serial.println("Relay 1 ON");

        // Extract time from the JSON response
        int timeIndex = payload.indexOf("time\":") + 6;
        String timeStr = payload.substring(timeIndex, payload.indexOf("\"", timeIndex));
        int delayTime = timeStr.toInt();

        // Wait for the specified time duration
        delay(delayTime * 5 * 60 * 1000); // Convert seconds to milliseconds

        // Turn off Relay 1 after the specified time
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 OFF");

        http.end(); // Close connection

        // Update the database
        updateDatabase("off");
      } else {
        // If status is not "on", turn off Relay 1
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 OFF");
      }
    } else {
      Serial.println("http request failed");
    }
  }

  // Delay between API requests (e.g., 5 seconds)
  delay(5000);
}

void updateDatabase(String status) {
  http.begin(client, update_status_to_off);
  http.addHeader("Content-Type", "application/json");

  // Prepare the JSON payload
  String payload = "{\"status\":\"" + status + "\",\"time\":0}";

  int httpCode = http.PUT(payload);

  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.println("Database Update Response: " + response);
  } else {
    Serial.println("Database update request failed");
  }
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
