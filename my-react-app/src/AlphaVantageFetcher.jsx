
import "./App.css"; // import your CSS file

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || "YOUR_API_KEY_HERE";


async function fetchGlobalQuote(symbol) {
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