/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e27',
          darker: '#050816',
          blue: '#00d4ff',
          purple: '#b537f2',
          pink: '#ff2e97',
          green: '#00ff88',
          red: '#ff3864',
          yellow: '#ffd700',
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-threat': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-safe': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(181, 55, 242, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 46, 151, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 1)' },
        },
      },
    },
  },
  plugins: [],
}
