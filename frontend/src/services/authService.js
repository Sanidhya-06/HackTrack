const USERS_KEY = 'hacktrack_users';
const CURRENT_USER_KEY = 'hacktrack_current_user';
const DEMO = { name: 'HackTrack Demo', email: 'demo@hacktrack.app', password: 'demo123' };

function readUsers() {
  try { const value = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}

export function getUsers() { return readUsers(); }
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'); }
  catch { return null; }
}
export function isAuthenticated() { return Boolean(getCurrentUser()?.email); }

export function loginUser(email, password) {
  const user = readUsers().find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password);
  if (!user) throw new Error('That email and password do not match. Please try again.');
  const current = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  return current;
}

export function registerUser({ name, email, password }) {
  const cleanName = name.trim(), cleanEmail = email.trim().toLowerCase();
  if (!cleanName || !cleanEmail || !password) throw new Error('Please complete all fields.');
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('Enter a valid email address.');
  if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
  const users = readUsers();
  if (users.some((user) => user.email.toLowerCase() === cleanEmail)) throw new Error('An account with this email already exists.');
  const user = { id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: cleanName, email: cleanEmail, password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const current = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  return current;
}

export function loginDemoUser() {
  ensureDemoAccount();
  const demo = readUsers().find((user) => user.email.toLowerCase() === DEMO.email);
  const current = { id: demo.id, name: demo.name, email: demo.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  return current;
}

export function ensureDemoAccount() {
  const users = readUsers();
  if (!users.some((user) => user.email.toLowerCase() === DEMO.email)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, { id: 'hacktrack-demo', ...DEMO }]));
  }
}

export function logoutUser() { localStorage.removeItem(CURRENT_USER_KEY); }
