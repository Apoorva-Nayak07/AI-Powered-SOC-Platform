import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { alertsAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';

const AlertsCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const { alerts: socketAlerts } = useSocket();

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (socketAlerts.length > 0) {
      setAlerts((prev) => [...socketAlerts, ...prev]);
    }
  }, [socketAlerts]);

  const loadAlerts = async () => {
    try {
      const response = await alertsAPI.getAll({ limit: 50 });
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h1 className="text-3xl font-bold">Alerts Center</h1>
        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-semibold">{alert.title || 'Security Alert'}</h4>
                  <p className="text-sm text-gray-400">{alert.description || 'Alert description'}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No active alerts</p>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AlertsCenter;
