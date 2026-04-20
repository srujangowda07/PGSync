import { useState, useEffect } from "react";
import { getData, saveData, addLog } from "../utils/storage";

const Deposit = () => {
  const [data, setData] = useState({ residents: [] });
  const [deductionAmount, setDeductionAmount] = useState({});

  useEffect(() => {
    setData(getData());
  }, []);

  const handleCheckout = (id) => {
    const amount = deductionAmount[id] || 0;
    const currentData = getData();
    const resident = currentData.residents.find(r => r.id === id);
    const updatedResidents = currentData.residents.filter(r => r.id !== id);
    
    // Update room occupancy
    const updatedRooms = currentData.rooms.map(r => 
      r.id === resident.roomId ? { ...r, occupied: r.occupied - 1 } : r
    );

    const updatedData = { 
      ...currentData, 
      residents: updatedResidents,
      rooms: updatedRooms
    };
    
    saveData(updatedData);
    setData(updatedData);
    addLog(`Check-out completed for ${resident.name}. Settlement: ₹${resident.deposit - amount} (Deduction: ₹${amount})`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Settlements</h1>
        <p className="text-slate-500 font-medium leading-relaxed">Deposit management and tenant checkout lifecycle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.residents.length > 0 ? (
          data.residents.map((res) => (
            <div key={res.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                      {res.name.charAt(0)}
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</p>
                      <p className="text-xs font-bold text-slate-700">{res.joinDate}</p>
                   </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{res.name}</h3>
                <p className="text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest">ID: {res.id.slice(0, 8)}</p>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security Deposit</p>
                   <p className="text-3xl font-black text-slate-900 leading-none">₹{res.deposit.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₹</span>
                    <input 
                      type="number"
                      placeholder="Deductions"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                      value={deductionAmount[res.id] || ''}
                      onChange={(e) => setDeductionAmount({...deductionAmount, [res.id]: e.target.value})}
                    />
                 </div>
                 <button 
                  onClick={() => handleCheckout(res.id)}
                  className="w-full bg-slate-800 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors shadow-md"
                 >
                   Initiate Settlement
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-lg">No Financial Records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
