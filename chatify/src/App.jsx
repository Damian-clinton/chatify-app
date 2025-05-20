import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Chattify from "./components/Chattify.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

  function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/" element={ <Chattify />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
