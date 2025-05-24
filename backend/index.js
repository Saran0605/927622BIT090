const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const CLIENT_DATA = {
  email: "927622bit090@mkce.ac.in",
  name: "saran s",
  rollNo: "927622bit090",
  accessCode: "wheQUy",
  clientID: "ccd0b6c8-d4dc-4491-8c06-1e37b5b0b119",
  clientSecret: "HSAEtjCEAWMSfKHK"
};

let accessToken = null;
let tokenExpiry = 0;

async function fetchAccessToken() {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email: CLIENT_DATA.email,
      name: CLIENT_DATA.name,
      accessCode: CLIENT_DATA.accessCode,
      clientID: CLIENT_DATA.clientID,
      clientSecret: CLIENT_DATA.clientSecret,
      rollNo: CLIENT_DATA.rollNo
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3600 * 1000; // 1 hour expiry
    console.log("✅ Access Token Fetched");
  } catch (error) {
    console.error("❌ Error fetching token:", error.response?.data || error.message);
  }
}

async function ensureTokenValid(req, res, next) {
  if (!accessToken || Date.now() > tokenExpiry) {
    await fetchAccessToken();
  }
  next();
}

app.get('/stocks', ensureTokenValid, async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/evaluation-service/stocks', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// New route for stock price history
app.get('/stocks/:symbol/history', ensureTokenValid, async (req, res) => {
  const { symbol } = req.params;
  const { minutes = 50 } = req.query; // default 50 minutes if not provided
  try {
    const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${symbol}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { minutes }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
