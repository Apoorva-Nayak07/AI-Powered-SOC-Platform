import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';

const LiveMonitoring = () => {
  const { events, connected } = useSocket();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Live Monitoring</h1>
            <p className="text-gray-400">Real-time security event monitoring</p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${connected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {connected ? '● Live' : '● Disconnected'}
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Live Event Stream</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                  <span className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  <span className="flex-1">{event.message || 'Security event detected'}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No events yet. Waiting for live data...</p>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default LiveMonitoring;
