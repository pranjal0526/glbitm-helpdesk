import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import AdminComplaintList from '../components/AdminComplaintList';
import { api, getApiErrorMessage } from '../utils/api';
import { normalizeComplaintStatus } from '../utils/formatters';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');

        if (!cancelled) {
          setComplaints(
            (data.complaints || []).map((complaint) => ({
              ...complaint,
              status: normalizeComplaintStatus(complaint.status),
            }))
          );
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            getApiErrorMessage(error, 'Failed to load admin complaints.')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    setMounted(true);
    loadComplaints();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleComplaintUpdated = (updatedComplaint) => {
    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        complaint._id === updatedComplaint._id ? updatedComplaint : complaint
      )
    );
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter((complaint) => complaint.status === 'open').length,
    inProgress: complaints.filter((complaint) => complaint.status === 'in-progress').length,
    resolved: complaints.filter((complaint) => complaint.status === 'resolved').length,
  };

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            marginBottom: 10,
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#a78bfa',
              boxShadow: '0 0 0 0 rgba(167,139,250,0.4)',
              animation: 'pulse-purple 1.5s infinite',
            }}
          />
          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>
            ADMIN PANEL
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '-0.5px',
                marginBottom: 6,
              }}
            >
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Manage the newest campus complaints from one place.
            </p>
          </div>

          <Link to="/admin/complaints" className="btn btn-primary btn-lg">
            View All Complaints
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: 'Total',
            value: stats.total,
            color: 'var(--info)',
            bg: 'rgba(129,140,248,0.1)',
            border: 'rgba(129,140,248,0.2)',
          },
          {
            label: 'Open',
            value: stats.open,
            color: 'var(--warning)',
            bg: 'rgba(245,158,11,0.1)',
            border: 'rgba(245,158,11,0.2)',
          },
          {
            label: 'In Progress',
            value: stats.inProgress,
            color: '#a78bfa',
            bg: 'rgba(139,92,246,0.1)',
            border: 'rgba(139,92,246,0.2)',
          },
          {
            label: 'Resolved',
            value: stats.resolved,
            color: 'var(--success)',
            bg: 'rgba(16,185,129,0.1)',
            border: 'rgba(16,185,129,0.2)',
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            style={{
              padding: '20px 22px',
              background: stat.bg,
              border: `1px solid ${stat.border}`,
              borderRadius: 14,
              animation: `fadeUp 0.4s ease both ${index * 0.07}s`,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <div className="skeleton" style={{ height: 32, width: 48, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: 64 }} />
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: stat.color,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 5,
            }}
          >
            Recent Complaints
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing the 10 latest complaints. Open the full section to manage everything.
          </p>
        </div>

        <Link
          to="/admin/complaints"
          style={{
            fontSize: 13,
            color: 'var(--indigo)',
            textDecoration: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          View all
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <AdminComplaintList
        complaints={complaints}
        loading={loading}
        onComplaintUpdated={handleComplaintUpdated}
        showFilters={false}
        maxItems={10}
        emptyIcon="📭"
        emptyTitle="No complaints yet"
        emptyMessage="New complaints will appear here as soon as students report them."
        summaryLabel={
          complaints.length > 10
            ? `Showing 10 of ${complaints.length} complaints`
            : `Showing ${complaints.length} complaint${complaints.length !== 1 ? 's' : ''}`
        }
      />

      <style>{`
        @keyframes pulse-purple {
          0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(167,139,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        }
      `}</style>
    </div>
  );
}
