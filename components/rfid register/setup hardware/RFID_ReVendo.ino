/*
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# RFID MFRC522 / RC522 Library : https://github.com/miguelbalboa/rfid # 
#                                                                     # 
#                 Installation :                                      # 
# NodeMCU ESP8266/ESP12E    RFID MFRC522 / RC522                      #
#         D2       <---------->   SDA/SS                              #
#         D5       <---------->   SCK                                 #
#         D7       <---------->   MOSI                                #
#         D6       <---------->   MISO                                #
#         GND      <---------->   GND                                 #
#         D1       <---------->   RST                                 #
#         3V/3V3   <---------->   3.3V                                #
#         D8       <---------->   BUZZER                              #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

#define RST_PIN   D1
#define SS_PIN    D2
#define BUZZER_PIN D8 // Added buzzer pin definition

MFRC522 mfrc522(SS_PIN, RST_PIN);

// Replace with your network credentials
const char *ssid1 = "seedsphere";
const char *password1 = "YssabelJane25*";
const char *ssid2 = "-forfreewifi";
const char *password2 = "forfreefy";
const char *ssid3 = "Tangerine";
const char *password3 = "dhengrosalie29";

const char *ssidList[] = {ssid1, ssid2, ssid3};
const char *passwordList[] = {password1, password2, password3};

const int numWiFiNetworks = 3;  // Adjust this based on the number of WiFi networks you have

// Local
// const char* serverName = "http://192.168.68.111:3001/rfid"; // Replace with your server address

// Hosting
const char* serverName = "https://revendo-backend-main.onrender.com/rfid"; // Replace with your server address

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer pin as output
  SPI.begin();
  mfrc522.PCD_Init();
  connectToWiFi();
  Serial.println("Scan your RFID tag to get its number...");
}

void loop() {
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();

  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);

  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
      piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
      piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println("Unsupported card");
    return;
  }

  String rfidUID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    rfidUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    rfidUID += String(mfrc522.uid.uidByte[i], HEX);
  }

  Serial.print("RFID UID: ");
  Serial.println(rfidUID);
  // Turn on the buzzer for a short duration to indicate successful RFID scan
  tone(BUZZER_PIN, 3000, 100);

  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    // Create a JSON object to hold the data
    DynamicJsonDocument jsonDocument(200);
    jsonDocument["rfid"] = rfidUID;

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
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
