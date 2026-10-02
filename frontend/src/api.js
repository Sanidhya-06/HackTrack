// Simple localStorage-backed data store — no backend needed.
const KEY = (r) => `hacktrack:${r}`;
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function read(resource) {
  try { return JSON.parse(localStorage.getItem(KEY(resource))) || []; }
  catch { return []; }
}
function write(resource, rows) {
  localStorage.setItem(KEY(resource), JSON.stringify(rows));
}

export const api = {
  list: async (resource) => read(resource),

  create: async (resource, data) => {
    const rows = read(resource);
    const row = { ...data, _id: uid(), createdAt: new Date().toISOString() };
    rows.unshift(row);
    write(resource, rows);
    return row;
  },

  update: async (resource, id, data) => {
    const rows = read(resource);
    const idx = rows.findIndex((r) => r._id === id);
    if (idx === -1) throw new Error('Not found');
    rows[idx] = { ...rows[idx], ...data };
    write(resource, rows);
    return rows[idx];
  },

  remove: async (resource, id) => {
    write(resource, read(resource).filter((r) => r._id !== id));
    if (resource === 'members') {
      // unassign this member's tasks, same behaviour as before
      const tasks = read('tasks').map((t) => (t.assignee === id ? { ...t, assignee: null } : t));
      write('tasks', tasks);
    }
    return null;
  },
};

export const STATUSES = ['To Do', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const priorityStyle = {
  High: 'bg-rose-100 text-rose-700',
  Medium: 'bg-amber-100 text-amber-800',
  Low: 'bg-emerald-100 text-emerald-700',
};
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'No deadline');
