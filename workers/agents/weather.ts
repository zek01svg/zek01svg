import { db, weather } from "../shared/db";

const LOCATIONS = [
  { location: "Manila",    lat: 14.5995, lon: 120.9842 },
  { location: "Singapore", lat: 1.3521,  lon: 103.8198 },
];

export async function runWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY!;
  const rows: typeof weather.$inferInsert[] = [];

  await Promise.allSettled(
    LOCATIONS.map(async ({ location, lat, lon }) => {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      );
      const data = await res.json() as {
        main: { temp: number; feels_like: number; humidity: number };
        weather: Array<{ description: string }>;
      };
      rows.push({
        location,
        tempC:      String(Math.round(data.main.temp * 10) / 10),
        feelsLikeC: String(Math.round(data.main.feels_like * 10) / 10),
        condition:  data.weather[0].description.replace(/\b\w/g, (c) => c.toUpperCase()),
        humidity:   data.main.humidity,
      });
    }),
  );

  console.log(`[weather] fetched ${rows.length} locations`);
  if (rows.length) {
    await db
      .insert(weather)
      .values(rows)
      .onConflictDoUpdate({
        target: weather.location,
        set: { tempC: weather.tempC, feelsLikeC: weather.feelsLikeC, condition: weather.condition, humidity: weather.humidity, updatedAt: new Date() },
      });
  }
}
