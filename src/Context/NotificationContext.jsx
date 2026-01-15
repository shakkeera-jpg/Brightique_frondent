import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./UserContext";
import api from "../api/axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const resetNotifications = () => {
    setNotifications([]);
    setUnread(0);
  };

 const addNotification = (notification) => {
  if (!notification || !notification.id) return;

  setNotifications(prev => {
    const exists = prev.some(n => n.id === notification.id);
    if (exists) return prev;

    return [notification, ...prev];
  });

  if (!notification.is_read) {
    setUnread(prev => prev + 1);
  }
};



  const markAllRead = async () => {
  try {
    await api.post("notifications/mark-read/");
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
    setUnread(0);
  } catch (e) {
    console.error("Failed to mark read");
  }
};
  
  useEffect(() => {
    if (!user) {
      resetNotifications();
      return;
    }

    api.get("/notifications/my/")
      .then(res => {
        setNotifications(res.data);
        setUnread(res.data.filter(n => !n.is_read).length);
      })
      .catch(() => resetNotifications());
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread,
        addNotification,
        markAllRead,
        resetNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
