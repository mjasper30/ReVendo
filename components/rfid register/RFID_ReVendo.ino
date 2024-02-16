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
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
*/

#include <ESP8266WiFi.h>
#include <ESP8266httpsClient.h>
#include <MFRC522.h>

#define RST_PIN   D1
#define SS_PIN    D2

MFRC522 mfrc522(SS_PIN, RST_PIN);

const char* ssid = "seedsphere";
const char* password = "YssabelJane25*";

// Jasper
// const char* serverName = "http://192.168.68.111:3001/rfid"; // Replace with your server address

// Sigue
const char* serverName = "http://192.168.68.111:3001/rfid"; // Replace with your server address

// Hosting
// const char* serverName = "https://revendo-030702.et.r.appspot.com/rfid"; // Replace with your server address


WiFiClient client;
httpsClient https;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  connectToWiFi();
  Serial.println("Scan your RFID tag to get its number...");
}

void loop() {
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

  if (WiFi.status() == WL_CONNECTED) {
    https.begin(client, serverName);
    https.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String httpsRequestData = "rfid=" + rfidUID;

    int httpsResponseCode = https.POST(httpsRequestData);
    if (httpsResponseCode > 0) {
      String response = https.getString();
      Serial.println(httpsResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpsResponseCode);
    }
    https.end();
  } else {
    Serial.println("Error in WiFi connection");
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}

void connectToWiFi() {
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
