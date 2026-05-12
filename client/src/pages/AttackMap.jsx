import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';

const AttackMap = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-6">Attack Map</h1>
        <div className="glass-dark rounded-xl p-6 h-96">
          <p className="text-gray-400">Geographic visualization of cyber attacks</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AttackMap;
