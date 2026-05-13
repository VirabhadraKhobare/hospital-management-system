const Table = ({ columns, data, rowKey = '_id', renderActions }) => {
  return (
    <div className="card table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} style={{ textAlign: 'center' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={`${row[rowKey]}-${column.key}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key] || '-'}
                  </td>
                ))}
                {renderActions && <td>{renderActions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
