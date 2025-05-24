import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Make sure axios is installed

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const getStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      const stockObject = response.data.stocks;
      console.log(stockObject);

      const stockArray = Object.entries(stockObject).map(([companyName, symbol]) => ({
        companyName,
        symbol,
        price: Math.floor(Math.random() * 1000) + 100,
        change: (Math.random() * 10 - 5).toFixed(2)
      }));

      setStocks(stockArray);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  getStocks();
}, []);


  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📈 Stock Dashboard</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, idx) => (
            <tr key={idx}>
              <td>{stock.companyName}</td>
              <td>{stock.symbol}</td>
              <td>{stock.price}</td>
              <td style={{ color: stock.change >= 0 ? "green" : "red" }}>
                {stock.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
