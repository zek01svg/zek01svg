import type { DailyQuote, WeatherData } from "@/lib/types";

const PLACEHOLDER_QUOTE: DailyQuote = {
  id: "",
  date: "",
  text: "Discipline is the bridge between goals and accomplishment.",
  author: "Jim Rohn",
};

const PLACEHOLDER_WEATHER: WeatherData[] = [
  { location: "Manila", temp_c: 32, feels_like_c: 38, condition: "Partly Cloudy", humidity: 78, updated_at: "" },
  { location: "Singapore", temp_c: 29, feels_like_c: 34, condition: "Sunny", humidity: 72, updated_at: "" },
];

interface TopBarProps {
  quote?: DailyQuote;
  weather?: WeatherData[];
}

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TopBar({ quote = PLACEHOLDER_QUOTE, weather = PLACEHOLDER_WEATHER }: TopBarProps) {
  const now = new Date();
  return (
    <div className="border-b-2 border-[var(--color-border)] bg-[var(--color-ink)] text-white px-4 py-2">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* left: time + quote */}
        <div>
          <div className="text-[11px] text-[var(--color-dim)] tracking-widest mb-0.5">
            {fmt(now)} · {fmtTime(now)}
          </div>
          <div className="text-[12px]">
            <span className="text-[var(--color-yellow)]">&ldquo;</span>
            {quote.text}
            <span className="text-[var(--color-yellow)]">&rdquo;</span>
            <span className="text-[var(--color-muted)] ml-2">— {quote.author}</span>
          </div>
        </div>
        {/* right: weather */}
        <div className="flex gap-6 shrink-0">
          {weather.map((w) => (
            <div key={w.location} className="text-right">
              <div className="text-[10px] text-[var(--color-muted)] tracking-widest uppercase">{w.location}</div>
              <div className="text-[12px] font-bold">{w.temp_c}°C <span className="font-normal text-[var(--color-dim)]">{w.condition}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
