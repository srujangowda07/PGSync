import { useState, useEffect } from "react";
import { getData } from "../utils/storage";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const data = getData();
    setLogs(data.activityLogs || []);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Audit Trail</h1>
        <p className="text-slate-500 font-medium leading-relaxed">Immutable system activity logs for operational transparency</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden font-mono">
        <div className="divide-y divide-slate-100">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-700">{log.action}</span>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-slate-400 italic">No activity logs recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
