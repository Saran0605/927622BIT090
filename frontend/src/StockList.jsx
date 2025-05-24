import React, { useEffect, useState } from "react";
import axios from "axios";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/stocks");
        const stockObject = response.data.stocks;
        const stockArray = Object.entries(stockObject).map(([companyName, symbol]) => ({
          companyName,
          symbol,
          price: Math.floor(Math.random() * 1000) + 100,
          change: (Math.random() * 10 - 5).toFixed(2),
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

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontWeight: "700" }}>📈 Stock Dashboard</h1>
      </header>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Symbol</th>
            <th style={styles.th}>Price ($)</th>
            <th style={styles.th}>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, idx) => (
            <tr
              key={idx}
              style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f8ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#ffffff" : "#f9f9f9")
              }
            >
              <td style={styles.td}>{stock.companyName}</td>
              <td style={styles.td}>{stock.symbol}</td>
              <td style={styles.td}>{stock.price}</td>
              <td
                style={{
                  ...styles.td,
                  color: stock.change >= 0 ? "#27ae60" : "#c0392b",
                  fontWeight: "600",
                }}
              >
                {stock.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer style={styles.footer}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Stock Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 900,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "20px 30px",
    textAlign: "center",
    fontSize: 24,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#34495e",
    color: "#ecf0f1",
    padding: "12px 15px",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    borderBottom: "2px solid #2c3e50",
  },
  td: {
    padding: "12px 15px",
    fontSize: 14,
    borderBottom: "1px solid #ddd",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#ffffff",
    transition: "background-color 0.3s ease",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
    transition: "background-color 0.3s ease",
  },
  footer: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    textAlign: "center",
    padding: "15px 30px",
    fontSize: 14,
    marginTop: 20,
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: 18,
    color: "#34495e",
  },
};

export default StockList;
