import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { LayoutDashboard, Inbox, Mountain, Dumbbell, FileText, Settings as SettingsIcon, ShoppingBag, LogOut, GraduationCap, Send } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-[#1C1917] text-[#FBFBF9] flex items-center justify-center">Loading…</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
    { to: '/admin/financial-aid', label: 'Financial Aid', icon: GraduationCap },
    { to: '/admin/retreats', label: 'Retreats', icon: Mountain },
    { to: '/admin/programs', label: 'Programs', icon: Dumbbell },
    { to: '/admin/content', label: 'Site Content', icon: FileText },
    { to: '/admin/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/admin/newsletter', label: 'Broadcast', icon: Send },
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1917] text-[#FBFBF9] min-h-screen flex flex-col" data-testid="admin-sidebar">
        <div className="px-6 py-8 border-b border-[#2d2a26]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6C0A6] mb-1">Admin Panel</p>
          <h1 className="font-['Playfair_Display'] text-xl">Sunpreet Singh</h1>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? 'bg-[#D6C0A6] text-[#1C1917] font-medium' : 'text-[#D6D3D1] hover:bg-[#2d2a26]'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-[#2d2a26]">
          <p className="text-xs text-[#A8A29E] mb-2 truncate">{user.email}</p>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="flex items-center gap-2 text-xs text-[#D6D3D1] hover:text-[#FBFBF9]"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" data-testid="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
