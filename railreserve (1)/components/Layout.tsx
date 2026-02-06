
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'search' | 'bookings';
  setActiveTab: (tab: 'search' | 'bookings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">RailReserve Amaravati</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'search' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                Find Trains
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'bookings' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                My Bookings
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 RailReserve Amaravati. All rights reserved. Regional Hub: Amaravati (AMI).
        </div>
      </footer>
    </div>
  );
};

export default Layout;
