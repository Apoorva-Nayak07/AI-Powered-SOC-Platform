import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';

const IncidentResponse = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-6">Incident Response</h1>
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400">Incident management and response workflows</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default IncidentResponse;
