import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockList from "./StockList";
import StockDetails from "./StockDetails";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StockList />} />
      <Route path="/stocks/:symbol" element={<StockDetails />} />
    </Routes>
  </Router>
);

export default App;
