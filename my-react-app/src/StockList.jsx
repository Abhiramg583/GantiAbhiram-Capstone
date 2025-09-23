import { useContext, useEffect } from "react";
import { StockContext } from "./stockContext";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "TWQHEC7ETXM6C044";

export default function StockList() {
  const { stocks, setStocks } = useContext(StockContext);

  useEffect(() => {
  if (stocks.length === 0) return;

  const fetchCurrentPrices = async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`
          );
          const data = await response.json();
          const currentPrice = data["Global Quote"]
            ? parseFloat(data["Global Quote"]["05. price"])
            : stock.currentPrice;

          return { ...stock, currentPrice };
        } catch {
          return stock;
        }
      })
    );

    setStocks(updatedStocks);
  };

  // Run every 60 seconds
  const interval = setInterval(fetchCurrentPrices, 60000);
  fetchCurrentPrices();

  return () => clearInterval(interval);
}, [setStocks]);


  if (stocks.length === 0) return <p>No stocks added yet.</p>;

  return (
    <table className="stock-list">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Quantity</th>
          <th>Purchase Price</th>
          <th>Current Price</th>
          <th>Profit/Loss</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock, index) => {
          const profitLoss =
            (stock.currentPrice - stock.purchasePrice) * stock.quantity;
          return (
            <tr key={index}>
              <td>{stock.symbol}</td>
              <td>{stock.quantity}</td>
              <td>${stock.purchasePrice.toFixed(2)}</td>
              <td>
                {stock.currentPrice
                  ? `$${stock.currentPrice.toFixed(2)}`
                  : "Loading..."}
              </td>
              <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
                {isNaN(profitLoss) ? "-" : `$${profitLoss.toFixed(2)}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
