const StatCard = ({ title, value, helper }) => {
  return (
    <article className="card" style={{ padding: 16 }}>
      <div style={{ color: 'var(--muted)', fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <h3 style={{ fontSize: 30 }}>{value}</h3>
      {helper && <p style={{ marginTop: 8, color: 'var(--muted)' }}>{helper}</p>}
    </article>
  );
};

export default StatCard;
