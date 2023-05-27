#!/bin/env node
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');

const PM1006 = require('./pm1006');

const SERIAL_PORT = '/dev/ttyUSB0';

const port = new SerialPort({ path: SERIAL_PORT, baudRate: PM1006.BAUDRATE });
port.on('open', () => console.log(`serialport connection to "${SERIAL_PORT}" opened`));
port.on('close', () => console.log(`serialport connection to "${SERIAL_PORT}" closed`));

const parser = port.pipe(new ByteLengthParser({ length: PM1006.FRAME_LENGTH }))
parser.on('data', (data) => {
	try {
		const measurements = PM1006.parseDataFrame(data);
		console.log([
			`PM1.0: ${measurements.pm1} ${PM1006.UNIT_UTF8}`,
			`PM2.5: ${measurements.pm2_5} ${PM1006.UNIT_UTF8}`,
			`PM10: ${measurements.pm10} ${PM1006.UNIT_UTF8}`,
		].join(`, `));
	} catch(err) {
		console.warn(`error parsing PM1006 data: `, err.msg);
	}
})

process.on('SIGINT', () => {
	port.close();
	process.exit(0);
});
