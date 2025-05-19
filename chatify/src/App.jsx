import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Chattify from "./components/Chattify.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [hasConversation, setHasConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(window.localStorage.getItem("user"));
    setHasConversation(window.sessionStorage.getItem("selectedConversationID"));
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
            !isLoggedIn && !hasConversation ? <Navigate to="/login" /> : <Chattify />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

