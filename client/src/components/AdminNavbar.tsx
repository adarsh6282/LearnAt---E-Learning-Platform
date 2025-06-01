import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  DollarSign, 
  BookOpen, 
  FolderOpen,
  ChevronDown,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';

const AdminNavbar = () => {
  const location=useLocation()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Tutors', icon: GraduationCap },
    { name: 'Earnings', icon: DollarSign },
    { name: 'Courses', icon: BookOpen },
    { name: 'Category', icon: FolderOpen },
  ];

  const getRoutePath = (itemName: string) => {
    return `/admin/${itemName.toLowerCase()}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/30">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-6 border-b border-purple-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive=location.pathname===getRoutePath(item.name)
                return (
                  <Link
                    key={item.name}
                    to={getRoutePath(item.name)}
                    className={`${
                        isActive
                        ? 'bg-purple-700 bg-opacity-70 text-white shadow-lg border-r-4 border-pink-400'
                        : 'text-purple-100 hover:bg-purple-700 hover:bg-opacity-50 hover:text-white'
                    } w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group`}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-purple-700/30 p-4">
            <Link
              to="/admin/notifications"
              className="w-full flex items-center space-x-3 px-4 py-3 text-purple-100 hover:text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-lg transition-all duration-200 mb-2 relative"
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              <span className="absolute right-3 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>

            <Link
              to="/admin/settings"
              className="w-full flex items-center space-x-3 px-4 py-3 text-purple-100 hover:text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-lg transition-all duration-200 mb-2"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>

            <Link
              to="/admin/profile"
              className="bg-purple-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg p-3 mb-3 block transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">John Doe</p>
                  <p className="text-purple-200 text-xs">Administrator</p>
                </div>
              </div>
            </Link>

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900 hover:bg-opacity-50 rounded-lg transition-all duration-200">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavbar;