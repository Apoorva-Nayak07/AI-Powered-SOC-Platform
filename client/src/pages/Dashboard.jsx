import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { analyticsAPI, threatsAPI, alertsAPI, incidentsAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import {
  FiShield,
  FiBell,
  FiAlertTriangle,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalThreats: 0,
    activeAlerts: 0,
    openIncidents: 0,
    blockedAttacks: 0,
  });
  const [threatTrends, setThreatTrends] = useState([]);
  const [threatsByType, setThreatsByType] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { events, alerts } = useSocket();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      setRecentAlerts(alerts.slice(0, 5));
    }
  }, [alerts]);

  const loadDashboardData = async () => {
    try {
      const [dashboardRes, trendsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getThreatTrends(7),
      ]);

      setStats(dashboardRes.data.stats);
      setThreatTrends(trendsRes.data.trends);
      setThreatsByType(dashboardRes.data.threatsByType);
      setRecentAlerts(dashboardRes.data.recentAlerts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#00d4ff', '#b537f2', '#ff2e97', '#00ff88', '#ffd700'];

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-xl p-6 hover-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value.toLocaleString()}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{Math.abs(trend)}% from last week</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-lg bg-${color}-500/10`}>
          <Icon className={`text-${color}-500`} size={32} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
          <p className="text-gray-400">Real-time security monitoring and threat analysis</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Threats"
            value={stats.totalThreats}
            icon={FiShield}
            trend={12}
            color="cyber-blue"
          />
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon={FiBell}
            trend={-5}
            color="cyber-purple"
          />
          <StatCard
            title="Open Incidents"
            value={stats.openIncidents}
            icon={FiAlertTriangle}
            trend={8}
            color="cyber-pink"
          />
          <StatCard
            title="Blocked Attacks"
            value={stats.blockedAttacks}
            icon={FiActivity}
            trend={-15}
            color="cyber-green"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Threat Trends (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatTrends}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorThreats)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Threats by Type */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Threats by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={threatsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'critical'
                          ? 'bg-red-500'
                          : alert.severity === 'high'
                          ? 'bg-orange-500'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-400">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No recent alerts</p>
              )}
            </div>
          </motion.div>

          {/* Live Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Live Events</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {events.length > 0 ? (
                events.slice(0, 10).map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 text-sm bg-white/5 rounded hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                    <span className="text-gray-400 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="flex-1">{event.message}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No live events</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
