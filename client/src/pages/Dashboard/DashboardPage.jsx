import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatCurrency from '../../utils/formatCurrency.js';
import formatDate from '../../utils/formatDate.js';
import StatCard from '../../components/StatCard.jsx';
import Table from '../../components/Table.jsx';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.totals);
        setActivity(data.recentActivity || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const columns = [
    { key: 'patientId', label: 'Patient', render: (value) => value?.name || '-' },
    { key: 'doctorId', label: 'Doctor', render: (value) => value?.name || '-' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date', render: (value) => formatDate(value) }
  ];

  if (loading) return <div className="loader" />;

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 16 }}>
        <StatCard title="Patients" value={stats?.patients || 0} />
        <StatCard title="Doctors" value={stats?.doctors || 0} />
        <StatCard title="Appointments" value={stats?.appointments || 0} />
        <StatCard title="Revenue" value={formatCurrency(stats?.revenue || 0)} />
      </div>

      <h2 style={{ marginBottom: 10 }}>Recent Activity</h2>
      <Table columns={columns} data={activity} />
    </section>
  );
};

export default DashboardPage;
