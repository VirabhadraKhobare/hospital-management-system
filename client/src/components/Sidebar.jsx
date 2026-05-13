import { NavLink } from 'react-router-dom';
import { ROLE_NAV } from '../utils/constants.js';

const labels = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  doctors: 'Doctors',
  appointments: 'Appointments',
  billing: 'Billing',
  services: 'Services',
  laboratory: 'Laboratory',
  pharmacy: 'Pharmacy',
  profile: 'Profile'
};

const Sidebar = ({ role = 'patient' }) => {
  const items = ROLE_NAV[role] || ['profile'];

  return (
    <aside
      style={{
        background: 'linear-gradient(190deg, #022548, #014d7d)',
        color: 'white',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <h2 style={{ fontSize: 22 }}>HMS Portal</h2>
      <p style={{ marginTop: -10, opacity: 0.8, fontSize: 13 }}>Care starts with clean workflows.</p>
      <nav style={{ display: 'grid', gap: 8 }}>
        {items.map((item) => (
          <NavLink
            key={item}
            to={`/${item}`}
            style={({ isActive }) => ({
              padding: '10px 12px',
              borderRadius: 8,
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: 700
            })}
          >
            {labels[item]}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
