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
#include <ESP8266httpsClient.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define RST_PIN   D3
#define SS_PIN    D4

const char* ssid = "seedsphere";
const char* password = "YssabelJane25*";

MFRC522 mfrc522(SS_PIN, RST_PIN);

const int buttonIncrementPin = D0;  // Connect the increment button to GPIO pin D1
const int buttonDecrementPin = D8;  // Connect the decrement button to GPIO pin D2
// const int buttonOkayPin = D3;

int number = 0;  // The number to be incremented and decremented
int points = 12;
String rfidUID = "";
int process_number = 1;
String response = "";

//Jasper
// const char* serverName = "http://192.168.68.111:3001/check_balance"; // Replace with your server address
// const char* serverName_1 = "http://192.168.68.111:3001/minusPoints";
// const char* serverName_2 = "http://192.168.68.111:3001/updateStation";

//Sigue
const char* serverName = "http://192.168.43.85:3001/check_balance"; // Replace with your server address
const char* serverName_1 = "http://192.168.43.85:3001/minusPoints";
const char* serverName_2 = "http://192.168.43.85:3001/updateStation";

//Hosting
// const char* serverName = "https://revendo-030702.et.r.appspot.com/check_balance"; // Replace with your server address
// const char* serverName_1 = "https://revendo-030702.et.r.appspot.com/minusPoints";
// const char* serverName_2 = "https://revendo-030702.et.r.appspot.com/updateStation";

WiFiClient client;
httpsClient https;

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
  // pinMode(buttonOkayPin, INPUT_PULLUP);

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
    number = 0;
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

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}

void checkBalance(){
  if (WiFi.status() == WL_CONNECTED) {
    https.begin(client, serverName);
    https.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String httpsRequestData = "rfid=" + rfidUID;

    int httpsResponseCode = https.POST(httpsRequestData);
    if (httpsResponseCode > 0) {
      response = https.getString();
      Serial.println(httpsResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpsResponseCode);
    }
    // https.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

void updateBalance(int updateAmount){
  int updatedBalance = response.toInt() - updateAmount;

  if (WiFi.status() == WL_CONNECTED) {
    https.begin(client, serverName_1);
    https.addHeader("Content-Type", "application/json");  // Update Content-Type to JSON

    // Create a JSON object to hold the data
    DynamicJsonDocument jsonDocument(200);
    jsonDocument["rfid"] = rfidUID;
    jsonDocument["updatedBalance"] = updatedBalance; // Assuming 'additionalPoints' is the field expected on the server

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    // Send the POST request with the JSON data
    int httpsResponseCode = https.POST(jsonString);

    if (httpsResponseCode > 0) {
      response = https.getString();
      Serial.println(httpsResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpsResponseCode);
    }
    //https.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

void updateStation(int number) {
  if (WiFi.status() == WL_CONNECTED) {
    https.begin(client, serverName_2);
    https.addHeader("Content-Type", "application/json");

    // Create a JSON object to hold the data
    DynamicJsonDocument jsonDocument(200);
    jsonDocument["status"] = "on";
    jsonDocument["time"] = number;

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    // Send the PUT request with the JSON data
    int httpsResponseCode = https.PUT(jsonString);

    if (httpsResponseCode > 0) {
      String response = https.getString();
      Serial.println(httpsResponseCode);
      Serial.println(response);
      process_number = 3;
    } else {
      Serial.print("Error on sending PUT: ");
      Serial.println(httpsResponseCode);
    }
    https.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

void choosePoints(){
  int balance = response.toInt();
  if (balance >= number) {
    if (number == 0) {
      if (digitalRead(buttonIncrementPin) == LOW) {
        incrementNumber();
        delay(200);  // Debounce delay
      }
    } else {
      if (digitalRead(buttonDecrementPin) == LOW) {
        decrementNumber();
        delay(200);  // Debounce delay
      }
      if (digitalRead(buttonIncrementPin) == LOW) {
        incrementNumber();
        delay(200);  // Debounce delay
      }
      if (digitalRead(buttonIncrementPin) == HIGH && digitalRead(buttonDecrementPin) == HIGH) {
        updateBalance(number);
        updateStation(number);
        delay(200);  // Debounce delay
      }
    }
    Serial.println("Balance: " + String(response));
    Serial.println("Charge Points: " + String(number));

    // Print balance and charge points to LCD
    lcd.clear();
    lcd.setCursor(0, 0);  // Set the cursor to the first column and first row
    lcd.print("Balance: ");
    lcd.print(response);
    lcd.setCursor(0, 1);  // Set the cursor to the first column and second row
    lcd.print("Charge Pts: ");
    lcd.print(number);
  } else if (balance <= number) {
    if (digitalRead(buttonDecrementPin) == LOW) {
      decrementNumber();
      delay(200);  // Debounce delay
    }
  } else {
    Serial.println("You can't exceed to do that the points you have");
  }
}

void incrementNumber() {
  number++;
}

void decrementNumber() {
  number--;
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