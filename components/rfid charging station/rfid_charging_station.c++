#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 4  // Define the SS (Slave Select) pin
#define RST_PIN 5 // Define the RST pin

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(115200);
  SPI.begin();      // Initiate SPI bus
  mfrc522.PCD_Init(); // Initiate MFRC522
  Serial.println("RFID Read and Display");
}

void loop() {
  // Look for new cards
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Print UID
    Serial.print("Card UID: ");
    dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);
    Serial.println();

    // Halt PICC
    mfrc522.PICC_HaltA();
    // Stop encryption on PCD
    mfrc522.PCD_StopCrypto1();
  }
}

void dump_byte_array(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}
