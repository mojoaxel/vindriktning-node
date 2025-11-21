# Vindriktning Particle Sensor (IKEA)

This is an experiment to read the serial data from the "PM1006" LED Particle Sensor that is inside a Vindriktning from IKEA using node.js

## Setup

### Hardware

First we need to connect a UART-to-USB. You should be able to find a simple board searching for the "FT232RL" chip.

- Connect the GND pin to the GND pin of the FT232RL.
- Connect the REST pin of the Vindriktning to the Rx pin of the FT232RL.
- Optionally you could also connect Vcc (5V) to power the Vindriktning by the FT232RL board directly.

![image](https://github.com/mojoaxel/vindriktning-node/assets/600565/df027291-2160-4b9b-bcda-f50ca15b55b0)

 Alternative Solutions might be:
 - DIY "Feinstaubsensor Nova Fitness"

### Software

First make sure to adjust `SERIAL_PORT` in [index.js](index.js). On windows this might be something like "COM3" instead.

```bash
npm install
npm start
```

Output:

```bash
serialport connection to "/dev/ttyUSB0" opened
PM1.0: 1478 µg/m³, PM2.5: 13 µg/m³, PM10: 1 µg/m³
PM1.0: 1480 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1481 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1482 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1482 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1482 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1482 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
PM1.0: 1482 µg/m³, PM2.5: 14 µg/m³, PM10: 1 µg/m³
```

## Charts

```bash
npm run charts
```

![cli charts](https://github.com/user-attachments/assets/aa478822-522c-44b7-bcc0-013fa6d763b0)

## Useful docs

- [Sensor data format](https://lupyuen.github.io/articles/ikea#sensor-data-frame)
- [LED Particle Sensor "PM1006" Datasheet (PDF)](https://cdn-learn.adafruit.com/assets/assets/000/122/217/original/PM1006_LED_PARTICLE_SENSOR_MODULE_SPECIFICATIONS-1.pdf?1688148991)

## Related projects

- https://github.com/balena-io-experimental/balena-ikea-vindriktning
- https://github.com/Hypfer/esp8266-vindriktning-particle-sensor
- https://github.com/LaskaKit/ESP-Vindriktning
- https://github.com/kasik96/esp8266-vindriktning-particle-sensor-homekit
- https://github.com/Hypfer/esp8266-vindriktning-particle-sensor
- https://github.com/pulsar256/vindriktning_esphome
- https://github.com/fabiosoft/esp8266_ikea_vindriktning
- https://www.b4x.com/android/forum/threads/air-quality-ikea-vindriktning.138665/
- https://espeasy.readthedocs.io/en/latest/Plugin/P144.html
- https://elektro.turanis.de/html/prj405/index.html
- https://style.oversubstance.net/2021/08/diy-use-an-ikea-vindriktning-air-quality-sensor-in-home-assistant-with-esphome/

## License

> Alexander Wunschik wrote this file.
> As long as you retain this notice you can do whatever you want with this stuff.
> If we meet some day, and you think this stuff is worth it, you can buy me a beer in return
> — mojoaxel
