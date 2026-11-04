export function downloadCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert('No data to export for this period.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const v = row[h] ?? '';
        return typeof v === 'string' && v.includes(',') ? `"${v}"` : v;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getQuarterRange(date = new Date()) {
  const q = Math.floor(date.getMonth() / 3);
  const start = new Date(date.getFullYear(), q * 3, 1);
  const end = new Date(date.getFullYear(), q * 3 + 3, 0, 23, 59, 59);
  return { start, end, label: `Q${q + 1}-${date.getFullYear()}` };
}
