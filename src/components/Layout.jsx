import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './SideBar';
import Navbar from './NavBar'; // Import the Navbar component

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`Ksh{isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar /> {/* Include the Navbar here */}

        {/* Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Main Section */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 Ksh{isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RetailPro. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

