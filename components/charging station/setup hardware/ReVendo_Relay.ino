#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

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

int set_minute = 0;
bool hasRun = false; // Flag to track whether the function has been executed

//Local
// const char *get_status = "http://192.168.68.111:3001/charging_station";
// const char *update_status_to_off = "http://192.168.68.111:3001/update_charging_station";

//Hosting
const char *get_status = "https://revendo-backend-main.onrender.com/charging_station";
const char *get_minutes = "https://revendo-backend-main.onrender.com/get_time_charge";

// Define the pins connected to the relay module
const int relay1Pin = D1;  // GPIO pin for Relay 1

void setup() {
  Serial.begin(115200);

  connectToWiFi();
  
  Serial.println("Connected to WiFi");

  // Set relay pins as OUTPUT
  pinMode(relay1Pin, OUTPUT);
  // pinMode(relay2Pin, OUTPUT);

  // Initialize relays to OFF state
  digitalWrite(relay1Pin, HIGH);  // HIGH is OFF for most relay modules

  Serial.println("Initialization complete");
}

void loop() {
  // Run get_time_charge() only once if it hasn't been executed yet
  if (!hasRun) {
    get_time_charge();
    hasRun = true; // Set the flag to true to indicate that the function has been executed
  }

  // Make http request to the Express.js API
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();

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

        http.end(); // Close connection                  

        // Wait for the specified time duration delayTime * 5 * 60 * 1000
        delay(delayTime * set_minute * 60 * 1000); // Convert seconds to milliseconds

        // Turn off Relay 1 after the specified time
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 OFF");
        hasRun = false;
      } else {
        // If status is not "on", turn off Relay 1
        digitalWrite(relay1Pin, HIGH);
        Serial.println("Relay 1 OFF");
      }
    } else {
      Serial.println("http request failed");
    }
  }

  // Delay between API requests (e.g., 3 seconds)
  delay(3000);
}

void get_time_charge(){
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();
  
  if (http.begin(client, get_minutes)) {
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("API Response: " + payload);
      
      // Parse JSON
      DynamicJsonDocument doc(1024); // Adjust the size according to your payload
      DeserializationError error = deserializeJson(doc, payload);
      
      if (error) {
        Serial.println("Failed to parse JSON");
        return;
      }
      
      // Extract value of "minute"
      int minute = doc["minute"]; // Assuming the minute value is an integer
      
      // Store the minute value in the set_minute variable
      set_minute = minute;
      Serial.println(set_minute);
    } else {
      Serial.println("http request failed");
    }

    http.end();
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
