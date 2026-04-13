import { useEffect, useState } from 'react';
import { getPendingShops, approveShop, rejectShop } from '../services/api';
import { Spinner, ErrorMsg, EmptyState } from '../components/StatusWidgets';
import Modal from '../components/Modal';

export default function PendingApprovalsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [modalType, setModalType] = useState(''); // 'approve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = () => {
    setLoading(true);
    getPendingShops()
      .then(({ data }) => setShops(Array.isArray(data) ? data : data.shops || []))
      .catch(() => setError('Failed to load pending shops.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  const openModal = (shop, type) => { setSelectedShop(shop); setModalType(type); };
  const closeModal = () => { setSelectedShop(null); setModalType(''); };

  const handleConfirm = async () => {
    if (!selectedShop) return;
    setActionLoading(true);
    try {
      if (modalType === 'approve') await approveShop(selectedShop.id);
      if (modalType === 'reject') await rejectShop(selectedShop.id);
      fetchPending();
      closeModal();
    } catch {
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Pending Approvals</h2>
        <span className="badge badge-yellow">{shops.length} pending</span>
      </div>

      {shops.length === 0 ? (
        <EmptyState message="No pending shops. All caught up! ✅" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.name}</td>
                  <td>{shop.ownerName || shop.owner || '—'}</td>
                  <td>{shop.location || `${shop.lat ?? '?'}, ${shop.lng ?? '?'}`}</td>
                  <td>
                    {shop.createdAt
                      ? new Date(shop.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => openModal(shop, 'approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => openModal(shop, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedShop && (
        <Modal
          title={modalType === 'approve' ? 'Approve Shop' : 'Reject Shop'}
          onClose={closeModal}
        >
          <p>
            {modalType === 'approve'
              ? `Approve "${selectedShop.name}" and make it live?`
              : `Reject and permanently delete "${selectedShop.name}"?`}
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
