import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api.js';
import formatCurrency from '../../utils/formatCurrency.js';
import formatDate from '../../utils/formatDate.js';

const BillingDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/billing/${id}`);
        setInvoice(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch invoice');
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) return <div className="loader" />;

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Invoice Detail</h1>
        <button className="btn btn-outline" onClick={() => window.print()}>Print</button>
      </div>

      <article className="card" style={{ padding: 16 }}>
        <p><strong>Patient:</strong> {invoice.patientId?.name}</p>
        <p><strong>Doctor:</strong> {invoice.doctorId?.name}</p>
        <p><strong>Status:</strong> {invoice.paymentStatus}</p>
        <p><strong>Created:</strong> {formatDate(invoice.createdAt)}</p>

        <h3 style={{ marginTop: 14, marginBottom: 8 }}>Services</h3>
        {(invoice.services || []).map((service, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', padding: '8px 0' }}>
            <span>{service.name}</span>
            <span>{formatCurrency(service.amount)} x {service.quantity}</span>
          </div>
        ))}

        <h2 style={{ marginTop: 12 }}>Total: {formatCurrency(invoice.totalAmount)}</h2>
      </article>
    </section>
  );
};

export default BillingDetailPage;
