import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiActivity,
  FiShield,
  FiBell,
  FiAlertTriangle,
  FiTarget,
  FiMap,
  FiFileText,
  FiCpu,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/executive', icon: FiBarChart2, label: 'Executive', roles: ['admin'] },
    { path: '/monitoring', icon: FiActivity, label: 'Live Monitoring', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/threats', icon: FiShield, label: 'Threat Detection', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/alerts', icon: FiBell, label: 'Alerts Center', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/incidents', icon: FiAlertTriangle, label: 'Incidents', roles: ['admin', 'analyst'] },
    { path: '/intelligence', icon: FiTarget, label: 'Threat Intel', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/attack-map', icon: FiMap, label: 'Attack Map', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/logs', icon: FiFileText, label: 'Logs Explorer', roles: ['admin', 'analyst'] },
    { path: '/ai-insights', icon: FiCpu, label: 'AI Insights', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/users', icon: FiUsers, label: 'Users', roles: ['admin'] },
    { path: '/reports', icon: FiBarChart2, label: 'Reports', roles: ['admin', 'analyst'] },
    { path: '/settings', icon: FiSettings, label: 'Settings', roles: ['admin', 'analyst', 'viewer'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass hover-glow"
      >
        {collapsed ? <FiMenu size={24} /> : <FiX size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
        }}
        className={`fixed left-0 top-0 h-screen glass-dark border-r border-cyber-blue/20 z-40 transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-280'
        } ${collapsed ? 'hidden lg:block' : 'block'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-cyber-blue/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
                <FiShield className="text-white" size={24} />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold neon-text">SOC Platform</h1>
                  <p className="text-xs text-gray-400">Security Operations</p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-cyber-blue/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-cyber-blue/20 text-cyber-blue shadow-neon-blue'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-cyber-blue/20">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
            >
              <FiLogOut size={20} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
