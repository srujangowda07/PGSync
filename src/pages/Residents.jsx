import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getData, saveData, addLog } from "../utils/storage";

const Residents = () => {
  const [data, setData] = useState({ residents: [], rooms: [] });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roomId: "",
    bedNumber: "B1",
    rent: "",
    deposit: "",
    joinDate: new Date().toISOString().split('T')[0],
    addons: { wifi: false, mess: false }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const freshData = getData();
    setData(freshData);
    if (freshData.rooms.length > 0 && !formData.roomId) {
      setFormData(prev => ({ ...prev, roomId: freshData.rooms[0].id }));
    }
  };

  const getOccupancyCount = (roomId) => {
    return data.residents.filter(r => r.roomId === roomId).length;
  };

  const handleAddResident = (e) => {
    e.preventDefault();
    setError("");

    const room = data.rooms.find(r => r.id === formData.roomId);
    if (!room) {
      setError("Invalid room selection");
      return;
    }

    if (getOccupancyCount(room.id) >= room.capacity) {
      setError(`Room ${room.number} is already at full capacity (${room.capacity} sharing).`);
      return;
    }

    const newResident = {
      ...formData,
      id: uuidv4(),
      rent: parseFloat(formData.rent) || 0,
      deposit: parseFloat(formData.deposit) || 0,
      bedNumber: `B${getOccupancyCount(room.id) + 1}`,
      paid: false
    };

    const updatedData = {
      ...data,
      residents: [...data.residents, newResident]
    };

    saveData(updatedData);
    loadData();
    addLog(`Enrollment Contract: ${newResident.name} assigned to Room ${room.number}`);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      roomId: data.rooms[0]?.id || "",
      bedNumber: "B1",
      rent: "",
      deposit: "",
      joinDate: new Date().toISOString().split('T')[0],
      addons: { wifi: false, mess: false }
    });
  };

  const filteredResidents = data.residents.filter(res => {
    const room = data.rooms.find(r => r.id === res.roomId);
    const query = searchQuery.toLowerCase();
    return (
      res.name.toLowerCase().includes(query) ||
      (room && room.number.toLowerCase().includes(query))
    );
  });

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Resident Archive</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 text-slate-300">Tenant Lifecycle & Enrollment</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-100 flex items-center gap-3"
        >
          {showAddForm ? 'Cancel Enrollment' : 'Enroll New Resident'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full relative">
           <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input
             type="text"
             className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all placeholder:text-slate-300 text-sm"
             placeholder="Search by name or room number..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] animate-in slide-in-from-top-10 duration-500">
          <form onSubmit={handleAddResident} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Full Legal Name</label>
              <input
                type="text"
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Primary Contact</label>
              <input
                type="tel"
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Target Room Asset</label>
              <select
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.roomId}
                onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                required
              >
                <option value="">Select a Room</option>
                {data.rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.number} ({getOccupancyCount(room.id)}/{room.capacity} Occupied)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Monthly Billing (₹)</label>
              <input
                type="number"
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.rent}
                onChange={(e) => setFormData({...formData, rent: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Security Deposit (₹)</label>
              <input
                type="number"
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.deposit}
                onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Onboarding Date</label>
              <input
                type="date"
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                value={formData.joinDate}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-6 items-center pt-4">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                    checked={formData.addons.wifi}
                    onChange={(e) => setFormData({...formData, addons: { ...formData.addons, wifi: e.target.checked }})}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-600 transition-colors">Gigabit WiFi</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                    checked={formData.addons.mess}
                    onChange={(e) => setFormData({...formData, addons: { ...formData.addons, mess: e.target.checked }})}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-600 transition-colors">Mess Services</span>
               </label>
            </div>

            <div className="lg:col-span-3 pt-6">
              {error && <p className="text-rose-500 font-bold text-xs mb-6 px-2 flex items-center gap-2">⚠️ {error}</p>}
              <button className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200">
                Execute Enrollment Contract
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resident List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Name Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {searchQuery ? `No records matching "${searchQuery}"` : "No active residents found in the archive"}
                  </td>
                </tr>
              ) : (
                filteredResidents.map(res => {
                  const room = data.rooms.find(r => r.id === res.roomId);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{res.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {res.id.split('-')[0]}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Room {room?.number || 'N/A'}</span>
                           <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{res.bedNumber}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600 text-sm">{res.phone}</td>
                      <td className="px-8 py-6 font-bold text-slate-600 text-sm">{res.joinDate}</td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to={`/resident/${res.id}`}
                          className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-100"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Residents;
