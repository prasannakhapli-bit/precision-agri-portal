function calculateIrrigationScore(sensorData, rainfallExpected = false) {
  const { soilMoisture, temperature, humidity } = sensorData;

  // Weighted scoring (dynamic but explainable)
  let score =
    (100 - soilMoisture) * 0.5 +
    temperature * 0.3 +
    (100 - humidity) * 0.2;

  // Weather-based adjustment
  if (rainfallExpected) {
    score = score - 15;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  let status = "Normal";
  if (score >= 70) status = "Action Required";
  else if (score >= 40) status = "Monitor";

  return {
    score,
    status,
    explanation: `Score based on soil moisture (${soilMoisture}%), temperature (${temperature}°C), humidity (${humidity}%)`
  };
}

module.exports = { calculateIrrigationScore };  