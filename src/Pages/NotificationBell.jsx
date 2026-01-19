import { useState } from "react"; 
import { BellIcon } from "@heroicons/react/24/outline";
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
        className="relative p-2 rounded-full hover:bg-gray-50 transition-all group"
      >
        {/* Animated Bell Icon */}
        <BellIcon className={`h-6 w-6 transition-colors ${unread > 0 ? 'text-[#AF8F42]' : 'text-gray-500 group-hover:text-[#AF8F42]'}`} />

        {/* Numeric Badge */}
        {unread > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#AF8F42] text-[9px] font-black text-white ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          
          <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Real-time updates</p>
              </div>
              <span className="text-[10px] font-bold text-[#AF8F42] bg-white border border-[#AF8F42]/20 px-2 py-0.5 rounded-full shadow-sm">
                {notifications.length} Total
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-xs text-gray-400 italic">No new activity</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 transition-colors ${!n.is_read ? 'bg-[#AF8F42]/5' : 'hover:bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-[11px] text-gray-800 uppercase">{n.title}</p>
                        {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-[#AF8F42]"></span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}