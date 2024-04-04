/*
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# RFID MFRC522 / RC522 Library : https://github.com/miguelbalboa/rfid # 
#                                                                     # 
#                 Installation :                                      # 
# NodeMCU ESP8266/ESP12E    RFID MFRC522 / RC522                      #
#         D8       <---------->   SDA/SS                              #
#         D5       <---------->   SCK                                 #
#         D7       <---------->   MOSI                                #
#         D6       <---------->   MISO                                #
#         GND      <---------->   GND                                 #
#         D4       <---------->   RST                                 #
#         3V/3V3   <---------->   3.3V                                #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define RST_PIN   D3
#define SS_PIN    D4

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

MFRC522 mfrc522(SS_PIN, RST_PIN);

const int buttonIncrementPin = D0;  // Connect the increment button to GPIO pin D1
const int buttonDecrementPin = D8;  // Connect the decrement button to GPIO pin D2

int number = 1;  // The number to be incremented and decremented
int points = 12;
String rfidUID = "";
int process_number = 1;
String response = "";

//Local
// const char* serverName = "http://192.168.68.111:3001/check_balance"; // Replace with your server address
// const char* serverName_1 = "http://192.168.68.111:3001/minusPoints";
// const char* serverName_2 = "http://192.168.68.111:3001/updateStation";

//Hosting
const char* serverName = "https://revendo-backend-main.onrender.com/check_balance"; // Replace with your server address
const char* serverName_1 = "https://revendo-backend-main.onrender.com/minusPoints";
const char* serverName_2 = "https://revendo-backend-main.onrender.com/updateStation";

unsigned long startTime;
unsigned long elapsedTime;

LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD address to 0x27 for a 16 chars and 2 line display

void setup() {
  Serial.begin(115200);
  lcd.init();                       // Initialize the LCD
  lcd.backlight();                  // Turn on the backlight
  lcd.clear();                      // Clear the LCD screen

  // Connect to Wi-Fi
  connectToWiFi();

  SPI.begin();
  mfrc522.PCD_Init();

  pinMode(buttonIncrementPin, INPUT_PULLUP);
  pinMode(buttonDecrementPin, INPUT_PULLUP);

  lcd.clear();
  lcd.setCursor(0, 0);             // Set the cursor to the first column and first row
  lcd.print("Scan RFID Card");     // Print some text
  Serial.println("Scan RFID Card");
}

void loop() {
  if(process_number == 1){
    RFID_Scan();
  }else if(process_number == 2){
    choosePoints();
  }else if(process_number == 3){
    timer();
  }
}

void timer() {
  const unsigned long countdownDuration = 5 * 60 * 1000;  // 5 minutes in milliseconds
  static bool countdownStarted = false;  // Variable to track if the countdown has started
  if (!countdownStarted) {
    startTime = millis();  // Start the countdown only once
    countdownStarted = true;
  }

  elapsedTime = millis() - startTime;  // Calculate elapsed time

  // Calculate remaining time
  unsigned long remainingTime = countdownDuration - elapsedTime;
  
  // Convert remaining time to minutes and seconds
  unsigned int minutes = remainingTime * number / 60000;
  unsigned int seconds = (remainingTime % 60000) / 1000;

  // Print the timer in the format MM:SS to Serial
  Serial.print("Time Remaining: ");
  Serial.print(minutes);
  Serial.print(":");
  if (seconds < 10) {
    Serial.print("0");  // Add leading zero for single-digit seconds
  }
  Serial.println(seconds);

  // Print the timer in the format MM:SS to LCD
  lcd.clear();
  lcd.setCursor(0, 0);             // Set the cursor to the first column and first row
  lcd.print("Time Remaining: ");     // Print some text
  lcd.setCursor(0, 1);
  lcd.print(minutes);
  lcd.print(":");
  if (seconds < 10) {
    lcd.print("0");  // Add leading zero for single-digit seconds on LCD
  }
  lcd.print(seconds);

  if (seconds == 0 && minutes == 0) {
    lcd.clear();
    lcd.setCursor(0, 0);             // Set the cursor to the first column and first row
    lcd.print("Scan RFID Card");     // Print some text

    Serial.println("Charging is now timeout!");
    Serial.println("Scan RFID Card");
    
    // Additional actions when the timer reaches 0:00 can be added here
    countdownStarted = false;  // Reset the countdown flag
    number = 1;
    rfidUID = "";
    process_number = 1;  // Reset process_number to go back to RFID scanning
  }

  delay(1000);  // Update the timer every second
}


void RFID_Scan(){
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

  for (byte i = 0; i < mfrc522.uid.size; i++) {
    rfidUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    rfidUID += String(mfrc522.uid.uidByte[i], HEX);
  }

  Serial.print("RFID UID: ");
  Serial.println(rfidUID);

  checkBalance();

  //Reset RFID Number
  process_number = 2;
}

void checkBalance() {
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();
  
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
      response = http.getString();
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
}

void updateBalance(int updateAmount){
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();

  int updatedBalance = response.toInt() - updateAmount;

  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, serverName_1);
    http.addHeader("Content-Type", "application/json");  // Update Content-Type to JSON

    // Create a JSON object to hold the data
    DynamicJsonDocument jsonDocument(200);
    jsonDocument["rfid"] = rfidUID;
    jsonDocument["updatedBalance"] = updatedBalance; // Assuming 'additionalPoints' is the field expected on the server

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    // Send the POST request with the JSON data
    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      response = http.getString();
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
}

void updateStation(int number) {
  WiFiClientSecure client;
  HTTPClient http;

  // Use setInsecure() to bypass certificate verification
  client.setInsecure();
  
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, serverName_2);
    http.addHeader("Content-Type", "application/json");

    // Create a JSON object to hold the data
    DynamicJsonDocument jsonDocument(200);
    jsonDocument["status"] = "on";
    jsonDocument["time"] = number;

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    // Send the PUT request with the JSON data
    int httpResponseCode = http.PUT(jsonString);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
      process_number = 3;
    } else {
      Serial.print("Error on sending PUT: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

void choosePoints() {
  int balance = response.toInt();
  
  if (balance < 1) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("No Balance!");
    delay(2000);  // Display the message for 2 seconds
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Scan RFID Card");
    number = 1;
    rfidUID = "";
    process_number = 1;  // Go back to RFID scanning
  }else{
    // Check if a new RFID card is present
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
      // Update balance and station
      updateBalance(number);
      updateStation(number);
    }

    MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);

    if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
        piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
        piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
      Serial.println("Unsupported card");
      return;
    }

    if (number == 1){
      number = 1;
      delay(200);  // Debounce delay
    }

    if (number == balance){
      number = balance;
      delay(200);  // Debounce delay
    }

    // Increment charge points if buttonIncrementPin is pressed and number is not equal to balance
    if (digitalRead(buttonIncrementPin) == LOW && balance > number) {
      Serial.println(number);
      incrementNumber();
      delay(200);  // Debounce delay
    }

    // Decrement charge points if buttonDecrementPin is pressed and number is not equal to 1
    if (digitalRead(buttonDecrementPin) == LOW && number > 1) {
      decrementNumber();
      delay(200);  // Debounce delay
    }

    // Print balance and charge points to LCD
    lcd.clear();
    lcd.setCursor(0, 0);  // Set the cursor to the first column and first row
    lcd.print("Balance: ");
    lcd.print(response);

    lcd.setCursor(0, 1);  // Set the cursor to the first column and second row
    lcd.print("Charge Pts: ");
    lcd.print(number);
  }
}


void incrementNumber() {
  number++;
}

void decrementNumber() {
  number--;
}

void connectToWiFi() {
  int attempts = 0;

  while (attempts < numWiFiNetworks) {
    WiFi.begin(ssidList[attempts], passwordList[attempts]);
    
    Serial.print("Connecting to WiFi Network: ");
    Serial.println(ssidList[attempts]);

    lcd.clear();
    lcd.setCursor(0, 0);             // Set the cursor to the first column and first row
    lcd.print("WiFi Connecting..");     // Print some text
    lcd.setCursor(0, 1);             // Set the cursor to the first column and first row
    lcd.print(ssidList[attempts]);     // Print some text

    int attemptTimeout = 0;
    while (WiFi.status() != WL_CONNECTED && attemptTimeout < 20) {
      delay(500);
      Serial.print(".");
      attemptTimeout++;
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nConnected to WiFi");
      lcd.clear();
      break;  // Exit the loop if connected successfully
    } else {
      Serial.println("\nConnection failed, trying next network...");
      lcd.clear();
      WiFi.disconnect();
      attempts++;
    }
  }

  if (attempts == numWiFiNetworks) {
    Serial.println("Failed to connect to any WiFi network. Please check your credentials.");
    // You can add additional error handling or fallback mechanisms here
  }
}