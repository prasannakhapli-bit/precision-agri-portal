const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Example coordinates (Bangalore)
const LAT = 12.9716;
const LON = 77.5946;

async function getWeatherForecast() {
  if (!OPENWEATHER_API_KEY) {
    console.warn("⚠️ OpenWeather API key missing. Using fallback.");
    return {
      rainfallExpected: false,
      rainfallAmount: 0,
      source: "fallback"
    };
  }

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    let rainfallAmount = 0;

    // Next ~24 hours (8 x 3‑hour intervals)
    for (let i = 0; i < 8; i++) {
      const entry = data.list[i];
      if (entry.rain && entry.rain["3h"]) {
        rainfallAmount += entry.rain["3h"];
      }
    }

    return {
      rainfallExpected: rainfallAmount > 5, // threshold in mm
      rainfallAmount,
      source: "openweather"
    };

  } catch (error) {
    console.error("❌ Weather API error:", error);
    return {
      rainfallExpected: false,
      rainfallAmount: 0,
      source: "error-fallback"
    };
  }
}

module.exports = { getWeatherForecast };
