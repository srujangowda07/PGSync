import { useState, useEffect } from "react";
import { getData } from "../utils/storage";

const Dashboard = () => {
  const [data, setData] = useState({ residents: [], rooms: [], complaints: [], blocks: [], activityLogs: [] });

  useEffect(() => {
    const pgsyncData = getData();
    setData(pgsyncData);
  }, []);

  const totalResidents = data.residents.length;
  const totalBeds = data.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((totalResidents / totalBeds) * 100) : 0;
  
  const totalRevenueTarget = data.residents.reduce((acc, res) => {
    const base = 5000;
    const wifi = res.addons.wifi ? 500 : 0;
    const mess = res.addons.mess ? 3000 : 0;
    return acc + base + wifi + mess;
  }, 0);

  const collectedRevenue = data.residents.filter(r => r.paid).reduce((acc, res) => {
    const base = 5000;
    const wifi = res.addons.wifi ? 500 : 0;
    const mess = res.addons.mess ? 3000 : 0;
    return acc + base + wifi + mess;
  }, 0);

  const pendingComplaints = data.complaints.filter(c => c.status !== "Resolved").length;
  const highPriorityComplaints = data.complaints.filter(c => c.priority === "High" && c.status !== "Resolved").length;

  const stats = [
    { label: "Occupancy", value: `${occupancyRate}%`, sub: `(${totalResidents}/${totalBeds} beds)`, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Monthly Revenue", value: `₹${collectedRevenue.toLocaleString()}`, sub: `Target: ₹${totalRevenueTarget.toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Collection", value: `₹${(totalRevenueTarget - collectedRevenue).toLocaleString()}`, sub: "Drafting Reminders...", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Maintenance", value: pendingComplaints, sub: highPriorityComplaints > 0 ? `${highPriorityComplaints} HIGH PRIORITY` : "No Urgent Issues", color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Pro Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">SaaS Edition • Analytics Engine v2.5</p>
        </div>
        <div className="bg-white border-2 border-slate-900 px-6 py-3 rounded-2xl shadow-[6px_6px_0px_#0f172a] transform -rotate-1">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-1 mb-1">System Status</p>
           <p className="text-sm font-black text-slate-700">Operational & Syncing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full opacity-20 group-hover:scale-150 transition-transform`}></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 relative z-10">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} mb-1 relative z-10 tracking-tight`}>{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60 relative z-10">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-4 mb-10">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
             <h2 className="text-xl font-black uppercase tracking-widest">Real-time Activity Log</h2>
          </div>
          <div className="space-y-6">
            {data.activityLogs?.slice(0, 5).map((log) => (
              <div key={log.id} className="flex gap-6 items-start group">
                <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors leading-relaxed">{log.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-blue-600 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
             <h3 className="text-xl font-black mb-2 relative z-10">Pro Analytics</h3>
             <p className="text-blue-100 text-sm leading-relaxed mb-6 relative z-10">
               Unlock historical trends and predictive forecasting to maximize your yield.
             </p>
             <div className="relative z-10 bg-white/20 text-white border border-white/30 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center backdrop-blur-sm">
               Coming Soon
             </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-2">Quick Distribution</h3>
             <div className="space-y-4">
               {data.blocks.map(b => {
                 const blockRooms = data.rooms.filter(r => r.block === b);
                 const blockOcc = blockRooms.reduce((acc, r) => acc + r.occupied, 0);
                 const blockCap = blockRooms.reduce((acc, r) => acc + r.capacity, 0);
                 const perc = blockCap > 0 ? Math.round((blockOcc/blockCap) * 100) : 0;
                 return (
                   <div key={b}>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                       <span className="text-slate-600">Block {b} Site</span>
                       <span className="text-slate-900">{perc}%</span>
                     </div>
                     <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-900" style={{ width: `${perc}%` }}></div>
                     </div>
                   </div>
                 )
               })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
