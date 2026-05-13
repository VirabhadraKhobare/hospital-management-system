import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatDate from '../../utils/formatDate.js';
import formatCurrency from '../../utils/formatCurrency.js';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';

const defaultForm = {
  medicineName: '',
  genericName: '',
  quantity: '',
  price: '',
  expiryDate: '',
  supplier: '',
  category: ''
};

const PharmacyPage = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/pharmacy', { params: { limit: 200 } });
      setItems(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch inventory');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/pharmacy/${editing._id}`, form);
        toast.success('Stock updated');
      } else {
        await api.post('/pharmacy', form);
        toast.success('Medicine added');
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
        <h1 className="page-title">Pharmacy Inventory</h1>
        <button className="btn btn-primary" onClick={() => { setOpen(true); setEditing(null); setForm(defaultForm); }}>Add Stock</button>
      </div>

      <Table
        columns={[
          {
            key: 'medicineName',
            label: 'Medicine',
            render: (value, row) => (
              <span style={{ color: row.quantity < 20 ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>
                {value}
              </span>
            )
          },
          { key: 'genericName', label: 'Generic Name' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'price', label: 'Price', render: (value) => formatCurrency(value) },
          { key: 'expiryDate', label: 'Expiry', render: (value) => formatDate(value) }
        ]}
        data={items}
        renderActions={(row) => (
          <div className="row-actions">
            <button className="btn btn-outline" onClick={() => { setOpen(true); setEditing(row); setForm({ ...row, expiryDate: row.expiryDate?.slice(0, 10) || '' }); }}>Edit</button>
            <button className="btn btn-outline" onClick={async () => {
              if (!window.confirm('Delete stock item?')) return;
              await api.delete(`/pharmacy/${row._id}`);
              toast.success('Stock item removed');
              fetchAll();
            }}>Delete</button>
          </div>
        )}
      />

      <Modal title={editing ? 'Edit Stock' : 'Add Stock'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-grid">
            {['medicineName', 'genericName', 'quantity', 'price', 'supplier', 'category'].map((field) => (
              <div key={field}>
                <label className="label">{field}</label>
                <input className="input" value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} required={['medicineName', 'quantity', 'price'].includes(field)} />
              </div>
            ))}
            <div>
              <label className="label">expiryDate</label>
              <input className="input" type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} required />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }}>Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default PharmacyPage;
