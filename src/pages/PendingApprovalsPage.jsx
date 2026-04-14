import { useEffect, useState } from 'react';
import { getPendingShops, approveShop, rejectShop } from '../services/api';
import { Spinner, ErrorMsg, EmptyState } from '../components/StatusWidgets';
import Modal from '../components/Modal';

const fmt = (val, fallback = '—') => (val !== undefined && val !== null && val !== '') ? val : fallback;
const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—';

export default function PendingApprovalsPage() {
  const [shops, setShops]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [modalType, setModalType]       = useState(''); // 'approve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = () => {
    setLoading(true);
    getPendingShops()
      .then(({ data }) => setShops(Array.isArray(data) ? data : data.shops || []))
      .catch(() => setError('Failed to load pending shops.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  const openModal  = (shop, type) => { setSelectedShop(shop); setModalType(type); };
  const closeModal = () => { setSelectedShop(null); setModalType(''); };

  const handleConfirm = async () => {
    if (!selectedShop) return;
    setActionLoading(true);
    try {
      if (modalType === 'approve') await approveShop(selectedShop.id);
      if (modalType === 'reject')  await rejectShop(selectedShop.id);
      fetchPending();
      closeModal();
    } catch {
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrorMsg message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Pending Approvals</h2>
        <span className="badge badge-yellow">{shops.length} pending</span>
      </div>

      {shops.length === 0 ? (
        <EmptyState message="No pending shops. All caught up! ✅" />
      ) : (
        <div className="approval-cards">
          {shops.map((shop) => (
            <div key={shop.id} className="approval-card">
              {/* Header */}
              <div className="approval-card-header">
                <div>
                  <h3 className="approval-card-title">{fmt(shop.name)}</h3>
                  <span className="approval-card-sub">Submitted {fmtDate(shop.created_at)}</span>
                </div>
                <span className="badge badge-yellow">Pending</span>
              </div>

              {/* Details grid */}
              <div className="approval-detail-grid">
                <div className="approval-detail-item">
                  <span className="approval-detail-label">📍 Address</span>
                  <span className="approval-detail-value">{fmt(shop.address)}</span>
                </div>
                <div className="approval-detail-item">
                  <span className="approval-detail-label">🌐 Coordinates</span>
                  <span className="approval-detail-value">
                    {shop.latitude != null ? `${shop.latitude}, ${shop.longitude}` : '—'}
                  </span>
                </div>
                <div className="approval-detail-item">
                  <span className="approval-detail-label">🪑 Seating Capacity</span>
                  <span className="approval-detail-value">{fmt(shop.seating_capacity)}</span>
                </div>
                <div className="approval-detail-item">
                  <span className="approval-detail-label">💰 Avg Price</span>
                  <span className="approval-detail-value">{shop.avg_price != null ? `₹${shop.avg_price}` : '—'}</span>
                </div>
                <div className="approval-detail-item">
                  <span className="approval-detail-label">👤 Owner</span>
                  <span className="approval-detail-value">{fmt(shop.owner_name)}</span>
                </div>
                <div className="approval-detail-item">
                  <span className="approval-detail-label">🔖 Owner ID</span>
                  <span className="approval-detail-value approval-detail-mono">{fmt(shop.owner_id)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="approval-card-actions">
                <button
                  className="btn btn-success"
                  onClick={() => openModal(shop, 'approve')}
                >
                  ✅ Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => openModal(shop, 'reject')}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedShop && (
        <Modal
          title={modalType === 'approve' ? 'Approve Shop' : 'Reject Shop'}
          onClose={closeModal}
        >
          <p>
            {modalType === 'approve'
              ? `Approve "${selectedShop.name}" and make it live for customers?`
              : `Reject "${selectedShop.name}"? The request will be marked as rejected.`}
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              className={`btn ${modalType === 'approve' ? 'btn-success' : 'btn-danger'}`}
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing…' : modalType === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
