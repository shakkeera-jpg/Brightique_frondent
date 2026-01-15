import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNotifications } from "../Context/NotificationContext";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unread, markAllRead } = useNotifications();

  const toggle = () => {
  if (!open && unread > 0) {
    markAllRead(); 
  }
  setOpen(!open);
};

  return (
    <div className="relative">
      
      <button 
        onClick={toggle} 
        className="relative p-2 rounded-full hover:bg-gray-50 transition-colors group"
      >
        <BellIcon className="h-5 w-5 text-gray-500 group-hover:text-[#AF8F42] transition-colors" />

        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#AF8F42] rounded-full border-2 border-white ring-1 ring-[#AF8F42]/20">
           
          </span>
        )}
      </button>

      
      {open && (
        <>
          
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          
          <div className="absolute right-0 mt-4 w-80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-serif text-gray-900 tracking-tight">Activity</h3>
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Latest Updates</p>
              </div>
              {unread > 0 && (
                <span className="text-[9px] font-bold text-[#AF8F42] uppercase tracking-widest bg-[#AF8F42]/5 px-2 py-1 rounded">
                  {unread} New
                </span>
              )}
            </div>

            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Registry is clear
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-5 hover:bg-gray-50/80 transition-all cursor-default group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-[11px] text-gray-800 uppercase tracking-wider group-hover:text-[#AF8F42] transition-colors">
                          {n.title}
                        </p>
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-200"></span>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed font-light">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

           
            <button className="w-full py-3 bg-gray-50/50 text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] hover:text-[#AF8F42] transition-colors border-t border-gray-50">
              Clear All Records
            </button>
          </div>
        </>
      )}
    </div>
  );
}