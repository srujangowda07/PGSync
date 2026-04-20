const ComingSoon = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 rotate-12">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">{title}</h1>
      <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed mb-10">
        {description || "We're building something massive. This feature will be coming soon as part of our Enterprise Suite."}
      </p>
      <div className="bg-slate-900 px-8 py-3 rounded-full shadow-lg shadow-slate-200 inline-block">
        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Coming Soon</span>
      </div>
    </div>
  );
};

export default ComingSoon;
