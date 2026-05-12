import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { threatsAPI } from '../services/api';
import { FiShield, FiAlertCircle } from 'react-icons/fi';

const ThreatDetection = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreats();
  }, []);

  const loadThreats = async () => {
    try {
      const response = await threatsAPI.getAll({ limit: 50 });
      setThreats(response.data.threats || []);
    } catch (error) {
      console.error('Failed to load threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
      info: 'bg-blue-500',
    };
    return colors[severity] || 'bg-gray-500';
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Threat Detection</h1>
          <p className="text-gray-400">AI-powered threat detection and analysis</p>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Detected Threats</h3>
            <button className="px-4 py-2 bg-cyber-blue rounded-lg hover:bg-cyber-blue/80 transition-colors">
              Scan Now
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : threats.length > 0 ? (
            <div className="space-y-3">
              {threats.map((threat) => (
                <div key={threat._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity)}`} />
                  <FiShield className="text-cyber-blue" size={24} />
                  <div className="flex-1">
                    <h4 className="font-semibold">{threat.type.replace('_', ' ').toUpperCase()}</h4>
                    <p className="text-sm text-gray-400">{threat.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Source: {threat.sourceIP}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold capitalize">{threat.severity}</p>
                    <p className="text-xs text-gray-400">{threat.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiAlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No threats detected</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ThreatDetection;
