import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [threats, setThreats] = useState([]);
  const { token, isAuthenticated } = useAuth();

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      // Security Events
      newSocket.on('security:event', (event) => {
        setEvents((prev) => [event, ...prev].slice(0, 100));
      });

      // Alerts
      newSocket.on('alert:new', (alert) => {
        setAlerts((prev) => [alert, ...prev]);
        
        // Show toast notification for critical alerts
        if (alert.severity === 'critical') {
          toast.error(`Critical Alert: ${alert.title}`, {
            duration: 6000,
            icon: '🚨',
          });
        } else if (alert.severity === 'high') {
          toast.error(`High Alert: ${alert.title}`, {
            duration: 5000,
            icon: '⚠️',
          });
        }
      });

      newSocket.on('alert:updated', (alert) => {
        setAlerts((prev) =>
          prev.map((a) => (a._id === alert._id ? alert : a))
        );
      });

      // Threats
      newSocket.on('threat:detected', (threat) => {
        setThreats((prev) => [threat, ...prev]);
        
        toast.error(`Threat Detected: ${threat.type}`, {
          duration: 5000,
          icon: '🛡️',
        });
      });

      newSocket.on('threat:updated', (threat) => {
        setThreats((prev) =>
          prev.map((t) => (t._id === threat._id ? threat : t))
        );
      });

      // Incidents
      newSocket.on('incident:created', (incident) => {
        toast(`New Incident: ${incident.title}`, {
          icon: '📋',
        });
      });

      newSocket.on('incident:updated', (incident) => {
        toast(`Incident Updated: ${incident.title}`, {
          icon: '📝',
        });
      });

      // System notifications
      newSocket.on('system:notification', (notification) => {
        toast(notification.message, {
          icon: notification.icon || 'ℹ️',
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, token, SOCKET_URL]);

  const emit = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const clearThreats = () => {
    setThreats([]);
  };

  const value = {
    socket,
    connected,
    events,
    alerts,
    threats,
    emit,
    clearEvents,
    clearAlerts,
    clearThreats,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
