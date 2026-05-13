import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatDate from '../../utils/formatDate.js';
import formatCurrency from '../../utils/formatCurrency.js';
import Table from '../../components/Table.jsx';

const PatientDetailPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [billing, setBilling] = useState([]);
  const [lab, setLab] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appointmentRes, billingRes, labRes] = await Promise.all([
          api.get(`/patients/${id}`),
          api.get('/appointments', { params: { limit: 200 } }),
          api.get('/billing', { params: { limit: 200 } }),
          api.get('/laboratory', { params: { limit: 200 } })
        ]);

        setProfile(profileRes.data);
        setAppointments((appointmentRes.data.data || []).filter((item) => item.patientId?._id === id));
        setBilling((billingRes.data.data || []).filter((item) => item.patientId?._id === id));
        setLab((labRes.data.data || []).filter((item) => item.patientId?._id === id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load patient detail');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loader" />;
  if (!profile) return <p>Patient not found.</p>;

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Patient Detail</h1>
      </div>

      <article className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3>{profile.name}</h3>
        <p style={{ color: 'var(--muted)' }}>{profile.email} | {profile.mobile}</p>
        <p>{profile.address}</p>
        <p>Blood Group: {profile.bloodGroup || '-'} | Disease: {profile.disease || '-'}</p>
      </article>

      <h3 style={{ marginBottom: 8 }}>Appointment History</h3>
      <Table columns={[
        { key: 'doctorId', label: 'Doctor', render: (value) => value?.name || '-' },
        { key: 'date', label: 'Date', render: (value) => formatDate(value) },
        { key: 'status', label: 'Status' }
      ]} data={appointments} />

      <h3 style={{ marginTop: 14, marginBottom: 8 }}>Billing History</h3>
      <Table columns={[
        { key: 'paymentStatus', label: 'Payment Status' },
        { key: 'totalAmount', label: 'Amount', render: (value) => formatCurrency(value) }
      ]} data={billing} />

      <h3 style={{ marginTop: 14, marginBottom: 8 }}>Lab Results</h3>
      <Table columns={[
        { key: 'testName', label: 'Test' },
        { key: 'status', label: 'Status' },
        { key: 'testDate', label: 'Date', render: (value) => formatDate(value) }
      ]} data={lab} />
    </section>
  );
};

export default PatientDetailPage;
