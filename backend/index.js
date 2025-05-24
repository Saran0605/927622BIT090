const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Updated credentials
const CLIENT_DATA = {
  email: "927622bit090@mkce.ac.in",
  name: "saran s",
  rollNo: "927622bit090",
  accessCode: "wheQUy",
  clientID: "ccd0b6c8-d4dc-4491-8c06-1e37b5b0b119",
  clientSecret: "HSAEtjCEAWMSfKHK"
};

// Variables to store token and expiry
let accessToken = null;
let tokenExpiry = 0;

// Function to fetch token
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
    console.log("Access Token:", accessToken);
    // If expires_in is provided by API, better to use that
    // But here, assume 1 hour from now
    tokenExpiry = Date.now() + 3600 * 1000; 
    console.log("✅ Access Token Fetched");
  } catch (error) {
    console.error("❌ Error fetching token:", error.response?.data || error.message);
  }
}

// Middleware to check token validity
async function ensureTokenValid(req, res, next) {
  if (!accessToken || Date.now() > tokenExpiry) {
    await fetchAccessToken();
  }
  next();
}

// Route to fetch stocks
app.get('/stocks', ensureTokenValid, async (req, res) => {
  try {
    console.log("Fetching stocks...");
    const response = await axios.get('http://20.244.56.144/evaluation-service/stocks', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching stocks:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
