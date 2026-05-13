import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';

const defaultForm = {
  name: '',
  mobile: '',
  email: '',
  address: '',
  age: '',
  gender: 'male',
  bloodGroup: '',
  disease: '',
  password: ''
};

const PatientsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data: response } = await api.get('/patients', { params: { page, limit: 8, search } });
      setData(response.data || []);
      setPages(response.pagination?.pages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Name is required';
    if (!form.mobile) nextErrors.mobile = 'Mobile is required';
    if (!form.email) nextErrors.email = 'Email is required';
    if (!editing && !form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      if (editing) {
        await api.put(`/patients/${editing._id}`, form);
        toast.success('Patient updated');
      } else {
        await api.post('/patients', form);
        toast.success('Patient created');
      }
      setOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save patient');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Deactivate ${row.name}?`)) return;
    try {
      await api.delete(`/patients/${row._id}`);
      toast.success('Patient deleted');
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => (
      item.name?.toLowerCase().includes(search.toLowerCase())
      || item.email?.toLowerCase().includes(search.toLowerCase())
      || item.mobile?.includes(search)
    ));
  }, [data, search]);

  const columns = [
    { key: 'name', label: 'Name', render: (value, row) => <Link to={`/patients/${row._id}`}>{value}</Link> },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'disease', label: 'Disease' }
  ];

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Patients</h1>
        <button className="btn btn-primary" onClick={() => { setOpen(true); setEditing(null); setForm(defaultForm); }}>
          Add Patient
        </button>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 12, display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Search patients" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button className="btn btn-outline" onClick={fetchPatients}>Refresh</button>
      </div>

      {loading ? <div className="loader" /> : (
        <Table
          columns={columns}
          data={filtered}
          renderActions={(row) => (
            <div className="row-actions">
              <button className="btn btn-outline" onClick={() => { setEditing(row); setForm({ ...row, password: '' }); setOpen(true); }}>Edit</button>
              <button className="btn btn-outline" onClick={() => handleDelete(row)}>Delete</button>
            </div>
          )}
        />
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ alignSelf: 'center' }}>Page {page} of {pages}</span>
        <button className="btn btn-outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      <Modal title={editing ? 'Edit Patient' : 'Add Patient'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            {['name', 'mobile', 'email', 'address', 'age', 'bloodGroup', 'disease'].map((field) => (
              <div key={field}>
                <label className="label" htmlFor={field}>{field}</label>
                <input id={field} className="input" value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
                {errors[field] && <p className="error-text">{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label className="label" htmlFor="gender">gender</label>
              <select id="gender" className="select" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </div>
            {!editing && (
              <div>
                <label className="label" htmlFor="password">password</label>
                <input id="password" className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ marginTop: 12 }} type="submit">Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default PatientsPage;
