import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Chattify from "./components/Chattify.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const user = window.localStorage.getItem("user");
  const token = window.localStorage.getItem("chat-token");
  console.log("user from localStorage:", user);
  console.log("token from localStorage:", token);
  setIsLoggedIn(user);
  setToken(token);
  setLoading(false);
}, []); 

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            !isLoggedIn && !token ? <Navigate to="/login" /> : <Chattify />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

