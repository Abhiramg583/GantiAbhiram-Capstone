import { StockProvider } from "./stockContext";
import StockForm from "./StockForm";
import StockList from "./StockList";
import "./App.css";

function App() {
  return (
    <StockProvider>
      <div className="app">
        <h1>Finance Dashboard</h1>
        <StockForm />
        <StockList />
      </div>
    </StockProvider>
  );
}

export default App;
