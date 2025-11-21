#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const chalk = require('chalk').default;

const DATA_FILE = path.join(__dirname, 'data.csv');
const REFRESH_INTERVAL = 1000; // ms
const MAX_POINTS = 50;

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

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    timestamps = [];
    pm1Values = [];
    return;
  }
  const content = fs.readFileSync(DATA_FILE, 'utf8').trim();
  if (!content) {
    timestamps = [];
    pm1Values = [];
    return;
  }
  const lines = content.split('\n');
  // Skip header row if present
  const dataLines = lines[0].startsWith('timestamp') ? lines.slice(1) : lines;
  const lastLines = dataLines.slice(-MAX_POINTS);
  const data = lastLines.map(line => {
    const parts = line.split(';');
    return {
      timestamp: parts[0],
      pm1: parseFloat(parts[1])
    };
  });
  timestamps = data.map(d => d.timestamp);
  pm1Values = data.map(d => d.pm1);
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
updateChart();

// Refresh chart periodically
const interval = setInterval(updateChart, REFRESH_INTERVAL);

// Quit on Escape, q, or Ctrl-C
screen.key(['escape', 'q', 'C-c'], function() {
  clearInterval(interval);
  return process.exit(0);
});
