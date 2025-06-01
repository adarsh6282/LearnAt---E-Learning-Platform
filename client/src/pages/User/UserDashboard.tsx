import React, { useState } from 'react';
import {
  LayoutGrid,
  BarChart3,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample card data
  const cardData = [
    { title: 'Total Users', value: '24,532', change: '+12%', isPositive: true },
    { title: 'Sessions', value: '145,832', change: '+8%', isPositive: true },
    { title: 'Bounce Rate', value: '32.4%', change: '-4%', isPositive: true },
    { title: 'Average Time', value: '4m 23s', change: '-1%', isPositive: false },
  ];

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 pt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center w-full px-4 py-3 ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="ml-4">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex items-center">
            <button className="p-2 relative rounded-full text-gray-500 hover:bg-gray-100 mr-4">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, John</h2>
            <p className="text-gray-500">Here's what's happening with your projects today.</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardData.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 font-medium mb-2">{card.title}</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-800 mr-2">{card.value}</p>
                  <span className={`text-sm ${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main chart section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
            <div className="h-64 w-full bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-400">Chart goes here</p>
            </div>
          </div>

          {/* Two column layout for bottom sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">New user registered</p>
                      <p className="text-gray-400 text-sm">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded mr-3 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Update documentation for new features</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;