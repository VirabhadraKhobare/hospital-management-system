import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatDate from '../../utils/formatDate.js';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';

const defaultForm = {
  testName: '',
  patientId: '',
  doctorId: '',
  result: '',
  reportFile: '',
  testDate: '',
  status: 'requested'
};

const LaboratoryPage = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchAll = async () => {
    try {
      const [testRes, patientRes, doctorRes] = await Promise.all([
        api.get('/laboratory', { params: { limit: 200 } }),
        api.get('/patients', { params: { limit: 200 } }),
        api.get('/doctors', { params: { limit: 200 } })
      ]);
      setTests(testRes.data.data || []);
      setPatients(patientRes.data.data || []);
      setDoctors(doctorRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tests');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/laboratory/${editing._id}`, form);
        toast.success('Test updated');
      } else {
        await api.post('/laboratory', form);
        toast.success('Test request created');
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
        <h1 className="page-title">Laboratory</h1>
        <button className="btn btn-primary" onClick={() => { setOpen(true); setEditing(null); setForm(defaultForm); }}>New Test Request</button>
      </div>

      <Table
        columns={[
          { key: 'testName', label: 'Test Name' },
          { key: 'patientId', label: 'Patient', render: (value) => value?.name || '-' },
          { key: 'doctorId', label: 'Doctor', render: (value) => value?.name || '-' },
          { key: 'testDate', label: 'Date', render: (value) => formatDate(value) },
          { key: 'status', label: 'Status' }
        ]}
        data={tests}
        renderActions={(row) => (
          <div className="row-actions">
            <button className="btn btn-outline" onClick={() => { setOpen(true); setEditing(row); setForm({ ...row, patientId: row.patientId?._id, doctorId: row.doctorId?._id, testDate: row.testDate?.slice(0, 10) || '' }); }}>Edit</button>
            <button className="btn btn-outline" onClick={async () => {
              await api.put(`/laboratory/${row._id}`, { status: 'completed' });
              toast.success('Status updated');
              fetchAll();
            }}>Complete</button>
          </div>
        )}
      />

      <Modal title={editing ? 'Update Test' : 'Request Test'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-grid">
            <div>
              <label className="label">Test Name</label>
              <input className="input" value={form.testName} onChange={(event) => setForm({ ...form, testName: event.target.value })} required />
            </div>
            <div>
              <label className="label">Patient</label>
              <select className="select" value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })} required>
                <option value="">Select patient</option>
                {patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Doctor</label>
              <select className="select" value={form.doctorId} onChange={(event) => setForm({ ...form, doctorId: event.target.value })} required>
                <option value="">Select doctor</option>
                {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Test Date</label>
              <input className="input" type="date" value={form.testDate} onChange={(event) => setForm({ ...form, testDate: event.target.value })} required />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="requested">requested</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div>
              <label className="label">Report File URL</label>
              <input className="input" value={form.reportFile} onChange={(event) => setForm({ ...form, reportFile: event.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Result</label>
              <textarea className="textarea" value={form.result} onChange={(event) => setForm({ ...form, result: event.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }}>Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default LaboratoryPage;
