import React from "react";
import Home from "./components/home.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>

        {/* Protected Home */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Others */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </div>
  );
}

export default App;
