import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import formatDate from '../../utils/formatDate.js';

const ProfilePage = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', mobile: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        setForm({ name: data.name || '', mobile: data.mobile || '' });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put('/users/profile', form);
      setProfile(data);
      setUser((current) => ({ ...current, name: data.name, mobile: data.mobile }));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <div className="loader" />;

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">My Profile</h1>
      </div>

      <article className="card" style={{ padding: 16, maxWidth: 600 }}>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Joined:</strong> {formatDate(profile.createdAt)}</p>

        <form onSubmit={save} style={{ marginTop: 16 }}>
          <div className="form-grid">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <label className="label">Mobile</label>
              <input className="input" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }}>Update Profile</button>
        </form>
      </article>
    </section>
  );
};

export default ProfilePage;
