
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
      `ws://13.49.68.75/ws/notifications/?token=${token}`
    );

    socketRef.current = ws;

    ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  
  if (!data.id) return;

  addNotification(data);
};

    ws.onerror = () => ws.close();

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [token]);
}
