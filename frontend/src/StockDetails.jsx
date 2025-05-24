import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const StockDetails = () => {
  const { symbol } = useParams();
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Now calling your own backend instead of external API directly
        const response = await axios.get(
          `http://localhost:5000/stocks/${symbol}/history?minutes=50`
        );

        const history = response.data.stock?.priceHistory || [];
        setPriceHistory(history);
      } catch (err) {
        setError("Failed to load price history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [symbol]);

  if (loading) return <div style={styles.loading}>Loading price history...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Price History for {symbol}</h2>
      </header>

      <Link to="/" style={styles.backLink}>
        ← Back to Stock List
      </Link>

      {priceHistory.length === 0 ? (
        <p>No price history available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Price ($)</th>
              <th style={styles.th}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map(({ price, lastUpdatedAt }, idx) => (
              <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{price.toFixed(4)}</td>
                <td style={styles.td}>{new Date(lastUpdatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Stock Dashboard.
      </footer>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  backLink: {
    display: "inline-block",
    marginBottom: 15,
    color: "#2980b9",
    textDecoration: "none",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #34495e",
    padding: "12px",
    backgroundColor: "#34495e",
    color: "#ecf0f1",
    textAlign: "center",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  loading: {
    textAlign: "center",
    padding: 50,
    fontSize: 18,
    color: "#34495e",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 14,
    color: "#7f8c8d",
  },
};

export default StockDetails;
