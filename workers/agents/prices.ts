import { chromium } from "playwright";
import { db, priceWatchlist, priceHistory } from "../shared/db";
import { sendPriceDrop } from "../shared/telegram";
import { eq } from "drizzle-orm";

const DROP_THRESHOLD = 0.15;

const SELECTORS: Record<string, string[]> = {
  Lazada:     ["[data-spm='price'] span", ".pdp-price_type_normal span", "._2Ttkn span"],
  Shopee:     ["._3n5NQ1", ".pqTWkA"],
  Amazon:     ["#priceblock_ourprice", ".a-price .a-offscreen", "#apex_desktop .a-price span"],
  "Apple Store": [".as-price-currentprice span", ".rc-prices-fullprice"],
};

async function scrapePrice(url: string, platform: string): Promise<number | null> {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    locale: "en-SG",
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForTimeout(2_000);
    const selectors = [...(SELECTORS[platform] ?? []), "[class*='price']", "[data-price]"];
    for (const sel of selectors) {
      const el = await page.$(sel);
      if (!el) continue;
      const text = await el.innerText();
      const digits = text.replace(/[^0-9.]/g, "");
      if (digits) { await browser.close(); return parseFloat(digits); }
    }
  } catch (e) {
    console.warn(`[prices] scrape error ${url}:`, e);
  }
  await browser.close();
  return null;
}

export async function runPrices() {
  const items = await db.select().from(priceWatchlist);
  console.log(`[prices] checking ${items.length} watchlist items`);

  for (const item of items) {
    const newPrice = await scrapePrice(item.url, item.platform);
    if (newPrice === null) { console.log(`[prices] could not get price for ${item.name}`); continue; }

    await db.insert(priceHistory).values({ itemId: item.id, price: String(newPrice) });

    const highest = Math.max(newPrice, Number(item.highestPrice ?? newPrice));
    await db.update(priceWatchlist)
      .set({ currentPrice: String(newPrice), highestPrice: String(highest), lastChecked: new Date() })
      .where(eq(priceWatchlist.id, item.id));

    const oldPrice   = Number(item.currentPrice);
    const targetPrice = Number(item.targetPrice);
    const dropped    = oldPrice > 0 && (oldPrice - newPrice) / oldPrice >= DROP_THRESHOLD;
    const hitTarget  = targetPrice > 0 && newPrice <= targetPrice;

    if (dropped || hitTarget) {
      await sendPriceDrop(item.name, newPrice, item.currency, targetPrice || oldPrice, item.platform, item.url);
    }
    console.log(`[prices] ${item.name}: ${item.currency} ${newPrice}`);
  }
}
