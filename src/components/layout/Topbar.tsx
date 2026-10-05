import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, setSearchOpen } from '../../store/ui/uiSlice';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage/storage.service';
import { Menu, Search, Sun, Moon, Bell, LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, logoutUser } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[var(--color-topbar-bg)] border-b border-[var(--color-topbar-border)] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={() => dispatch(setSearchOpen(true))}
          className="flex items-center gap-3 px-3.5 py-1.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] rounded-xl hover:border-[var(--color-border-hover)] transition-all w-48 sm:w-64"
        >
          <Search className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="flex-1 text-left truncate">Search policies, customers...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Notifications"
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[var(--color-topbar-bg)]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-hover)]/40">
                <span className="text-xs font-bold text-[var(--color-text)]">Notifications</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[var(--color-border)]">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--color-muted)] text-center">No new notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.link) navigate(n.link);
                      }}
                      className="p-3 hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[var(--color-text)]">{n.title}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[var(--color-border)] mx-1" />

        {/* User Account / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-[var(--color-text)] leading-tight">{user?.name}</p>
            <p className="text-[10px] text-[var(--color-primary)] font-semibold">{user?.roleName || user?.role}</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            title="Logout Account"
            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
