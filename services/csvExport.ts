/**
 * Converts an array of objects to a CSV string and triggers a download.
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(fieldName => {
      const val = row[fieldName] ? row[fieldName].toString() : '';
      // Escape quotes and wrap in quotes to handle commas in data
      return `"${val.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
