import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import { Spinner, ErrorMsg } from '../components/StatusWidgets';
import { Store, Clock, Users, ShoppingBag } from 'lucide-react';

const STAT_CONFIG = [
  { key: 'totalShops', label: 'Total Shops', icon: Store, color: 'stat-blue' },
  { key: 'pendingShops', label: 'Pending Approvals', icon: Clock, color: 'stat-yellow' },
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'stat-green' },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, color: 'stat-purple' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="stats-grid">
        {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={`stat-card ${color}`}>
            <div className="stat-icon">
              <Icon size={28} />
            </div>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <h3 className="stat-value">{stats?.[key] ?? '—'}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
