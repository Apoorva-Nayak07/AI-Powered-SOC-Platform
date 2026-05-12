import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSocket } from '../contexts/SocketContext';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const { connected } = useSocket();

  return (
    <div className="min-h-screen bg-cyber-darker cyber-grid">
      <Sidebar />
      
      <main className="lg:ml-[280px] min-h-screen">
        {/* Connection Status */}
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg glass ${
              connected ? 'text-cyber-green' : 'text-red-500'
            }`}
          >
            {connected ? <FiWifi size={16} /> : <FiWifiOff size={16} />}
            <span className="text-xs font-medium">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
