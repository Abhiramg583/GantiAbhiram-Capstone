import { useState } from "react";
import "./App.css";

function App() {
  const [stocks, setStocks] = useState([]);

  function addStock(stock) {
    setStocks([...stocks, stock]);
  }

  return (
    <div className="App">
      <h1>Finance Dashboard</h1>
      <StockForm onAddStock={addStock} />
      <h2>Stock List</h2>

      {stocks.length === 0 ? (
        <p>No stocks added yet.</p>
      ) : (
        <ul>
          {stocks.map((s, index) => (
            <li key={index}>
              <span className="symbol">{s.symbol}</span>
              <span className="details">
                {s.quantity} shares @ ${s.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StockForm({ onAddStock }) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!symbol || quantity <= 0 || price <= 0) return;

    const newStock = {
      symbol: symbol.toUpperCase(),
      quantity: Number(quantity),
      price: Number(price),
    };

    onAddStock(newStock);

    setSymbol("");
    setQuantity("");
    setPrice("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="AAPL"
        required
      />

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="2"
        min="1"
        required
      />

      <input
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="123.99"
        min="0.01"
        required
      />

      <button type="submit">Add Stock</button>
    </form>
  );
}

export default App;
