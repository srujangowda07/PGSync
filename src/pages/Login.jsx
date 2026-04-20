import { useState } from "react";
import { login } from "../utils/storage";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;
    const user = login(formData.email, formData.password);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200">
             <span className="text-white font-black text-3xl">PG</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sync Pro</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Enterprise PG Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Organizational Email</label>
            <input
              type="email"
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all placeholder:text-slate-300"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Access Key</label>
            <input
              type="password"
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all placeholder:text-slate-300"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 active:translate-y-0 mt-4"
          >
            Authorize Access
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">v3.5 Build Pipeline: STABLE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
