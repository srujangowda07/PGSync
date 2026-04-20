import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getData, saveData, addLog } from "../utils/storage";

const Residents = () => {
  const [data, setData] = useState({ residents: [], rooms: [] });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roomId: "",
    wifi: false,
    mess: false,
    deposit: "10000"
  });

  useEffect(() => {
    setData(getData());
  }, []);

  const handleAddResident = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomId) return;

    const freshData = getData();
    const room = freshData.rooms.find(r => r.id === formData.roomId);
    
    if (room.occupied >= room.capacity) {
      alert("Selected room is full!");
      return;
    }

    const newResident = {
      id: uuidv4(),
      name: formData.name,
      phone: formData.phone,
      roomId: formData.roomId,
      bedId: `B${room.occupied + 1}`,
      rent: 5000,
      deposit: parseInt(formData.deposit),
      joinDate: new Date().toISOString().split('T')[0],
      paid: false,
      addons: { wifi: formData.wifi, mess: formData.mess }
    };

    const updatedRooms = freshData.rooms.map(r => 
      r.id === formData.roomId ? { ...r, occupied: r.occupied + 1 } : r
    );

    const updatedData = {
      ...freshData,
      residents: [...freshData.residents, newResident],
      rooms: updatedRooms
    };

    saveData(updatedData);
    setData(updatedData);
    addLog(`New resident added: ${formData.name} (Room ${room.number})`);
    
    setFormData({
      name: "",
      phone: "",
      roomId: "",
      wifi: false,
      mess: false,
      deposit: "10000"
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resident Records</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Manage tenant profiles and room allocations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
             <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
             Direct Enrollment
          </h2>
          <form onSubmit={handleAddResident} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="Enter name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="+91-0000000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Assign Room</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                required
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              >
                <option value="">Select a Room</option>
                {data.rooms.map(r => (
                  <option key={r.id} value={r.id} disabled={r.occupied >= r.capacity}>
                    Room {r.number} ({r.block}) - {r.capacity - r.occupied} Vacant
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" checked={formData.wifi} onChange={(e) => setFormData({...formData, wifi: e.target.checked})} />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Wifi</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" checked={formData.mess} onChange={(e) => setFormData({...formData, mess: e.target.checked})} />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Mess</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all mt-4 shadow-lg shadow-slate-200"
            >
              Enroll Resident
            </button>
          </form>
        </div>

        {/* Resident Table */}
        <div className="lg:col-span-2 space-y-4">
           {data.residents.length > 0 ? (
             data.residents.map((res) => {
               const room = data.rooms.find(r => r.id === res.roomId);
               return (
                  <div key={res.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-3xl text-2xl font-black text-blue-600">
                        {res.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">{res.name}</h3>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone: {res.phone || 'N/A'}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 font-bold">Joined: {res.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                       <div className="text-center px-6 border-r border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Room</p>
                          <p className="text-lg font-black text-slate-700 leading-none">{room ? room.number : '-'}</p>
                       </div>
                       <div className="flex gap-2">
                          {res.addons.wifi && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Wifi</span>}
                          {res.addons.mess && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Mess</span>}
                       </div>
                    </div>
                  </div>
               )
             })
           ) : (
             <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-3xl text-center">
               <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No Residents Registered</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Residents;
