import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  ClipboardCheck,
  Users,
  ShoppingBag,
  Map,
  LogOut,
  ChefHat,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/shops', label: 'Shops', icon: Store },
  { to: '/pending', label: 'Pending Approvals', icon: ClipboardCheck },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/map', label: 'Map', icon: Map },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div className="layout-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ChefHat size={24} className="brand-icon" />
          <span>AdminPanel</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">
            {/* page title comes from each page */}
          </div>
          <div className="topbar-right">
            <span className="admin-name">
              👤 {user.name || user.email || 'Admin'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
