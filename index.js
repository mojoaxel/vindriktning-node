#!/bin/env node
const fs = require('fs');
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');

const PM1006 = require('./pm1006');

const SERIAL_PORT = '/dev/ttyUSB0';
//const SERIAL_PORT = '/dev/bus/usb/001/001';

const port = new SerialPort({ path: SERIAL_PORT, baudRate: PM1006.BAUDRATE });
port.on('open', () => console.log(`serialport connection to "${SERIAL_PORT}" opened`));
port.on('close', () => console.log(`serialport connection to "${SERIAL_PORT}" closed`));

let cache = null;

const parser = port.pipe(new ByteLengthParser({ length: PM1006.FRAME_LENGTH }))
parser.on('data', (data) => {
	try {
		const measurements = PM1006.parseDataFrame(data);

		console.log([
			`timestamp: ${new Date().toISOString()}`,
			`PM1.0: ${measurements.pm1} ${PM1006.UNIT_UTF8}`,
			`PM2.5: ${measurements.pm2_5} ${PM1006.UNIT_UTF8}`,
			`PM10: ${measurements.pm10} ${PM1006.UNIT_UTF8}`,
		].join(`, `));

		const timestamp = new Date().toISOString();
		const message = [
			timestamp,
			measurements.pm1,
			measurements.pm2_5,
			measurements.pm10,
		].join(`;`);
		
		hash = [
			measurements.pm1,
			measurements.pm2_5,
			measurements.pm10,
		].join(',');

		if (cache !== hash) {
			// append "message" to file "data.csv"
			fs.appendFileSync('data.csv', `${message}\n`);
			cache = hash;
		}

	} catch(err) {
		console.warn(`error parsing PM1006 data: `, err.message);
	}
})

process.on('SIGINT', () => {
	port.close();
	process.exit(0);
});
