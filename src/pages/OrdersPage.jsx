import { useEffect, useState } from 'react';
import { getOrders, getShops } from '../services/api';
import { Spinner, ErrorMsg, EmptyState } from '../components/StatusWidgets';

const STATUS_OPTIONS = ['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');

  useEffect(() => {
    Promise.all([getOrders(), getShops()])
      .then(([ordRes, shopRes]) => {
        setOrders(Array.isArray(ordRes.data) ? ordRes.data : ordRes.data.orders || []);
        setShops(Array.isArray(shopRes.data) ? shopRes.data : shopRes.data.shops || []);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const statusMatch = statusFilter === 'all' || o.status === statusFilter;
    const shopMatch =
      shopFilter === 'all' ||
      o.shop === shopFilter ||
      o.shop?.id === shopFilter;
    return statusMatch && shopMatch;
  });

  const statusBadgeColor = (status) => {
    const map = {
      pending: 'badge-yellow',
      preparing: 'badge-blue',
      ready: 'badge-green',
      completed: 'badge-gray',
      cancelled: 'badge-red',
    };
    return map[status] || 'badge-gray';
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
        <div className="filter-row">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
          >
            <option value="all">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No orders match the selected filters." />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Shop</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="mono">{order.id?.slice(-8) || '—'}</td>
                  <td>{order.shop?.name || order.shopName || '—'}</td>
                  <td>
                    {(order.items || [])
                      .map((it) => `${it.name} ×${it.quantity}`)
                      .join(', ') || '—'}
                  </td>
                  <td>₹{order.total ?? order.totalAmount ?? '—'}</td>
                  <td>
                    <span className={`badge ${statusBadgeColor(order.status)}`}>
                      {order.status || '—'}
                    </span>
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
