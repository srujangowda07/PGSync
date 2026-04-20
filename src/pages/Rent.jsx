import { useState, useEffect } from "react";
import { getData, saveData, addLog } from "../utils/storage";

const Rent = () => {
  const [data, setData] = useState({ residents: [], rooms: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setData(getData());
  }, []);

  const calculateTotal = (res) => {
    const base = 5000;
    const wifi = res.addons.wifi ? 500 : 0;
    const mess = res.addons.mess ? 3000 : 0;
    return base + wifi + mess;
  };

  const togglePaid = (id) => {
    const currentData = getData();
    const resident = currentData.residents.find(r => r.id === id);
    const updatedResidents = currentData.residents.map((res) => {
      if (res.id === id) {
        return { ...res, paid: !res.paid };
      }
      return res;
    });

    const updatedData = { ...currentData, residents: updatedResidents };
    saveData(updatedData);
    setData(updatedData);
    addLog(`Rent status toggled for ${resident.name}: ${!resident.paid ? 'PAID' : 'PENDING'}`);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-left-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Billing & Collections</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Automated rent calculation for the current cycle</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">Cycle: April 2026</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident / Room</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Add-ons</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Final Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.residents.length > 0 ? (
              data.residents.map((res) => {
                const room = data.rooms.find(r => r.id === res.roomId);
                const total = calculateTotal(res);
                return (
                  <tr key={res.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500">
                            {res.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-black text-slate-800 leading-none mb-1">{res.name}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Room {room?.number || 'N/A'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex justify-center gap-2">
                          {res.addons.wifi && <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-[10px] border border-blue-100" title="Wifi">W</span>}
                          {res.addons.mess && <span className="w-6 h-6 bg-amber-50 text-amber-600 rounded flex items-center justify-center text-[10px] border border-amber-100" title="Mess">M</span>}
                          {!res.addons.wifi && !res.addons.mess && <span className="text-slate-300 text-xs italic">none</span>}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-block px-3 py-1 rounded-lg bg-slate-800 text-white font-black text-sm">
                          ₹{total.toLocaleString()}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border ${
                         res.paid 
                           ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                           : "bg-rose-50 text-rose-600 border-rose-100"
                       }`}>
                         {res.paid ? "Collected" : "Pending"}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end items-center gap-3 w-full min-w-[280px]">
                         <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-50 h-10"
                          >
                            Collect Online
                         </button>
                         <button
                            onClick={() => togglePaid(res.id)}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all h-10 ${
                              res.paid
                                ? "bg-white text-slate-400 border border-slate-200 hover:text-slate-600 hover:bg-slate-50"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"
                            }`}
                          >
                            {res.paid ? "Revert" : "Verify Payment"}
                         </button>
                       </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-300 italic font-medium">
                  No residents currently in billing cycle.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Base Pricing</h4>
           <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-700">Monthly Rent</span>
              <span className="font-black text-slate-900">₹5,000</span>
           </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Service Add-ons</h4>
           <div className="space-y-2">
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 px-4">
                <span className="text-xs font-bold text-slate-600">Wifi High-Speed</span>
                <span className="font-black text-blue-600 text-xs">+₹500</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 px-4">
                <span className="text-xs font-bold text-slate-600">Premium Mess</span>
                <span className="font-black text-amber-600 text-xs">+₹3,000</span>
              </div>
           </div>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex flex-col justify-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Total Outstanding</p>
           <p className="text-4xl font-black">
             ₹{data.residents.filter(r => !r.paid).reduce((acc, res) => acc + calculateTotal(res), 0).toLocaleString()}
           </p>
        </div>
      </div>

      {/* Integration Hub Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full relative z-10 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                 <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">Integration Hub</h2>
                 <p className="text-slate-500 font-bold mt-2">Connect your payment gateway for automated settlement.</p>
              </div>

              <div className="space-y-4">
                 {['Stripe Connect', 'Razorpay Standard', 'PayPal Business'].map(gatway => (
                    <div key={gatway} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
                       <span className="font-black text-slate-700 tracking-tight">{gatway}</span>
                       <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Coming Soon</span>
                    </div>
                 ))}
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Return to Collections
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Rent;
