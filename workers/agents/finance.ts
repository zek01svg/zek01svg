import yahooFinance from "yahoo-finance2";
import { db, tickers } from "../shared/db";

const STOCKS: Array<{ symbol: string; label: string; currency: string }> = [
  { symbol: "^PSEI",   label: "PSEi",      currency: "PHP" },
  { symbol: "^STI",    label: "STI",       currency: "SGD" },
  { symbol: "^GSPC",   label: "S&P 500",   currency: "USD" },
  { symbol: "^IXIC",   label: "NASDAQ",    currency: "USD" },
  { symbol: "BTC-USD", label: "BTC",       currency: "USD" },
];

const FOREX_SYMBOLS: Array<{ symbol: string; label: string }> = [
  { symbol: "PHPUSD=X",  label: "PHP/USD" },
  { symbol: "SGDUSD=X",  label: "SGD/USD" },
  { symbol: "PHPSGD=X",  label: "PHP/SGD" },
];

async function fetchStocks() {
  const rows = [];
  for (const stock of STOCKS) {
    try {
      const quote = await yahooFinance.quote(stock.symbol);
      const price = quote.regularMarketPrice ?? 0;
      const prev  = quote.regularMarketPreviousClose ?? price;
      const change    = +(price - prev).toFixed(2);
      const changePct = +(((price - prev) / prev) * 100).toFixed(2);
      rows.push({
        symbol: stock.symbol,
        label: stock.label,
        price: String(price),
        change: String(change),
        changePct: String(changePct),
        currency: stock.currency,
      });
    } catch (e) {
      console.warn(`[finance] ${stock.symbol} error:`, e);
    }
  }
  return rows;
}

async function fetchForex() {
  const rows = [];
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) return rows;
  const res  = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  const data = await res.json() as { conversion_rates: Record<string, number> };
  const rates = data.conversion_rates;
  const pairs: Array<[string, string, string]> = [
    ["PHPUSD=X", "PHP/USD", String(1 / (rates.PHP ?? 56))],
    ["SGDUSD=X", "SGD/USD", String(1 / (rates.SGD ?? 1.34))],
    ["PHPSGD=X", "PHP/SGD", String((rates.SGD ?? 1.34) / (rates.PHP ?? 56) * 100)],
  ];
  for (const [symbol, label, price] of pairs) {
    rows.push({ symbol, label, price, change: "0", changePct: "0", currency: "" });
  }
  return rows;
}

export async function runFinance() {
  const rows = [...(await fetchStocks()), ...(await fetchForex())];
  console.log(`[finance] fetched ${rows.length} tickers`);
  if (rows.length) {
    await db
      .insert(tickers)
      .values(rows)
      .onConflictDoUpdate({
        target: tickers.symbol,
        set: { price: tickers.price, change: tickers.change, changePct: tickers.changePct, updatedAt: new Date() },
      });
  }
}
