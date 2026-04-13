
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../api/api";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (reset = false) => {
    if (!user) return;
    if (loading) return;
    
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const res = await apiFetch(`/notifications?page=${currentPage}&limit=20`);
      
      if (reset) {
        setNotifications(res.notifications || []);
        setPage(2);
      } else {
        setNotifications(prev => [...prev, ...(res.notifications || [])]);
        setPage(prev => prev + 1);
      }
      
      setUnreadCount(res.unreadCount || 0);
      setHasMore(res.pagination ? res.pagination.page < res.pagination.pages : false);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const res = await apiFetch("/notifications/count");
      setUnreadCount(res.count || 0);
    } catch (error) {
      // Silently handle error
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiFetch(`/notifications/${notificationId}/read`, { method: "PUT" });
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Silently handle error
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      // Silently handle error
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiFetch(`/notifications/${notificationId}`, { method: "DELETE" });
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const clearAll = async () => {
    try {
      await apiFetch("/notifications/clear-all", { method: "DELETE" });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      // Silently handle error
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(true);
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    hasMore,
    fetchNotifications: () => fetchNotifications(true),
    loadMore: () => fetchNotifications(false),
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
