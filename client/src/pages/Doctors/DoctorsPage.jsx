import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';

const defaultForm = {
  name: '',
  specialization: '',
  mobile: '',
  email: '',
  qualification: '',
  experience: '',
  availableTiming: '',
  department: ''
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [doctorRes, deptRes] = await Promise.all([
        api.get('/doctors', { params: { limit: 200 } }),
        api.get('/departments', { params: { limit: 200 } })
      ]);
      setDoctors(doctorRes.data.data || []);
      setDepartments(deptRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const visibleDoctors = useMemo(() => {
    if (filter === 'all') return doctors;
    return doctors.filter((item) => item.specialization === filter);
  }, [doctors, filter]);

  const saveDoctor = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/doctors/${editing._id}`, form);
        toast.success('Doctor updated');
      } else {
        await api.post('/doctors', form);
        toast.success('Doctor created');
      }
      setOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Doctors</h1>
        <button className="btn btn-primary" onClick={() => { setOpen(true); setEditing(null); setForm(defaultForm); }}>Add Doctor</button>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <label className="label" htmlFor="specialization">Specialization Filter</label>
        <select id="specialization" className="select" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All</option>
          {[...new Set(doctors.map((item) => item.specialization).filter(Boolean))].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="loader" /> : (
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'specialization', label: 'Specialization' },
            { key: 'email', label: 'Email' },
            { key: 'experience', label: 'Experience' }
          ]}
          data={visibleDoctors}
          renderActions={(row) => (
            <div className="row-actions">
              <button className="btn btn-outline" onClick={() => { setOpen(true); setEditing(row); setForm({ ...row, department: row.department?._id || '' }); }}>Edit</button>
              <button
                className="btn btn-outline"
                onClick={async () => {
                  if (!window.confirm(`Delete ${row.name}?`)) return;
                  await api.delete(`/doctors/${row._id}`);
                  toast.success('Doctor removed');
                  fetchAll();
                }}
              >
                Delete
              </button>
            </div>
          )}
        />
      )}

      <Modal title={editing ? 'Edit Doctor' : 'Add Doctor'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={saveDoctor}>
          <div className="form-grid">
            {['name', 'specialization', 'mobile', 'email', 'qualification', 'experience', 'availableTiming'].map((field) => (
              <div key={field}>
                <label className="label" htmlFor={field}>{field}</label>
                <input id={field} className="input" value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
              </div>
            ))}
            <div>
              <label className="label" htmlFor="department">Department</label>
              <select id="department" className="select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
                <option value="">Select</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>{department.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }}>Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default DoctorsPage;
