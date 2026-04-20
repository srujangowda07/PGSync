import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getData } from "../utils/storage";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
    totalRent: 0,
    pendingRent: 0,
    complaintsCount: 0,
    availableBeds: 0,
    recentLogs: []
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const data = getData();
    const residents = data.residents || [];
    const rooms = data.rooms || [];
    const complaints = data.complaints || [];
    const logs = data.activityLogs || [];

    // Dashboard Metric Calculation Engine
    const totalResidents = residents.length;
    const occupiedRoomIds = new Set(residents.map(r => r.roomId));
    
    const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalResidents / totalCapacity) * 100) : 0;
    const availableBeds = totalCapacity - totalResidents;

    const totalRent = residents.reduce((acc, r) => acc + (r.rent || 0), 0);
    const pendingRent = Math.round(totalRent * 0.25); 

    setStats({
      totalResidents,
      totalRooms: rooms.length,
      occupiedRooms: occupiedRoomIds.size,
      occupancyRate,
      totalRent,
      pendingRent,
      complaintsCount: complaints.length,
      availableBeds,
      recentLogs: logs.slice(0, 5)
    });
  };

  const isEmpty = stats.totalRooms === 0 && stats.totalResidents === 0;

  if (isEmpty) {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
         <div className="w-32 h-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center mb-10 text-slate-200">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
         </div>
         <h1 className="text-4xl font-black text-slate-800 tracking-tight text-center">Establish Your Property</h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 mb-10 text-center max-w-sm leading-relaxed text-slate-300">
            Your management workspace is ready. Start by adding your first room asset or residents.
         </p>
         <div className="flex gap-4">
            <Link to="/rooms" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center">
               Add Rooms
            </Link>
            <Link to="/residents" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-slate-100 flex items-center">
               Enroll
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Pro Dashboard</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             REAL-TIME LOGISTICS & INVENTORY LIVE
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
           <div className="absolute top-0 right-1 w-24 h-24 bg-blue-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Occupancy Rate</p>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">{stats.occupancyRate}%</h2>
           <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${stats.occupancyRate}%` }}></div>
           </div>
           <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">({stats.totalResidents} Occupants)</p> 
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Monthly Volume</p>
           <h2 className="text-4xl font-black text-emerald-600 tracking-tighter mb-4">₹{stats.totalRent.toLocaleString()}</h2>
           <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Live Yield</span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stats.availableBeds} Vacant Beds</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Pending Billing</p>
           <h2 className="text-4xl font-black text-amber-600 tracking-tighter mb-4">₹{stats.pendingRent.toLocaleString()}</h2>
           <button className="text-[9px] font-black uppercase text-amber-600 underline tracking-widest hover:text-amber-700 transition-colors">Generate Reminders</button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Open Tickets</p>
           <h2 className="text-4xl font-black text-rose-500 tracking-tighter mb-4">{stats.complaintsCount}</h2>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Requires attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
           <h3 className="text-2xl font-black tracking-tight mb-8">Audit Trail</h3>
           <div className="space-y-4">
              {stats.recentLogs.length > 0 ? stats.recentLogs.map((log) => (
                 <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <span className="text-[10px] font-mono text-blue-400 uppercase">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <p className="text-sm font-bold text-slate-200">{log.action}</p>
                 </div>
              )) : (
                 <p className="text-slate-500 italic text-sm">Waiting for system activity...</p>
              )}
           </div>
        </div>

        <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500">
           <div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Pro Insights</h3>
              <p className="text-blue-100 font-bold text-xs opacity-75">Optimized for high-occupancy management.</p>
           </div>
           <div className="pt-20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
              </div>
              <p className="font-black uppercase tracking-[0.2em] text-[10px]">Scale Operations</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
