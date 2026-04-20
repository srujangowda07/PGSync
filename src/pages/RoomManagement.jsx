import { useState, useEffect } from "react";
import { getData } from "../utils/storage";

const RoomManagement = () => {
  const [data, setData] = useState({ rooms: [], blocks: [] });
  const [selectedBlock, setSelectedBlock] = useState("A");

  useEffect(() => {
    setData(getData());
  }, []);

  const filteredRooms = data.rooms.filter((r) => r.block === selectedBlock);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Property Structure</h1>
          <p className="text-slate-500">Manage blocks, floors, and room occupancy</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {data.blocks?.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBlock(b)}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                selectedBlock === b ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Block {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((floor) => (
          <div key={floor} className="space-y-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Floor {floor}</h2>
            {filteredRooms
              .filter((r) => r.floor === floor)
              .map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-2xl font-black text-slate-700">#{room.number}</span>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Capacity: {room.capacity}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      room.occupied >= room.capacity 
                        ? "bg-rose-100 text-rose-600" 
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {room.occupied >= room.capacity ? "Full" : "Available"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Occupancy</span>
                      <span>{Math.round((room.occupied/room.capacity) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          room.occupied >= room.capacity ? "bg-rose-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${(room.occupied/room.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      {room.capacity - room.occupied} beds vacant
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;
