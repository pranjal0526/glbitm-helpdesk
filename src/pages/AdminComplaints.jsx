import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import AdminComplaintList from '../components/AdminComplaintList';
import { api, getApiErrorMessage } from '../utils/api';
import { normalizeComplaintStatus } from '../utils/formatters';

export default function AdminComplaints() {
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
            getApiErrorMessage(error, 'Failed to load all complaints.')
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

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 28,
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
            All Complaints
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            View and manage every complaint filed across the campus.
          </p>
        </div>

        <Link to="/admin" className="btn btn-ghost btn-lg">
          Back to Dashboard
        </Link>
      </div>

      <AdminComplaintList
        complaints={complaints}
        loading={loading}
        onComplaintUpdated={handleComplaintUpdated}
        showFilters
        emptyTitle="No complaints found"
        emptyMessage="Try changing the filters above."
      />
    </div>
  );
}
