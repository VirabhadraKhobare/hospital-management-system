import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatCurrency from '../../utils/formatCurrency.js';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';

const defaultForm = { name: '', amount: '', description: '', department: '' };

const ServicesPage = () => {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchAll = async () => {
    try {
      const [serviceRes, departmentRes] = await Promise.all([
        api.get('/services', { params: { limit: 200 } }),
        api.get('/departments', { params: { limit: 200 } })
      ]);
      setItems(serviceRes.data.data || []);
      setDepartments(departmentRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/services/${editing._id}`, form);
        toast.success('Service updated');
      } else {
        await api.post('/services', form);
        toast.success('Service added');
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
        <h1 className="page-title">Service Charges</h1>
        <button className="btn btn-primary" onClick={() => { setOpen(true); setEditing(null); setForm(defaultForm); }}>Add Service</button>
      </div>

      <Table
        columns={[
          { key: 'name', label: 'Service' },
          { key: 'department', label: 'Department', render: (value) => value?.name || '-' },
          { key: 'amount', label: 'Amount', render: (value) => formatCurrency(value) }
        ]}
        data={items}
        renderActions={(row) => (
          <div className="row-actions">
            <button className="btn btn-outline" onClick={() => { setOpen(true); setEditing(row); setForm({ ...row, department: row.department?._id || '' }); }}>Edit</button>
            <button className="btn btn-outline" onClick={async () => {
              if (!window.confirm('Delete service?')) return;
              await api.delete(`/services/${row._id}`);
              toast.success('Service removed');
              fetchAll();
            }}>Delete</button>
          </div>
        )}
      />

      <Modal title={editing ? 'Edit Service' : 'Add Service'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-grid">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <label className="label">Amount</label>
              <input className="input" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
            </div>
            <div>
              <label className="label">Department</label>
              <select className="select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
                <option value="">Select</option>
                {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }}>Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default ServicesPage;
