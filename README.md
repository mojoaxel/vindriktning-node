# Vindriktning Particle Sensor (IKEA)

This is an experiment to read the serial data from the "PM1006" LED Particle Sensor that is inside a Vindriktning from IKEA using node.js

![image](https://github.com/mojoaxel/vindriktning-node/assets/600565/df027291-2160-4b9b-bcda-f50ca15b55b0)

## Setup

First make sure to adjust `SERIAL_PORT` in [index.js](index.js). On windows this might be something like "COM3" instead.

```
npm install
npm start
```

Output:
```
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

## Useful docs

- [Sensor data format](https://lupyuen.github.io/articles/ikea#sensor-data-frame)
- [LED Particle Sensor "PM1006" Datasheet (PDF)](http://www.jdscompany.co.kr/download.asp?gubun=07&filename=PM1006_LED_PARTICLE_SENSOR_MODULE_SPECIFICATIONS.pdf)

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
