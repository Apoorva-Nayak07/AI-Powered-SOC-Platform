import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';

const UserManagement = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400">Manage users and access control</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default UserManagement;
