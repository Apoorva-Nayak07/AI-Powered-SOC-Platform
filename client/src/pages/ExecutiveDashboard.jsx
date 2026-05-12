import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';

const ExecutiveDashboard = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <p className="text-gray-400">High-level security overview for executives</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Security Posture</h3>
            <p className="text-gray-400">Overall security health metrics</p>
          </div>
          
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
            <p className="text-gray-400">Current risk levels and trends</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;
