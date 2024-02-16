#include <ESP8266httpsClient.h>
#include <ESP8266WiFi.h>

// Replace with your network credentials
const char *ssid = "seedsphere";
const char *password = "YssabelJane25*";

// const char *get_status = "http://192.168.68.111:3001/charging_station";
// const char *update_status_to_off = "http://192.168.68.111:3001/update_charging_station";

const char *get_status = "https://revendo-030702.et.r.appspot.com/charging_station";
const char *update_status_to_off = "https://revendo-030702.et.r.appspot.com/update_charging_station";

// Define the pins connected to the relay module
const int relay1Pin = D1;  // GPIO pin for Relay 1

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
  // pinMode(relay2Pin, OUTPUT);

  // Initialize relays to OFF state
  digitalWrite(relay1Pin, HIGH);  // HIGH is OFF for most relay modules

  Serial.println("Initialization complete");
}

void loop() {
  // Make https request to the Express.js API
  WiFiClient client;
  httpsClient https;

  if (https.begin(client, get_status)) {
    int httpsCode = https.GET();

    if (httpsCode == https_CODE_OK) {
      String payload = https.getString();
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

        // Update the database
        updateDatabase("off");
      } else {
        // If status is not "on", turn off Relay 1
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 OFF");
      }
    } else {
      Serial.println("https request failed");
    }

    https.end(); // Close connection
  }

  // Delay between API requests (e.g., 5 seconds)
  delay(5000);
}

void updateDatabase(String status) {
  WiFiClient client;
  httpsClient https;

  if (https.begin(client, update_status_to_off)) {
    https.addHeader("Content-Type", "application/json");

    // Prepare the JSON payload
    String payload = "{\"status\":\"" + status + "\",\"time\":0}";

    int httpsCode = https.PUT(payload);

    if (httpsCode == https_CODE_OK) {
      String response = https.getString();
      Serial.println("Database Update Response: " + response);
    } else {
      Serial.println("Database update request failed");
    }

    https.end(); // Close connection
  }
}
