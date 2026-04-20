import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import Residents from "./pages/Residents";
import ResidentDetail from "./pages/ResidentDetail";
import Rent from "./pages/Rent";
import Complaints from "./pages/Complaints";
import Login from "./pages/Login";

// High Priority Components
import SecurityKYC from "./pages/SecurityKYC";
import Chat from "./pages/Chat";
import Logs from "./pages/Logs";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";

import { getCurrentUser } from "./utils/storage";

function App() {
  const [user, setUser] = useState(getCurrentUser());

  const handleLogin = (newUser) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar onLogout={handleLogout} />
        <main className="pb-20">
          <Routes>
            {/* Explicit Utility Routes First */}
            <Route path="/kyc" element={<SecurityKYC />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/analytics-pro" element={<AdvancedAnalytics />} />
            
            {/* Core Management Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomManagement />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/resident/:id" element={<ResidentDetail />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/complaints" element={<Complaints />} />

            {/* Redirects */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
