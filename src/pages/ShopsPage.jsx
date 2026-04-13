import { useEffect, useState } from 'react';
import { getShops, deactivateShop, deleteShop } from '../services/api';
import { Spinner, ErrorMsg, EmptyState } from '../components/StatusWidgets';
import Modal from '../components/Modal';

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShop, setModalShop] = useState(null);
  const [modalType, setModalType] = useState(''); // 'deactivate' | 'delete'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchShops = () => {
    setLoading(true);
    getShops()
      .then(({ data }) => setShops(Array.isArray(data) ? data : data.shops || []))
      .catch(() => setError('Failed to load shops.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchShops(); }, []);

  const openModal = (shop, type) => { setModalShop(shop); setModalType(type); };
  const closeModal = () => { setModalShop(null); setModalType(''); };

  const handleConfirm = async () => {
    if (!modalShop) return;
    setActionLoading(true);
    try {
      if (modalType === 'deactivate') await deactivateShop(modalShop.id);
      if (modalType === 'delete') await deleteShop(modalShop.id);
      fetchShops();
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
      <h2 className="page-title">Shops</h2>

      {shops.length === 0 ? (
        <EmptyState message="No shops found." />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.name}</td>
                  <td>{shop.location || `${shop.lat}, ${shop.lng}`}</td>
                  <td>
                    <span className={`badge ${shop.isVerified ? 'badge-green' : 'badge-gray'}`}>
                      {shop.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${shop.isActive ? 'badge-blue' : 'badge-red'}`}>
                      {shop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openModal(shop, 'deactivate')}
                      >
                        Deactivate
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => openModal(shop, 'delete')}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalShop && (
        <Modal
          title={modalType === 'delete' ? 'Delete Shop' : 'Deactivate Shop'}
          onClose={closeModal}
        >
          <p>
            Are you sure you want to{' '}
            <strong>{modalType}</strong> <em>{modalShop.name}</em>?
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              className={`btn ${modalType === 'delete' ? 'btn-danger' : 'btn-warning'}`}
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing…' : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
