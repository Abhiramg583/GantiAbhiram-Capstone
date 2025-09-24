import { useState, useContext } from "react";
import { StockContext } from "./stockContext";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "TWQHEC7ETXM6C044";

export default function StockForm() {
  const { stocks, setStocks } = useContext(StockContext);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol || !quantity || !purchasePrice) return;

    const symbolTrimmed = symbol.trim().toUpperCase();

    setLoading(true);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolTrimmed}&apikey=${API_KEY}`
      );
      const data = await response.json();

      // Debug: log full API response
      console.log("AlphaVantage response:", data);

      const quote = data["Global Quote"];
      if (!quote || !quote["05. price"]) {
        alert(
          "Invalid stock symbol or API limit reached. Check console for details."
        );
        setLoading(false);
        return;
      }

      const currentPrice = parseFloat(quote["05. price"]);
      if (Number.isNaN(currentPrice)) {
        alert("Unable to parse current price from API response.");
        setLoading(false);
        return;
      }

      // Add stock to list
      setStocks([
        ...stocks,
        {
          symbol: symbolTrimmed,
          quantity: parseInt(quantity),
          purchasePrice: parseFloat(purchasePrice),
          currentPrice,
        },
      ]);

      // Reset form
      setSymbol("");
      setQuantity("");
      setPurchasePrice("");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching stock. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <input
        type="text"
        placeholder="Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        disabled={loading}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        disabled={loading}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Purchase Price"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Stock"}
      </button>
    </form>
  );
}
