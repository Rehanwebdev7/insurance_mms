/**
 * CSV and Print Export Utility
 */

export function exportToCSV(filename: string, rows: Record<string, any>[], headers?: { key: string; label: string }[]) {
  if (!rows || !rows.length) return;

  const columnHeaders = headers || Object.keys(rows[0]).map(k => ({ key: k, label: k }));

  const csvRows: string[] = [];

  // Header line
  csvRows.push(columnHeaders.map(h => `"${h.label.replace(/"/g, '""')}"`).join(','));

  // Data lines
  for (const row of rows) {
    const values = columnHeaders.map(h => {
      const val = row[h.key];
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printElement(elementId: string) {
  const elem = document.getElementById(elementId);
  if (!elem) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #111; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
          th { background: #f0f0f0; }
          .header { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${elem.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
