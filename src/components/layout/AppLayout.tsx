import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchCommand } from '../common/SearchCommand';
import { BRANDING_CONFIG } from '../../config/branding.config';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
          {BRANDING_CONFIG.footerText}
        </footer>
      </div>

      {/* Cmd + K Search Dialog */}
      <SearchCommand />
    </div>
  );
};
