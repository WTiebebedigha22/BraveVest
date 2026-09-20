import './AdminTable.css';

export default function AdminTable({ columns, rows, onRowClick, empty }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="atable atable--empty">
        {empty || 'No records yet.'}
      </div>
    );
  }

  return (
    <div className="atable-wrap">
      <div className="atable">
        <div className="atable__head" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((c) => (
            <div key={c.key} className={`atable__th ${c.align ? 'is-' + c.align : ''}`}>{c.label}</div>
          ))}
        </div>
        <div className="atable__body">
          {rows.map((row, i) => (
            <div
              key={row.id || i}
              className={`atable__row ${onRowClick ? 'is-clickable' : ''}`}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <div key={c.key} className={`atable__td ${c.align ? 'is-' + c.align : ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

AdminTable.Status = function AdminTableStatus({ status }) {
  const cls = String(status || '').toLowerCase();
  return <span className={`apill apill--${cls}`}>{String(status || '—').replace(/_/g, ' ')}</span>;
};
