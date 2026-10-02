import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Members from './pages/Members.jsx';
import Tasks from './pages/Tasks.jsx';
import Board from './pages/Board.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import { getCurrentUser, logoutUser } from './services/authService.js';

const links = [['/', 'Dashboard', '⌂'], ['/tasks', 'Tasks', '◷'], ['/members', 'Team', '◎'], ['/board', 'Board', '▦']];
const titles = { '/': ['Your workspace', 'A little progress, every day.'], '/dashboard': ['Your workspace', 'A little progress, every day.'], '/tasks': ['Make it happen', 'Keep the small things moving.'], '/members': ['The people behind it', 'Good things happen when you build together.'], '/board': ['Work in motion', 'A clear view of what’s moving forward.'] };

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<ProtectedRoute><Workspace /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="members" element={<Members />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="board" element={<Board />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

import { Outlet } from 'react-router-dom';
function Workspace() {
  const location = useLocation(), navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser);
  const [eyebrow, subtitle] = titles[location.pathname] || titles['/'];
  const signOut = () => { logoutUser(); setUser(null); navigate('/login', { replace: true }); };
  const initial = (user?.name || 'H').charAt(0).toUpperCase();
  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink to="/" className="brandmark"><span className="brand-icon">h</span><span>hacktrack<span className="brand-dot">.</span></span></NavLink>
      <div className="workspace-switch"><span className="workspace-avatar">✳</span><span><b>Weekend builders</b><small>Workspace</small></span><span className="switch-chevron">⌄</span></div>
      <p className="nav-caption">MENU</p>
      <nav className="side-nav">{links.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">{icon}</span>{label}{label === 'Tasks' && <span className="nav-spark">✦</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-orbit">✦</span><b>Big ideas start small.</b><span>Keep showing up, your team’s got this.</span><div className="help-dots">●　●　●</div></div><div className="profile-row"><span className="avatar avatar-blue">{initial}</span><span className="profile-copy"><b>{user?.name}</b><small>{user?.email}</small></span><button className="logout-button" onClick={signOut}>Log out</button></div></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><span className="brand-icon">h</span> hacktrack</div><div className="breadcrumb">Workspace <span>/</span> <b>{location.pathname === '/' || location.pathname === '/dashboard' ? 'Overview' : location.pathname.slice(1).replace(/^./, (c) => c.toUpperCase())}</b></div><div className="top-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="icon-button notification" aria-label="Notifications">♧<i /></button><span className="avatar avatar-lilac">{initial}</span></div></header>
      <div className="page-wrap"><div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><p className="page-subtitle">{subtitle}</p></div><div className="date-chip"><span>☼</span> Your team, in sync</div></div><Outlet /></div>
      <nav className="mobile-nav">{links.map(([to,label,icon])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`mobile-nav-link ${isActive?'active':''}`}><span>{icon}</span>{label}</NavLink>)}<button className="mobile-logout" onClick={signOut}>↪</button></nav>
    </main>
  </div>;
}
