import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, priorityStyle, fmtDate } from '../api.js';

export default function Dashboard() {
  const [members, setMembers] = useState([]); const [tasks, setTasks] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([api.list('members'), api.list('tasks')]).then(([m,t])=>{setMembers(m);setTasks(t);}).catch(e=>setError(e.message)); }, []);
  const done=tasks.filter(t=>t.status==='Completed').length, pending=tasks.length-done, progress=tasks.length?Math.round(done/tasks.length*100):0;
  const stats=[['Team members',members.length,'◎','Growing together'],['Total tasks',tasks.length,'▤','All the little steps'],['Completed',done,'✓','Look at you go'],['In progress',pending,'◷','One step at a time']];
  return <div>{error&&<p className="error-message">{error}</p>}<div className="stat-grid">{stats.map(([label,n,icon,foot])=><article key={label} className="card stat-card"><span className="stat-icon">{icon}</span><p>{label}</p><strong>{n}</strong><div className="stat-foot">{foot}</div></article>)}</div>
    <div className="dashboard-grid"><div className="card progress-panel"><div className="progress-top"><div><div className="section-head" style={{margin:0}}><h2>Project pulse</h2></div><p className="progress-note">Your team is building momentum ✨</p></div><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}} /></div><p className="progress-note">{done} of {tasks.length} tasks completed</p></div>
      <div className="card"><div className="section-head"><h2>Your crew</h2><Link to="/members">Meet everyone ↗</Link></div>{members.length===0?<p className="empty-state">Your team is waiting to meet. Add your first member.</p>:<div className="member-grid" style={{gridTemplateColumns:'1fr'}}>{members.slice(0,4).map((m,i)=><div key={m._id} className="member-card" style={{padding:'9px 0',border:0,boxShadow:'none'}}><div className="member-card-head"><span className="member-avatar">{m.name?.[0]?.toUpperCase()}</span><div><p className="member-name">{m.name}</p><p className="member-role">{m.role||'Team member'}</p></div></div></div>)}</div>}</div>
    </div>
    <section className="card" style={{marginTop:16}}><div className="section-head"><h2>Up next</h2><Link to="/tasks">All tasks ↗</Link></div>{tasks.length===0?<p className="empty-state">No tasks yet. Add a first step to get things rolling.</p>:<div className="task-preview">{tasks.slice(0,4).map(t=><div className="task-row" key={t._id}><span className="task-check" style={t.status==='Completed'?{background:'#70bd98',borderColor:'#70bd98'}:{}}/><span className="task-row-title">{t.title}</span><span className={`badge priority-${(t.priority||'Medium').toLowerCase()}`}>{t.priority}</span><span className="task-meta">{fmtDate(t.deadline)}</span></div>)}</div>}</section>
  </div>;
}
