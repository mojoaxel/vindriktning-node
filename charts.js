#!/usr/bin/env node
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const PM1006 = require('./pm1006');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const chalk = require('chalk').default;

const MAX_POINTS = 50;

const SERIAL_PORT = '/dev/ttyUSB0';
const port = new SerialPort({ path: SERIAL_PORT, baudRate: PM1006.BAUDRATE });
port.on('open', () => console.log(`serialport connection to "${SERIAL_PORT}" opened`));
port.on('close', () => console.log(`serialport connection to "${SERIAL_PORT}" closed`));

// Create screen and charts
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const linePM1 = grid.set(0, 0, 4, 12, contrib.line, {
	label: chalk.cyan('PM1.0 Measurements'),
	showLegend: false,
	legend: { width: 10 }
});
const linePM25 = grid.set(4, 0, 4, 12, contrib.line, {
	label: chalk.magenta('PM2.5 Measurements'),
	showLegend: false,
	legend: { width: 10 }
});
const linePM10 = grid.set(8, 0, 4, 12, contrib.line, {
	label: chalk.yellow('PM10 Measurements'),
	showLegend: false,
	legend: { width: 10 }
});

let timestamps = [];
let pm1Values = [];
let pm25Values = [];
let pm10Values = [];

let chartBuffer = [];

function readData() {
	timestamps = chartBuffer.map(d => d.timestamp);
	pm1Values = chartBuffer.map(d => d.pm1);
	pm25Values = chartBuffer.map(d => d.pm2_5);
	pm10Values = chartBuffer.map(d => d.pm10);
}

function updateChart() {
	readData();
	linePM1.setData([
		{
			title: chalk.green('PM1.0'),
			x: timestamps.length ? timestamps : ['No Data'],
			y: pm1Values.length ? pm1Values : [0]
		}
	]);
	linePM25.setData([
		{
			title: chalk.magenta('PM2.5'),
			x: timestamps.length ? timestamps : ['No Data'],
			y: pm25Values.length ? pm25Values : [0]
		}
	]);
	linePM10.setData([
		{
			title: chalk.yellow('PM10'),
			x: timestamps.length ? timestamps : ['No Data'],
			y: pm10Values.length ? pm10Values : [0]
		}
	]);
	screen.render();
}

// Initial chart update

const parser = port.pipe(new ByteLengthParser({ length: PM1006.FRAME_LENGTH }));
parser.on('data', (data) => {
	try {
		const measurements = PM1006.parseDataFrame(data);
		const timestamp = new Date().toLocaleTimeString();
		chartBuffer.push({
			timestamp,
			pm1: measurements.pm1,
			pm2_5: measurements.pm2_5,
			pm10: measurements.pm10
		});
		if (chartBuffer.length > MAX_POINTS) chartBuffer.shift();
		updateChart();
	} catch (err) {
		// Optionally log parse errors
	}
});

// Quit on Escape, q, or Ctrl-C
screen.key(['escape', 'q', 'C-c'], function() {
	port.close();
	return process.exit(0);
});
