import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { companyApi } from '../../services/api';

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#0078d4' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '24px', background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' },
  btn: { padding: '10px 20px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  clearBtn: { padding: '10px 16px', background: '#f3f2f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  backBtn: { padding: '8px 16px', background: '#605e5c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' },
  card: { background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  name: { fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '4px' },
  details: { fontSize: '13px', color: '#666', lineHeight: '1.6' },
  skillsSection: { marginTop: '12px', marginBottom: '12px' },
  skillTag: { display: 'inline-block', background: '#f0f6ff', color: '#0078d4', border: '1px solid #c7dfff', padding: '3px 10px', borderRadius: '12px', margin: '3px', fontSize: '12px', fontWeight: '500' },
  actionRow: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' },
  resumeBtn: { background: 'none', border: 'none', color: '#0078d4', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', fontWeight: '500', padding: 0 },
  chatBtn: { padding: '6px 14px', background: '#107c10', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  loading: { textAlign: 'center', padding: '40px', color: '#666', fontSize: '16px' },
  empty: { textAlign: 'center', padding: '40px', color: '#666', background: '#fff', borderRadius: '8px' },
  error: { background: '#fde7e9', color: '#d13438', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }
};

export default function CandidateSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [viewingResume, setViewingResume] = useState({});

  async function executeSearch(query = '') {
    setError('');
    setLoading(true);
    setHasSearched(true);
    try {
      const params = query.trim() ? { query: query.trim() } : {};
      const { data } = await companyApi.searchCandidates(params);
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Candidate search failed:', err.message);
      setError(err.response?.data?.error || 'Failed to search candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Load initial candidate list on mount
  useEffect(() => {
    executeSearch('');
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    executeSearch(searchTerm);
  }

  function handleClear() {
    setSearchTerm('');
    executeSearch('');
  }

  async function handleViewResume(candidate) {
    if (!candidate.resumeUrl) {
      alert('Resume not yet uploaded for this candidate.');
      return;
    }
    const candidateId = candidate.id;
    setViewingResume(prev => ({ ...prev, [candidateId]: true }));
    try {
      const response = await api.get(`/students/resume/${candidateId}/file`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (err) {
      console.error('Failed to view resume:', err.message);
      let errorMsg = 'Resume file not found or has not been uploaded yet.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed.error) errorMsg = parsed.error;
        } catch (_) {
          errorMsg = err.message || errorMsg;
        }
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert('Unable to load resume: ' + errorMsg);
    } finally {
      setViewingResume(prev => ({ ...prev, [candidateId]: false }));
    }
  }

  function handleStartChat(candidate) {
    navigate(`/chat?to=student:${candidate.id}`);
  }

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/company/dashboard')}>
        ← Back to Dashboard
      </button>

      <div style={styles.header}>
        <h2 style={styles.title}>🔍 Candidate Talent Search</h2>
      </div>

      <form onSubmit={handleSearchSubmit} style={styles.searchBar}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search candidates by skill (e.g. React, Node, Python, Azure), name, or course..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        {searchTerm && (
          <button type="button" onClick={handleClear} style={styles.clearBtn} disabled={loading}>
            Clear
          </button>
        )}
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Searching candidates...</div>
      ) : candidates.length === 0 ? (
        <div style={styles.empty}>
          <h3>No candidates found</h3>
          <p>
            {hasSearched && searchTerm
              ? `No candidates matched your search criteria for "${searchTerm}". Try different skills or keywords.`
              : 'No candidate profiles currently available.'}
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '14px', color: '#666', fontSize: '14px' }}>
            Found <strong>{candidates.length}</strong> candidate{candidates.length === 1 ? '' : 's'}
          </div>

          {candidates.map(candidate => (
            <div key={candidate.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.name}>{candidate.name}</div>
                  <div style={styles.details}>
                    <div>📧 {candidate.email}</div>
                    {candidate.phone && <div>📞 {candidate.phone}</div>}
                    {candidate.course && (
                      <div>
                        🎓 {candidate.course}
                        {candidate.graduationYear && ` (Class of ${candidate.graduationYear})`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {candidate.skills && (
                <div style={styles.skillsSection}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>
                    Skills & Technologies:
                  </div>
                  {candidate.skills
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
                    .map(s => (
                      <span key={s} style={styles.skillTag}>
                        {s}
                      </span>
                    ))}
                </div>
              )}

              <div style={styles.actionRow}>
                {candidate.resumeUrl ? (
                  <button
                    type="button"
                    onClick={() => handleViewResume(candidate)}
                    disabled={viewingResume[candidate.id]}
                    style={styles.resumeBtn}
                  >
                    {viewingResume[candidate.id] ? '⏳ Loading PDF...' : '📄 View Resume'}
                  </button>
                ) : (
                  <span style={{ fontSize: '13px', color: '#999' }}>Resume not yet uploaded</span>
                )}

                <button
                  type="button"
                  onClick={() => handleStartChat(candidate)}
                  style={styles.chatBtn}
                >
                  💬 Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
