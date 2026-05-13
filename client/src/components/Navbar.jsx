import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="card" style={{ margin: 20, marginBottom: 0, padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Hospital Management System</div>
          <h2 style={{ fontSize: 20, textTransform: 'capitalize' }}>{location.pathname.replace('/', '') || 'dashboard'}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <strong>{user?.name}</strong>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
