import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ensureDemoAccount, loginDemoUser, loginUser, registerUser } from '../services/authService.js';

function BrandPanel() {
  return <section className="auth-story"><Link to="/login" className="brandmark"><span className="brand-icon">h</span><span>hacktrack<span className="brand-dot">.</span></span></Link><div className="story-copy"><span className="story-kicker">A little more flow, a lot less scramble</span><h1>Build.<br/>Track.<br/><span>Ship.</span></h1><p>Keep your hackathon team, tasks and progress in one place.</p><div className="story-art" aria-hidden="true"><span className="art-orbit orbit-one"/><span className="art-orbit orbit-two"/><span className="art-star">✦</span><div className="art-card"><i/><i/><i/><b>Good things are in motion</b><small>your next big idea starts here</small></div></div></div><div className="story-foot"><span>Made for the makers</span><span>✦ &nbsp; Your team, in sync</span></div></section>;
}

function Field({ label, type = 'text', value, onChange, placeholder, error, autoComplete }) {
  const [visible, setVisible] = useState(false);
  const actualType = type === 'password' && visible ? 'text' : type;
  return <label className="auth-field"><span>{label}</span><div className="auth-input-wrap"><input type={actualType} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} />{type === 'password' && <button type="button" className="password-toggle" onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</button>}</div>{error && <small className="field-error">{error}</small>}</label>;
}

export function Login() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const navigate = useNavigate(), location = useLocation();
  useEffect(() => { ensureDemoAccount(); }, []);
  const destination = location.state?.from?.pathname || '/dashboard';
  const submit = (event) => { event.preventDefault(); setError(''); if (!email.trim() || !password) { setError('Enter your email and password to continue.'); return; } setBusy(true); try { loginUser(email, password); navigate(destination, { replace: true }); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  const demo = () => { setBusy(true); setError(''); loginDemoUser(); navigate('/dashboard', { replace: true }); };
  return <AuthLayout><div className="auth-heading"><span className="auth-eyebrow">YOUR WORKSPACE IS WAITING</span><h2>Welcome back</h2><p>Pick up right where your team left off.</p></div>{error && <p className="auth-alert" role="alert">{error}</p>}<form onSubmit={submit} className="auth-form"><Field label="Email address" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/><Field label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/><button className="auth-submit" disabled={busy}>{busy ? 'Signing you in…' : 'Sign in'}<span>→</span></button></form><div className="auth-divider"><span>or jump right in</span></div><button type="button" className="demo-button" disabled={busy} onClick={demo}><span className="demo-spark">✦</span><span><b>Use Demo Account</b><small>Explore with a ready-to-go workspace</small></span><span className="demo-arrow">↗</span></button><p className="auth-switch">New to HackTrack? <Link to="/register">Create an account</Link></p></AuthLayout>;
}

export function Register() {
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' }), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const update = (key) => (event) => setFields((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => { event.preventDefault(); setError(''); if (!fields.name.trim() || !fields.email.trim() || !fields.password || !fields.confirm) { setError('Please complete all fields.'); return; } if (fields.password.length < 8) { setError('Use a password with at least 8 characters.'); return; } if (fields.password !== fields.confirm) { setError('Those passwords don’t match yet.'); return; } setBusy(true); try { registerUser(fields); navigate('/dashboard', { replace: true }); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <AuthLayout><div className="auth-heading"><span className="auth-eyebrow">LET’S MAKE SOMETHING</span><h2>Create your account</h2><p>Bring your next big idea and your team together.</p></div>{error && <p className="auth-alert" role="alert">{error}</p>}<form onSubmit={submit} className="auth-form"><Field label="Full name" value={fields.name} onChange={update('name')} placeholder="Your name" autoComplete="name"/><Field label="Email address" type="email" value={fields.email} onChange={update('email')} placeholder="you@example.com" autoComplete="email"/><Field label="Password" type="password" value={fields.password} onChange={update('password')} placeholder="At least 8 characters" autoComplete="new-password"/><Field label="Confirm password" type="password" value={fields.confirm} onChange={update('confirm')} placeholder="Enter it one more time" autoComplete="new-password"/><button className="auth-submit" disabled={busy}>{busy ? 'Creating your space…' : 'Create account'}<span>→</span></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></AuthLayout>;
}

function AuthLayout({ children }) { return <div className="auth-page"><BrandPanel/><main className="auth-main"><div className="auth-card">{children}<p className="auth-legal">By continuing, you’re ready to build something great.</p></div></main></div>; }
