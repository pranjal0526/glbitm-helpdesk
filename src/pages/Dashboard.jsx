import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ISSUE_ICONS = {
  fan: '🌀', window: '🪟', door: '🚪',
  table: '🛋️', chair: '🪑', light: '💡',
  ac: '❄️', projector: '📽️', other: '🔧'
};

// Fake complaints for now — replace with API later
const MOCK_COMPLAINTS = [
  { _id: '1', ticketId: 'GLB-0001', category: 'hostel',    issueType: 'fan',      floor: '2', roomNumber: '204', status: 'open',        createdAt: new Date() },
  { _id: '2', ticketId: 'GLB-0002', category: 'classroom', issueType: 'projector',floor: '1', roomNumber: 'CS-101', status: 'in-progress', createdAt: new Date() },
  { _id: '3', ticketId: 'GLB-0003', category: 'hostel',    issueType: 'light',    floor: '3', roomNumber: '310', status: 'resolved',     createdAt: new Date() },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    // Simulate loading — replace with real API call later
    const timer = setTimeout(() => {
      setComplaints(MOCK_COMPLAINTS);
      setLoading(false);
    }, 1000);
    setMounted(true);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: 'Open',
      value: complaints.filter(c => c.status === 'open').length,
      color: 'var(--warning)',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.2)',
      icon: '🔴',
    },
    {
      label: 'In Progress',
      value: complaints.filter(c => c.status === 'in-progress').length,
      color: 'var(--info)',
      bg: 'rgba(129,140,248,0.1)',
      border: 'rgba(129,140,248,0.2)',
      icon: '🔵',
    },
    {
      label: 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      color: 'var(--success)',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.2)',
      icon: '🟢',
    },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              {getGreeting()},
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, fontWeight: 700,
              color: 'var(--text)', letterSpacing: '-0.5px',
              marginBottom: 6
            }}>
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Here's an overview of your reported issues.
            </p>
          </div>

          <Link to="/new-complaint" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Complaint
          </Link>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14, marginBottom: 32
      }}>
        {stats.map((s, i) => (
          <div key={s.label} className="card" style={{
            padding: '22px 24px',
            background: s.bg,
            border: `1px solid ${s.border}`,
            animation: `fadeUp 0.4s ease both ${i * 0.08}s`,
            cursor: 'default',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.2)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            {loading ? (
              <>
                <div className="skeleton" style={{ height: 32, width: 48, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: 64 }} />
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 32, fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: s.color, marginBottom: 4,
                  letterSpacing: '-0.5px'
                }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {s.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Recent complaints */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 14
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17, fontWeight: 600, color: 'var(--text)'
            }}>Recent Complaints</h2>
            <Link to="/my-complaints" style={{
              fontSize: 13, color: 'var(--indigo)',
              textDecoration: 'none', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 13, width: '60%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 11, width: '40%' }} />
                    </div>
                    <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
                  </div>
                </div>
              ))
            ) : complaints.length === 0 ? (
              <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                  No complaints yet. Report your first issue!
                </p>
                <Link to="/new-complaint" className="btn btn-primary">
                  + New Complaint
                </Link>
              </div>
            ) : (
              complaints.slice(0, 5).map((c, i) => (
                <div key={c._id} className="card" style={{
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center',
                  gap: 14, cursor: 'pointer',
                  animation: `fadeUp 0.4s ease both ${0.1 + i * 0.07}s`,
                  transition: 'transform 0.18s ease, border-color 0.18s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 20
                  }}>
                    {ISSUE_ICONS[c.issueType] || '🔧'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 500,
                      color: 'var(--text)', textTransform: 'capitalize',
                      marginBottom: 3
                    }}>
                      {c.issueType} issue — {c.category}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                      {c.ticketId} &nbsp;·&nbsp; Floor {c.floor}, Room {c.roomNumber} &nbsp;·&nbsp;
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  {/* Badge */}
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick actions */}
          <div className="card" style={{ padding: '20px 20px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600,
              color: 'var(--text)', marginBottom: 14
            }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/new-complaint', icon: '➕', label: 'Report new issue', desc: 'Hostel or classroom' },
                { to: '/my-complaints', icon: '📋', label: 'My complaints',    desc: 'Track all your issues' },
              ].map(item => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 13px', borderRadius: 10,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-brand)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{item.desc}</div>
                  </div>
                  <svg style={{ marginLeft: 'auto', color: 'var(--text-faint)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div style={{
            borderRadius: 14, padding: '20px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>📬</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14, fontWeight: 600,
              color: 'var(--text)', marginBottom: 6
            }}>Admin is notified instantly</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Every complaint you submit sends an immediate email alert to the maintenance admin.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Status Badge component ────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'open':        { label: 'Open',        cls: 'badge-open'     },
    'in-progress': { label: 'In Progress', cls: 'badge-progress' },
    'resolved':    { label: 'Resolved',    cls: 'badge-resolved' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
}