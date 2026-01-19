
import { useEffect, useRef } from "react";
import { useNotifications } from "../Context/NotificationContext";

export default function useNotificationSocket(token) {
  const socketRef = useRef(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!token) {
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    const ws = new WebSocket(
      `wss://13.49.68.75.sslip.io/ws/notifications/?token=${token}`
    );

    socketRef.current = ws;

    ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    addNotification(data); 
  };

    ws.onerror = () => ws.close();

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [token,addNotification]);
}
