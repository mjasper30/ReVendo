﻿<div align="center">
  <img height="300" src="https://github.com/mjasper30/ReVendo/blob/main/frontend/admin/src/assets/Revendo-icon.png?raw=true"  />
</div>

# ReVendo

A Reverse Vending Machine that solves problem for plastic bottle pollution that exchange plastic bottles into reward points that will help community to reduce plastic bottle waste and promote eco-friendly machine that can exchange into RFID reward points into charging station to accumulate time charging for smart phones empowered by switch mechanism of 220v and solar panel on our charging station.

## Features

- YoloV8 integration in Raspberry Pi 4 Model B 4GB for object detection for plastic bottles.
- Capturing objects using Raspberry Pi Camera V2.1 to check if the object is a plastic bottle or not.
- Reverse Vending Machine mechanism that can accept plastic bottles feed to the machine with use of 3kg servo motor.
- HX711 for weight detection to detect heavy objects feed inside the machine
- Relay module for light mechanism that is use to see the objects that feed inside the machine
- Ultrasonic sensor for checking if the capacity of the storage for plastic bottles either it is full or not.
- RFID Integration for storing reward points based on plastic bottles you feed inside the machine and you can use it for future use with our solar powered charging station.
- Raspberry Pi 5 inch LCD display with touch screen for displaying and user friendly UI for using our reverse vending machine.
- Admin Dashboard to check status of the machine, generate pie chart reports and register RFID cards to the system.
- Mobile App for checking their balance and history

## Tech Stack

**Client:** React, TailwindCSS, HTML, CSS

**Server:** Node, Express, JavaScript, C++, Python

**Database:** MySQL

**Hardware Used:** Raspberry Pi 4 Model B, Raspberry Pi Camera V2.1, Raspberry Pi LCD Screen, Nodemcu ESP8266, Ultrasonic Sensor, MFRC522 RFID, Servo, Load Cell Sensor, HX711, Liquid Crystal Display I2C, Buttons, Buzzer, Relay, Breadboard, Extension Cables

## Demo

Insert gif or link to demo

## Installation

Clone the repository

```bash
  git clone https://github.com/mjasper30/ReVendo.git
  cd ReVendo
```

Install npm package in frontend of our landing page with npm install command

```bash
  cd frontend/client
  npm install
```

To start frontend of landing page run

```bash
  npm run dev
```

Open new terminal by typing CTRL + SHIFT + `. Install npm package in frontend of admin page with npm install command

```bash
  cd frontend/admin
  npm install
```

To start frontend of admin page run

```bash
  npm run dev
```

Install npm package in backend with npm

```bash
  cd backend
  npm install
```

To start backend run

```bash
  npm start
```

## Team ReVendo

### Frontend

- [Jasper Macaraeg](https://github.com/mjasper30)
- [Andriel Gabriel Geomer](https://github.com/J-i-w-o-o)
- [Ma. Loelaida Clave](https://github.com/leee01)
- [May Pearl Rivera](https://github.com/Nepheleee)
- [John Kenneth Adriano](https://github.com/jkamogus)
- [John Maverick Clemente](https://github.com/MaestroMavs)

### Backend

- [Jasper Macaraeg](https://github.com/mjasper30)
- [Andriel Gabriel Geomer](https://github.com/J-i-w-o-o)
- [Daniel Sigue](https://github.com/dnlsigue)

### Documentators

- [Ma. Loelaida Clave](https://github.com/leee01)
- [May Pearl Rivera](https://github.com/Nepheleee)

### Hardware

- [Jasper Macaraeg](https://github.com/mjasper30)
- [Andriel Gabriel Geomer](https://github.com/J-i-w-o-o)
- [Daniel Sigue](https://github.com/dnlsigue)
- Daniel Custodio
- [John Maverick Clemente](https://github.com/MaestroMavs)

## Documentation

[Documentation](https://linktodocumentation)

## Marketing Video

## Acknowledgements

- [React](https://react.dev/)
- [Flowbite React](https://www.flowbite-react.com/)
- [Tailwindcss](https://tailwindcss.com/)
- [Google Fonts](https://fonts.google.com/)
- [ultralytics Github](https://github.com/ultralytics/ultralytics)
- [ultralytics Documentation](https://docs.ultralytics.com/)
- [Roboflow](https://roboflow.com/)
- [w3schools](https://www.w3schools.com/)
- [readme.so](https://readme.so/)
