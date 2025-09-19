import { useContext, useEffect, useCallback } from "react";
import { StockContext } from "./stockContext";

const API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY";

export default function StockList() {
  const { stocks, setStocks } = useContext(StockContext);

  const fetchCurrentPrices = useCallback(async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        const currentPrice = data["Global Quote"] ? parseFloat(data["Global Quote"]["05. price"]) : stock.currentPrice;
        return { ...stock, currentPrice };
      })
    );
    setStocks(updatedStocks);
  }, [stocks, setStocks]);

  useEffect(() => {
    if (stocks.length > 0) {
      fetchCurrentPrices();
    }
  }, [stocks, fetchCurrentPrices]);

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
          const profitLoss = (stock.currentPrice - stock.purchasePrice) * stock.quantity;
          return (
            <tr key={index}>
              <td>{stock.symbol}</td>
              <td>{stock.quantity}</td>
              <td>${stock.purchasePrice.toFixed(2)}</td>
              <td>${stock.currentPrice ? stock.currentPrice.toFixed(2) : "Loading..."}</td>
              <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
                {profitLoss ? `$${profitLoss.toFixed(2)}` : "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
