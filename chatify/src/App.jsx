import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Chattify from "./components/Chattify.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [user] = useState(() => {
    const saved = window.localStorage.getItem("user");
    return saved ||null;
  });

  const [token] = useState(() => window.localStorage.getItem("chat-token"));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={!user || !token ? <Navigate to="/login" /> : <Chattify />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
