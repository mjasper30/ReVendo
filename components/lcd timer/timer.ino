#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Ticker.h>

// Define LCD properties
LiquidCrystal_I2C lcd(0x27, 16, 2);  // I2C address, columns, rows

// Define timer properties
Ticker timer;
unsigned long startTime = 0;
unsigned long elapsedTime = 0;
unsigned long totalTime = 5 * 60 * 1000;  // 5 minutes in milliseconds

void setup() {
  lcd.begin();
  lcd.print("Timer: ");
  lcd.setCursor(0, 1);
  lcd.print("00:00");

  delay(2000);  // Display the initial message for 2 seconds

  // Set up the timer to update every second
  timer.attach(1, updateTimer);
}

void loop() {
  // Your main code goes here
}

void updateTimer() {
  if (elapsedTime < totalTime) {
    elapsedTime = millis() - startTime;

    // Calculate remaining minutes and seconds
    unsigned long remainingTime = totalTime - elapsedTime;
    unsigned int minutes = remainingTime / (60 * 1000);
    unsigned int seconds = (remainingTime / 1000) % 60;

    // Display the time on the LCD
    lcd.setCursor(7, 1);
    lcd.print(String(minutes, DEC));
    lcd.print(":");
    if (seconds < 10) {
      lcd.print("0");  // Add leading zero for single-digit seconds
    }
    lcd.print(String(seconds, DEC));
  } else {
    // Timer expired
    lcd.clear();
    lcd.print("Timer Expired!");
    timer.detach();  // Stop the timer
  }
}

void startTimer() {
  startTime = millis();  // Record the start time
}
