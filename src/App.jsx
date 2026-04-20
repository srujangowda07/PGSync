import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import Residents from "./pages/Residents";
import Rent from "./pages/Rent";
import Complaints from "./pages/Complaints";
import Deposit from "./pages/Deposit";
import Logs from "./pages/Logs";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import SecurityKYC from "./pages/SecurityKYC";
import Chat from "./pages/Chat";
import MultiSiteComingSoon from "./pages/MultiSiteComingSoon";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="min-h-[calc(100vh-160px)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomManagement />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/analytics-pro" element={<AdvancedAnalytics />} />
            <Route path="/kyc" element={<SecurityKYC />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/multi-site-soon" element={<MultiSiteComingSoon />} />
          </Routes>
        </main>
        <footer className="py-12 border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <p className="text-xl font-black text-slate-800 tracking-tight">PGSync Pro</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Management Suite v2.5</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               <span className="hover:text-blue-600 cursor-pointer transition-colors">Integration API</span>
               <span className="hover:text-blue-600 cursor-pointer transition-colors">Compliance</span>
               <span className="hover:text-blue-600 cursor-pointer transition-colors">Cloud Status</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400">&copy; 2026 Antigravity Systems.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
