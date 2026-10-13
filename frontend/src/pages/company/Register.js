import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyApi } from '../../services/api';

const styles = {
  container: { maxWidth: '440px', margin: '50px auto', background: '#fff', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#0078d4', textAlign: 'center' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '14px' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fde7e9', color: '#d13438', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', borderLeft: '4px solid #d13438' },
  link: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }
};

export default function CompanyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    website: '',
    industry: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!form.name.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!form.email.trim()) {
      setError('Company email is required.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await companyApi.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        website: form.website.trim() || undefined,
        industry: form.industry.trim() || undefined
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'company');
        localStorage.setItem('userId', data.companyId);
        localStorage.setItem('userName', form.name.trim());
        navigate('/company/dashboard');
      } else {
        navigate('/company/login');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details || 'Company registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏢 Register Company</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Company Name *</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Contoso Cloud Technologies"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Work Email *</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="recruiting@company.com"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password * (min. 6 characters)</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Website (Optional)</label>
          <input
            style={styles.input}
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://company.example"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Industry (Optional)</label>
          <input
            style={styles.input}
            type="text"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. Cloud Computing, AI, Software"
          />
        </div>

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Company'}
        </button>
      </form>

      <div style={styles.link}>
        Already registered? <Link to="/company/login">Sign in here</Link>
      </div>
      <div style={{ ...styles.link, marginTop: '8px' }}>
        Are you a student? <Link to="/student/register">Register as student</Link>
      </div>
    </div>
  );
}
