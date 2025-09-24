
import "./App.css"; 

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "TWQHEC7ETXM6C044";

async function fetchCurrentPrices(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const gq = data["Global Quote"] || data["Global quote"];
    if (!gq) return null;

    const priceRaw = gq["05. price"] || gq.price || null;
    const price = priceRaw ? Number(priceRaw) : null;
    if (!price || Number.isNaN(price)) return null;

    return { price, raw: gq };
  } catch (e) {
    return null;
  }
}
