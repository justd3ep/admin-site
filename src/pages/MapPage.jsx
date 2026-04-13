import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getShops } from '../services/api';
import { Spinner, ErrorMsg, EmptyState } from '../components/StatusWidgets';

// Fix Leaflet default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getShops()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.shops || [];
        setShops(list.filter((s) => s.lat && s.lng));
      })
      .catch(() => setError('Failed to load shops for map.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  const center =
    shops.length > 0 ? [shops[0].lat, shops[0].lng] : [20.5937, 78.9629]; // India fallback

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Shop Map</h2>
        <span className="badge badge-blue">{shops.length} shops</span>
      </div>

      {shops.length === 0 ? (
        <EmptyState message="No shops with location data available." />
      ) : (
        <div className="map-wrapper">
          <MapContainer center={center} zoom={13} className="leaflet-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {shops.map((shop) => (
              <Marker key={shop.id} position={[shop.lat, shop.lng]}>
                <Popup>
                  <div className="map-popup">
                    <strong>{shop.name}</strong>
                    <p>{shop.location || ''}</p>
                    <p>
                      <span className={shop.isVerified ? 'text-green' : 'text-red'}>
                        {shop.isVerified ? '✅ Verified' : '❌ Unverified'}
                      </span>
                    </p>
                    <p>
                      <span className={shop.isActive ? 'text-green' : 'text-gray'}>
                        {shop.isActive ? '🟢 Active' : '⚪ Inactive'}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
