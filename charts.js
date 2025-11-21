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

// Create screen and chart
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
const line = grid.set(0, 0, 12, 12, contrib.line, {
  label: chalk.cyan('PM1.0 Measurements'),
  showLegend: true,
  legend: { width: 10 }
});

let timestamps = [];
let pm1Values = [];

let chartBuffer = [];

function readData() {
  timestamps = chartBuffer.map(d => d.timestamp);
  pm1Values = chartBuffer.map(d => d.pm1);
}

function updateChart() {
  readData();
  line.setData([
    {
      title: chalk.green('PM1.0'),
      x: timestamps.length ? timestamps : ['No Data'],
      y: pm1Values.length ? pm1Values : [0]
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
    chartBuffer.push({ timestamp, pm1: measurements.pm1 });
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
