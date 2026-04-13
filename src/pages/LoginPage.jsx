import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import { supabase } from '../services/supabase';
import { DEMO_TOKEN } from '../services/mockData';
import { ChefHat } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Save token temporarily to allow API calls
      const token = authData.session.access_token;
      localStorage.setItem('adminToken', token);

      // 3. Verify role with backend
      const { data: profile } = await getUserProfile();

      // 4. Role-based Redirection Logic
      if (profile.role === 'admin') {
        localStorage.setItem('adminUser', JSON.stringify(profile));
        navigate('/');
      } else if (profile.role === 'owner') {
        // Here you could programmatically redirect to the Cafe Dashboard URL
        throw new Error('Access denied: Owners must use the Cafe Dashboard.');
      } else {
        // Here you could programmatically redirect to the Student App URL
        throw new Error('Access denied: Users must use the Student App.');
      }
    } catch (err) {
      // Clean up token if role verification failed or login failed
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setError(err.message || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    localStorage.setItem('adminToken', DEMO_TOKEN);
    localStorage.setItem('adminUser', JSON.stringify({ name: 'Demo Admin', email: 'demo@admin.com' }));
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <ChefHat size={36} className="brand-icon" />
          <h1>Admin Portal</h1>
          <p>Food Ordering & Queue Management</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div style={{ margin: '16px 0', textAlign: 'center', color: '#8892a4', fontSize: '12px' }}>
            — OR —
          </div>

          <button 
            type="button" 
            className="btn btn-ghost w-full" 
            onClick={handleBypass}
          >
            Bypass Login (Debug Mode)
          </button>
          
          <p style={{ marginTop: '12px', fontSize: '11px', color: '#f87171', textAlign: 'center' }}>
            Note: Real API calls will fail with a dummy token.
          </p>
        </form>
      </div>
    </div>
  );
}
