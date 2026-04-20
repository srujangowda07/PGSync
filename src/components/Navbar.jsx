import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/storage";

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const user = getCurrentUser();
  const [showPropertySwitch, setShowPropertySwitch] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const switchRef = useRef(null);
  const moreRef = useRef(null);
  const menuRef = useRef(null);

  // Close switch/more/menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switchRef.current && !switchRef.current.contains(event.target)) {
        setShowPropertySwitch(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close switch/more/menu when location changes
  useEffect(() => {
    setShowPropertySwitch(false);
    setShowMoreMenu(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const coreLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/rooms", label: "Rooms" },
    { path: "/residents", label: "Residents" },
    { path: "/rent", label: "Rent" },
  ];

  const utilityLinks = [
    { path: "/complaints", label: "Issues" },
    { path: "/kyc", label: "KYC" },
    { path: "/chat", label: "Chat" },
    { path: "/analytics-pro", label: "Stats" },
    { path: "/logs", label: "Audit" },
  ];

  const allLinks = [...coreLinks, ...utilityLinks];

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-[60] h-20">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* Brand & Switcher Group */}
        <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-shrink">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
               <span className="text-white font-black text-xl">PG</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight hidden 2xl:block italic font-black">Sync Pro</span>
          </Link>

          <div className="relative" ref={switchRef}>
             <button 
              onClick={() => setShowPropertySwitch(!showPropertySwitch)}
              className="group flex items-center gap-1.5 md:gap-3 bg-slate-50 px-2.5 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 transition-all border border-slate-200 shadow-sm"
             >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
                <span className="truncate max-w-[70px] sm:max-w-[100px] lg:max-w-[150px]">Global Heights • A</span>
                <svg className={`w-3 h-3 md:w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${showPropertySwitch ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                </div>
             )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60 transition-all">
          {coreLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 xl:px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                location.pathname === link.path
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="relative" ref={moreRef}>
            <button
               onClick={() => setShowMoreMenu(!showMoreMenu)}
               className={`px-3 xl:px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                 showMoreMenu ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
               }`}
            >
               More
               <svg className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </button>

            {showMoreMenu && (
              <div className="absolute top-[120%] right-0 w-48 bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 z-[100] animate-in slide-in-from-top-2 duration-200">
                 {utilityLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        location.pathname === link.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
           <div className="hidden xl:flex flex-col items-end border-r border-slate-100 pr-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-none mb-1 truncate max-w-[100px]">{user?.username || 'Admin'}</p>
              <button 
                onClick={handleLogoutClick}
                className="text-[9px] font-black uppercase text-rose-600 hover:underline tracking-tighter leading-none"
              >
                Sign Out
              </button>
           </div>

           <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xs md:text-sm font-black shadow-lg shadow-slate-200 border-2 border-white ring-1 ring-slate-100 uppercase">
              {user?.username?.charAt(0) || 'A'}
           </div>

           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200/60 text-slate-600 hover:bg-slate-100 transition-all"
           >
             {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
             ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             )}
           </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
           <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-in slide-in-from-top-4 duration-300" ref={menuRef}>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                 {allLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center border text-center ${
                        location.pathname === link.path
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                          : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-white hover:border-slate-200"
                      }`}
                    >
                      {link.label}
                    </Link>
                 ))}
                 <button 
                    onClick={handleLogoutClick}
                    className="px-4 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center border text-center bg-rose-50 text-rose-600 border-rose-100"
                 >
                    Sign Out
                 </button>
              </div>
           </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
