function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function simulateSensorData(baseSensorData) {
  return {
    soilMoisture: getRandomNumber(
      Math.max(0, baseSensorData.soilMoisture - 10),
      Math.min(100, baseSensorData.soilMoisture + 10)
    ),
    temperature: getRandomNumber(
      baseSensorData.temperature - 3,
      baseSensorData.temperature + 3
    ),
    humidity: getRandomNumber(
      Math.max(0, baseSensorData.humidity - 10),
      Math.min(100, baseSensorData.humidity + 10)
    )
  };
}

module.exports = { simulateSensorData };
