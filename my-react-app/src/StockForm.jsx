import { useState, useContext } from "react";
import { StockContext } from "./stockContext";

const API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY";

export default function StockForm() {
  const { stocks, setStocks } = useContext(StockContext);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!symbol || !quantity || !purchasePrice) return;

    // Fetch current price to validate symbol
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
      alert("Invalid stock symbol!");
      return; // Ignore invalid symbol
    }

    setStocks([
      ...stocks,
      {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(data["Global Quote"]["05. price"]),
      }
    ]);

    setSymbol("");
    setQuantity("");
    setPurchasePrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <input 
        type="text" 
        placeholder="Stock Symbol" 
        value={symbol} 
        onChange={(e) => setSymbol(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Quantity" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)} 
      />
      <input 
        type="number" 
        step="0.01"
        placeholder="Purchase Price" 
        value={purchasePrice} 
        onChange={(e) => setPurchasePrice(e.target.value)} 
      />
      <button type="submit">Add Stock</button>
    </form>
  );
}
