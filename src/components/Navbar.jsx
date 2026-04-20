import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [showPropertySwitch, setShowPropertySwitch] = useState(false);
  const switchRef = useRef(null);

  // Close switch when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switchRef.current && !switchRef.current.contains(event.target)) {
        setShowPropertySwitch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close switch when location changes
  useEffect(() => {
    setShowPropertySwitch(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/rooms", label: "Rooms" },
    { path: "/residents", label: "Residents" },
    { path: "/rent", label: "Rent" },
    { path: "/complaints", label: "Issues" },
    { path: "/kyc", label: "KYC" },
    { path: "/chat", label: "Chat" },
    { path: "/analytics-pro", label: "Stats" },
    { path: "/logs", label: "Audit" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-[60] px-6 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Brand & Switcher Group */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
               <span className="text-white font-black text-xl">PG</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight hidden lg:block">Sync <span className="text-blue-600">Pro</span></span>
          </Link>

          <div className="relative" ref={switchRef}>
             <button 
              onClick={() => setShowPropertySwitch(!showPropertySwitch)}
              className="group flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 transition-all border border-slate-200 shadow-sm"
             >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Global Heights • A
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showPropertySwitch ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
             </button>

             {showPropertySwitch && (
                <div className="absolute top-[120%] left-0 w-64 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 z-[100] animate-in slide-in-from-top-2 duration-200">
                   <div className="p-4 bg-blue-600 rounded-2xl mb-2 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 leading-none">Active Site</p>
                      <p className="text-sm font-bold">Global Heights (Main)</p>
                   </div>
                   <div className="p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-colors opacity-50 cursor-not-allowed grayscale">
                      <div className="flex justify-between items-center">
                         <p className="text-sm font-bold text-slate-500">Sunshine Elite</p>
                         <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">Coming Soon</span>
                      </div>
                   </div>
                   <div className="mt-2 pt-2 border-t border-slate-100">
                      <Link 
                        to="/multi-site-soon"
                        className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                      >
                        Add New Property
                      </Link>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                location.pathname === link.path
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end border-r border-slate-100 pr-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-none mb-1">Admin Account</p>
              <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter leading-none">Coming Soon</p>
              </div>
           </div>
           <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-200 border-2 border-white ring-1 ring-slate-100">
              AD
           </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
