import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getData, saveData, addLog } from "../utils/storage";

const ResidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResident();
  }, [id]);

  const loadResident = () => {
    const data = getData();
    const res = data.residents.find(r => r.id === id);
    if (res) {
      setResident(res);
      setRoom(data.rooms.find(rm => rm.id === res.roomId));
    }
    setLoading(false);
  };

  const handleTerminateLease = () => {
    if (!resident) return;
    
    const confirmMessage = `Are you sure you want to terminate the lease for ${resident.name}? This will permanently remove them from the active archive.`;
    
    if (window.confirm(confirmMessage)) {
      const data = getData();
      const updatedResidents = data.residents.filter(r => r.id !== id);
      
      saveData({
        ...data,
        residents: updatedResidents
      });
      
      addLog(`Lease Terminated: ${resident.name} has been formally unchecked from Room ${room?.number || 'N/A'}`);
      
      alert(`Lease for ${resident.name} terminated successfully.`);
      navigate("/residents");
    }
  };

  const handleExportInvoice = () => {
    alert("Invoice Engine: Generating PDF export for " + resident.name + "...");
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Loading Report...</div>;
  
  if (!resident) {
    return (
      <div className="p-20 text-center space-y-6 animate-in fade-in duration-500">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Archive Record Not Found</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">The requested resident identity could not be located in the primary database.</p>
        <Link to="/residents" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-black">Return to Archive</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Profile Card */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-xl">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Active Resident Profile
               </p>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none break-words">{resident.name}</h1>
               <div className="flex flex-wrap gap-4 mt-6">
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-[10px] font-bold">
                     JOINED: {new Date(resident.joinDate).toLocaleDateString()}
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-[10px] font-bold">
                     PHONE: {resident.phone}
                  </div>
               </div>
            </div>
            <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl text-center min-w-[200px] w-full md:w-auto">
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1 opacity-75">Room Assignment</p>
               <h2 className="text-4xl font-black tracking-tighter">#{room?.number || 'N/A'}</h2>
               <p className="text-[10px] font-black uppercase tracking-widest mt-2">{resident.bedNumber} sharing</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Financial Summary */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
               <h3 className="text-xl font-black text-slate-800 font-black uppercase tracking-widest text-xs opacity-50">Financial Ledger</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly Billing</p>
                     <p className="text-2xl font-black text-slate-800">₹{resident.rent?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Security Deposit</p>
                     <p className="text-2xl font-black text-slate-800">₹{resident.deposit?.toLocaleString()}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Enabled Services</p>
                  <div className="flex flex-wrap gap-3">
                     {resident.addons?.wifi && (
                        <div className="bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest">Premium WiFi</span>
                        </div>
                     )}
                     {resident.addons?.mess && (
                        <div className="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest">Mess Subscription</span>
                        </div>
                     )}
                     {!resident.addons?.wifi && !resident.addons?.mess && (
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic px-2">No additional services active</p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 text-center">
               <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white">
                  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Management Controls</p>
               <div className="space-y-3">
                  <button 
                    onClick={handleExportInvoice}
                    className="w-full bg-white hover:bg-slate-100 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200"
                  >
                     Export Invoice
                  </button>
                  <button 
                    onClick={handleTerminateLease}
                    className="w-full bg-white text-rose-600 hover:bg-rose-50 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-rose-100"
                  >
                     Terminate Lease
                  </button>
               </div>
            </div>

            <Link to="/residents" className="block text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
               ← Back to Archive
            </Link>
         </div>
      </div>
    </div>
  );
};

export default ResidentDetail;
