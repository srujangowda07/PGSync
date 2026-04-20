import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getData, saveData, addLog } from "../utils/storage";

const Complaints = () => {
  const [data, setData] = useState({ complaints: [] });
  const [formData, setFormData] = useState({
    text: "",
    priority: "medium",
    assignedTo: "General Staff"
  });

  useEffect(() => {
    setData(getData());
  }, []);

  const handleAddComplaint = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    const currentData = getData();
    const newComplaint = {
      id: uuidv4(),
      text: formData.text,
      status: "open",
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...currentData,
      complaints: [newComplaint, ...currentData.complaints],
    };

    saveData(updatedData);
    setData(updatedData);
    addLog(`New complaint logged: ${formData.text} (${formData.priority} priority)`);
    setFormData({ text: "", priority: "medium", assignedTo: "General Staff" });
  };

  const updateStatus = (id, newStatus) => {
    const currentData = getData();
    const complaint = currentData.complaints.find(c => c.id === id);
    const updatedComplaints = currentData.complaints.map((c) => 
      c.id === id ? { ...c, status: newStatus } : c
    );
    const updatedData = { ...currentData, complaints: updatedComplaints };
    saveData(updatedData);
    setData(updatedData);
    addLog(`Complaint status updated to ${newStatus.toUpperCase()} for: ${complaint.text}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Maintenance Pipeline</h1>
          <p className="text-slate-500 font-medium">Field issues and track resolution tickets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Input Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Log Feedback</h2>
             <form onSubmit={handleAddComplaint} className="space-y-4">
                <div>
                   <textarea
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-sm h-32 resize-none"
                     placeholder="Issue description..."
                     value={formData.text}
                     onChange={(e) => setFormData({...formData, text: e.target.value})}
                     required
                   />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Priority</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-md shadow-rose-100"
                >
                  Create Ticket
                </button>
             </form>
           </div>
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-3 space-y-4">
           {data.complaints.length > 0 ? (
             data.complaints.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:border-slate-300 transition-all">
                   <div className="flex-1 flex gap-4">
                      <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                        c.priority === 'high' ? 'bg-rose-500' : c.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="space-y-2">
                        <p className={`font-black text-slate-800 ${c.status === 'resolved' ? 'line-through opacity-50' : ''}`}>
                          {c.text}
                        </p>
                        <div className="flex flex-wrap gap-4 items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned: {c.assignedTo}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             {new Date(c.createdAt).toLocaleDateString()}
                           </span>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                              c.status === 'open' ? 'bg-rose-50 text-rose-600' : 
                              c.status === 'in-progress' ? 'bg-amber-50 text-amber-600' : 
                              'bg-emerald-50 text-emerald-600'
                           }`}>
                             {c.status.replace('-', ' ')}
                           </span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2">
                      <select 
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                   </div>
                </div>
             ))
           ) : (
             <div className="p-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-300 uppercase tracking-widest font-black">
               Empty Pipeline
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Complaints;
