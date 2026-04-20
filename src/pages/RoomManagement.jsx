import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getData, saveData, addLog } from "../utils/storage";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [residents, setResidents] = useState([]);
  const [addMode, setAddMode] = useState("single"); // single | bulk
  
  // Single Add State
  const [newRoom, setNewRoom] = useState({ number: "", capacity: 2 });
  
  // Bulk Add State
  const [bulkConfig, setBulkConfig] = useState({
    prefix: "",
    startNumber: 101,
    count: 5,
    capacity: 2
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const data = getData();
    setRooms(data.rooms || []);
    setResidents(data.residents || []);
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newRoom.number.trim()) return;

    if (rooms.find(r => r.number === newRoom.number)) {
      setError(`Room ${newRoom.number} already exists.`);
      return;
    }

    const currentData = getData();
    const room = {
      id: uuidv4(),
      number: newRoom.number,
      capacity: parseInt(newRoom.capacity),
      occupants: [] 
    };

    const updatedData = {
      ...currentData,
      rooms: [...currentData.rooms, room]
    };

    saveData(updatedData);
    loadRooms();
    addLog(`Asset Deployment: Room ${room.number} initialized with ${room.capacity} slots`);
    setNewRoom({ number: "", capacity: 2 });
    setSuccess(`Room ${room.number} deployed successfully.`);
  };

  const handleBulkAdd = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const count = parseInt(bulkConfig.count);
    const start = parseInt(bulkConfig.startNumber);
    const capacity = parseInt(bulkConfig.capacity);
    
    if (isNaN(count) || count <= 0) {
      setError("Please provide a valid count.");
      return;
    }

    const currentData = getData();
    const existingRooms = new Set(currentData.rooms.map(r => r.number));
    const newRooms = [];
    const duplicates = [];

    for (let i = 0; i < count; i++) {
      const roomNum = `${bulkConfig.prefix}${start + i}`;
      if (existingRooms.has(roomNum)) {
        duplicates.push(roomNum);
      } else {
        newRooms.push({
          id: uuidv4(),
          number: roomNum,
          capacity: capacity,
          occupants: []
        });
      }
    }

    if (duplicates.length > 0) {
      setError(`Batch aborted. The following room numbers already exist: ${duplicates.slice(0, 3).join(", ")}${duplicates.length > 3 ? "..." : ""}`);
      return;
    }

    const updatedData = {
      ...currentData,
      rooms: [...currentData.rooms, ...newRooms]
    };

    saveData(updatedData);
    loadRooms();
    addLog(`Batch Deployment: ${newRooms.length} rooms initialized starting from ${newRooms[0].number}`);
    setSuccess(`Successfully deployed ${newRooms.length} new room assets.`);
  };

  const handleDeleteRoom = (roomId) => {
    const data = getData();
    const room = data.rooms.find(r => r.id === roomId);
    const occupants = data.residents.filter(r => r.roomId === roomId);

    if (occupants.length > 0) {
      alert(`Cannot decommission Room ${room.number}: Asset is currently occupied by ${occupants.length} residents.`);
      return;
    }

    if (window.confirm(`Are you sure you want to decommission Room ${room.number}?`)) {
      const updatedRooms = data.rooms.filter(r => r.id !== roomId);
      saveData({ ...data, rooms: updatedRooms });
      loadRooms();
      addLog(`Asset Decommissioned: Room ${room.number} removed from inventory`);
    }
  };

  const getOccupancyCount = (roomId) => {
    return residents.filter(r => r.roomId === roomId).length;
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Room Assets</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 text-slate-300">Property Inventory Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Add Room Section */}
        <div className="lg:col-span-1">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  Initializer
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setAddMode("single")}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${addMode === "single" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Single
                  </button>
                  <button 
                    onClick={() => setAddMode("bulk")}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${addMode === "bulk" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Bulk
                  </button>
                </div>
              </div>

              {addMode === "single" ? (
                <form onSubmit={handleAddRoom} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Room Identity #</label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all placeholder:text-slate-300"
                      placeholder="e.g. 101, B-502"
                      value={newRoom.number}
                      onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Capacity (Beds)</label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
                    >
                       {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} Sharing</option>
                       ))}
                    </select>
                  </div>
                  {error && <p className="text-rose-500 text-[10px] font-bold px-1">{error}</p>}
                  {success && <p className="text-emerald-500 text-[10px] font-bold px-1">{success}</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 active:translate-y-0"
                  >
                    Deploy Single Asset
                  </button>
                </form>
              ) : (
                <form onSubmit={handleBulkAdd} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 px-1">Prefix (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                      placeholder="e.g. A-, 2F-"
                      value={bulkConfig.prefix}
                      onChange={(e) => setBulkConfig({...bulkConfig, prefix: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 px-1">Start Num</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        value={bulkConfig.startNumber}
                        onChange={(e) => setBulkConfig({...bulkConfig, startNumber: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 px-1">Count</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        value={bulkConfig.count}
                        onChange={(e) => setBulkConfig({...bulkConfig, count: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 px-1">Capacity (All)</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                      value={bulkConfig.capacity}
                      onChange={(e) => setBulkConfig({...bulkConfig, capacity: parseInt(e.target.value)})}
                    >
                       {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} Sharing</option>
                       ))}
                    </select>
                  </div>
                  {error && <p className="text-rose-500 text-[10px] font-bold px-1">{error}</p>}
                  {success && <p className="text-emerald-500 text-[10px] font-bold px-1">{success}</p>}
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-slate-100 hover:-translate-y-1 active:translate-y-0"
                  >
                    Deploy Batch assets
                  </button>
                </form>
              )}
           </div>
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
           {rooms.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-32 text-center text-slate-300 italic uppercase font-black text-xs">
                 Inventory Empty
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {rooms.map(room => {
                    const occupiedCount = getOccupancyCount(room.id);
                    const isFull = occupiedCount >= room.capacity;
                    
                    return (
                       <div key={room.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                          <div className={`absolute top-0 right-0 w-32 h-32 ${isFull ? 'bg-rose-500' : 'bg-emerald-500'} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`}></div>
                          
                          <div className="flex justify-between items-start mb-6">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Room Number</p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{room.number}</h3>
                             </div>
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                isFull ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             }`}>
                                {isFull ? 'Full' : 'Available'}
                             </span>
                          </div>

                          <div className="space-y-4">
                             <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                   <span className="text-slate-400">Live Occupancy</span>
                                   <span className={isFull ? 'text-rose-600' : 'text-slate-600'}>{occupiedCount} / {room.capacity} Beds</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full transition-all duration-500 ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${(occupiedCount / room.capacity) * 100}%` }}
                                   ></div>
                                </div>
                             </div>

                             <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Revenue Yield: {Math.round((occupiedCount / room.capacity) * 100)}%</p>
                                <button 
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${occupiedCount > 0 ? 'bg-slate-50 text-slate-200 cursor-not-allowed' : 'bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white'}`}
                                  title={occupiedCount > 0 ? 'Cannot delete occupied room' : 'Decommission asset'}
                                >
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                   </svg>
                                </button>
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
