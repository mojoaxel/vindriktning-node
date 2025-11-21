const fs = require('fs');
const express = require('express');
const { time } = require('console');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/measurements', (req, res) => {
  const data = fs.readFileSync('data.csv', 'utf8');
  const lines = data.split('\n').slice(1).filter(line => line.length > 0)
  const measurements = lines.map((line) => {
    const values = line.split(';');
    return {
      timestamp: values[0],
      pm1: parseInt(values[1]),
      pm2_5: parseInt(values[2]),
      pm10: parseInt(values[3]),
    }
  });

  const valuesPerTimestamp = new Map();
  measurements.forEach(measurement => {
    let mean = [];
    if (valuesPerTimestamp.has(measurement.timestamp)) {
      mean = valuesPerTimestamp.get(measurement.timestamp);
      mean.push(measurement.pm10);
   } else {
      mean = [measurement.pm10];
   }
    valuesPerTimestamp.set(measurement.timestamp, mean);
  })

  const values = Array.from(valuesPerTimestamp.entries()).map(([timestamp, values]) => ({
    timestamp,
    pm10: (values.reduce((a, b) => a + b, 0) / values.length)
  }));

  res.json(values);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});