import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/ui/uiSlice';
import { NAVIGATION_CONFIG } from '../../config/navigation.config';
import { BRANDING_CONFIG } from '../../config/branding.config';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import { RoleCode } from '../../types/permission.types';
import { storageService } from '../../services/storage/storage.service';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  RotateCw,
  CreditCard,
  AlertCircle,
  Building2,
  Banknote,
  Building,
  BarChart3,
  UserCheck,
  Lock,
  FileText,
  Settings,
  Shield,
  ChevronLeft,
  X,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  RotateCw: <RotateCw className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Banknote: <Banknote className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { can } = usePermissions();
  const { user, changeDemoRole } = useAuth();
  const settings = storageService.getSettings();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeDemoRole(e.target.value as RoleCode);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-sidebar-border)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Branding Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-sidebar-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--color-sidebar-text-active)] tracking-tight">
                {settings.agencyName || BRANDING_CONFIG.appName}
              </h2>
              <p className="text-[10px] text-[var(--color-sidebar-text)] uppercase tracking-wider font-semibold">
                SaaS Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden text-[var(--color-sidebar-text)] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Role Switcher Bar */}
        <div className="p-3 bg-slate-900/60 border-b border-[var(--color-sidebar-border)] shrink-0">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-sidebar-text)] mb-1">
            Simulate Role Permission:
          </label>
          <select
            value={user?.role || 'SUPER_ADMIN'}
            onChange={handleRoleChange}
            className="w-full text-xs bg-[var(--color-sidebar-item-hover)] text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
          >
            <option value="SUPER_ADMIN">👑 SUPER ADMIN (All Perms)</option>
            <option value="ADMIN">🛡️ ADMIN</option>
            <option value="MANAGER">👔 MANAGER</option>
            <option value="ACCOUNTANT">💳 ACCOUNTANT</option>
            <option value="AGENT">💼 AGENT</option>
            <option value="VIEWER">👁️ VIEWER (Read Only)</option>
          </select>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAVIGATION_CONFIG.map((group) => {
            // Filter permitted items
            const permittedItems = group.items.filter((item) => can(item.permission));
            if (permittedItems.length === 0) return null;

            return (
              <div key={group.id} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.groupLabel}
                </h3>
                <nav className="space-y-0.5 mt-1.5">
                  {permittedItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.route}
                      onClick={() => {
                        if (window.innerWidth < 1024) dispatch(toggleSidebar());
                      }}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group',
                          isActive
                            ? 'bg-[var(--color-sidebar-item-active)] text-[var(--color-sidebar-text-active)] shadow-sm shadow-blue-500/30'
                            : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-white'
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0">{ICON_MAP[item.iconName]}</span>
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[var(--color-sidebar-border)] bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-blue-400 font-semibold truncate">{user?.roleName || user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
