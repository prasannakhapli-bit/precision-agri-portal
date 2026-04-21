const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("./middleware/authMiddleware");

const { calculateIrrigationScore } = require("./services/irrigationLogic");
const { simulateSensorData } = require("./services/sensorSimulator");
const { getWeatherForecast } = require("./services/weatherService");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Precision Agriculture Backend is running");
});

// ✅ Load mock DB
const dataPath = path.join(__dirname, "data", "zones.json");

function loadZones() {
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData).zones;
}

// ✅ API: Get irrigation status for all zones (Weather-aware)
app.get(
  "/api/zones/irrigation-status",
  authenticateToken,
  async (req, res) => {
  try {
    const zones = loadZones();

    // 🌦 Fetch real weather
    const weather = await getWeatherForecast();
    console.log("🌦 Weather check:", weather);

    const rainfallExpected = weather.rainfallExpected;

    const results = zones.map(zone => {
      const liveSensorData = simulateSensorData(zone.sensorData);

      const irrigationResult = calculateIrrigationScore(
        liveSensorData,
        rainfallExpected
      );

      return {
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
        sensorData: liveSensorData,
        irrigation: irrigationResult,
        rainfall: {
          expected: rainfallExpected,
          amountMm: weather.rainfallAmount,
          source: weather.source
        },
        dataSource: "Simulated Sensor Data"
      };
    });

    res.json(results);

  } catch (error) {
    console.error("❌ Error in irrigation-status API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});