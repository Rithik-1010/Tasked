export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return formatDate(date);
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

export const getPriorityColor = (priority) => {
  const colors = { high: '#F87171', medium: '#FBBF24', low: '#34D399' };
  return colors[priority] || '#A1A1AA';
};

export const getStatusColor = (status) => {
  const colors = { pending: '#A1A1AA', 'in-progress': '#C084FC', completed: '#34D399' };
  return colors[status] || '#A1A1AA';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const exportToCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Category', 'Created'];
  const rows = tasks.map(t => [
    t.title, t.description, t.priority, t.status,
    t.dueDate ? formatDate(t.dueDate) : '', t.category, formatDate(t.createdAt)
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c != null ? String(c) : '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', `tasked-export-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
