import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { api, getApiErrorMessage } from '../utils/api';
import {
  formatDate,
  formatDateTime,
  getComplaintIssueLabel,
  normalizeComplaintStatus,
} from '../utils/formatters';

const ISSUE_ICONS = {
  fan: '🌀', window: '🪟', door: '🚪',
  table: '🛋️', chair: '🪑', light: '💡',
  ac: '❄️', projector: '📽️', other: '🔧',
};

export function AdminStatusBadge({ status }) {
  const map = {
    open: { label: 'Open', cls: 'badge-open' },
    pending: { label: 'Open', cls: 'badge-open' },
    'in-progress': { label: 'In Progress', cls: 'badge-progress' },
    resolved: { label: 'Resolved', cls: 'badge-resolved' },
  };
  const normalizedStatus = normalizeComplaintStatus(status);
  const { label, cls } = map[normalizedStatus] || {
    label: normalizedStatus,
    cls: '',
  };

  return <span className={`badge ${cls}`}>{label}</span>;
}

export function getStudent(complaint) {
  return complaint.student || {
    name: 'Student',
    email: 'Not available',
  };
}

function UpdateModal({ complaint, onClose, onSave }) {
  const [form, setForm] = useState({
    status: complaint.status,
    assignedTo: complaint.assignedTo || '',
    adminNote: complaint.adminNote || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      status: complaint.status,
      assignedTo: complaint.assignedTo || '',
      adminNote: complaint.adminNote || '',
    });
  }, [complaint]);

  const student = getStudent(complaint);
  const set = (key, val) => setForm((currentForm) => ({
    ...currentForm,
    [key]: val,
  }));

  const handleSave = async () => {
    setSaving(true);

    try {
      const { data } = await api.patch(`/complaints/${complaint._id}`, form);
      onSave({
        ...data.complaint,
        status: normalizeComplaintStatus(data.complaint?.status),
      });
      toast.success(`${complaint.ticketId} updated successfully.`);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update complaint.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={(event) => event.target === event.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20,
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 500,
          padding: 28,
          animation: 'fadeUp 0.25s ease both',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 4,
              }}
            >
              Update Complaint
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {complaint.ticketId} — {getComplaintIssueLabel(complaint)} in {complaint.category},{' '}
              Floor {complaint.floor}, Room {complaint.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-faint)',
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'var(--text-faint)';
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              flexShrink: 0,
              background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: 'white',
            }}
          >
            {student.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              {student.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {student.email}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <AdminStatusBadge status={complaint.status} />
          </div>
        </div>

        <div className="form-group">
          <label>Update Status</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { value: 'open', label: 'Open', color: 'var(--warning)' },
              { value: 'in-progress', label: 'In Progress', color: 'var(--info)' },
              { value: 'resolved', label: 'Resolved', color: 'var(--success)' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => set('status', option.value)}
                style={{
                  padding: '9px 8px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  transition: 'all 0.15s ease',
                  background: form.status === option.value
                    ? `rgba(${
                        option.value === 'open'
                          ? '245,158,11'
                          : option.value === 'in-progress'
                          ? '129,140,248'
                          : '16,185,129'
                      },0.15)`
                    : 'var(--bg)',
                  color: form.status === option.value
                    ? option.color
                    : 'var(--text-muted)',
                  outline: `2px solid ${
                    form.status === option.value ? option.color : 'transparent'
                  }`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Assign To (worker name)</label>
          <input
            type="text"
            placeholder="e.g. Raju Electrician"
            value={form.assignedTo}
            onChange={(event) => set('assignedTo', event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Note to Student</label>
          <textarea
            rows={3}
            placeholder="e.g. Will be fixed by tomorrow morning..."
            value={form.adminNote}
            onChange={(event) => set('adminNote', event.target.value)}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 2 }}
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 13,
                    height: 13,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Saving...
              </span>
            ) : '✓ Save & Notify Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ComplaintRow({ complaint, index, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const student = getStudent(complaint);

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        animation: `fadeUp 0.35s ease both ${index * 0.06}s`,
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = 'var(--border-hover)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {ISSUE_ICONS[complaint.issueType] || '🔧'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text)',
              textTransform: 'capitalize',
              marginBottom: 4,
            }}
          >
            {getComplaintIssueLabel(complaint)} — {complaint.category}, Floor {complaint.floor}, Room {complaint.roomNumber}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-faint)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            <span>{complaint.ticketId}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>{student.name}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{formatDate(complaint.createdAt)}</span>
            {complaint.assignedTo && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ color: 'var(--success)' }}>
                  Assigned: {complaint.assignedTo}
                </span>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <AdminStatusBadge status={complaint.status} />

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onUpdate(complaint)}
            style={{ fontSize: 12 }}
          >
            Update
          </button>

          <button
            onClick={() => setExpanded((currentValue) => !currentValue)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: expanded ? 'var(--bg-hover)' : 'transparent',
              border: `1px solid ${
                expanded ? 'var(--border-hover)' : 'var(--border)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: expanded ? 'var(--text)' : 'var(--text-faint)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = 'var(--bg-hover)';
              event.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(event) => {
              if (!expanded) {
                event.currentTarget.style.background = 'transparent';
                event.currentTarget.style.color = 'var(--text-faint)';
              }
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '18px 20px',
            background: 'rgba(255,255,255,0.015)',
            animation: 'fadeUp 0.2s ease both',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 16,
            }}
          >
            {[
              { label: 'Ticket ID', value: complaint.ticketId },
              { label: 'Category', value: complaint.category },
              {
                label: 'Location',
                value: `Floor ${complaint.floor}, Room ${complaint.roomNumber}`,
              },
              { label: 'Issue Type', value: getComplaintIssueLabel(complaint) },
              { label: 'Student', value: student.name },
              { label: 'Email', value: student.email },
              { label: 'Status', value: <AdminStatusBadge status={complaint.status} /> },
              { label: 'Assigned To', value: complaint.assignedTo || 'Unassigned' },
              { label: 'Submitted', value: formatDateTime(complaint.createdAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'var(--text-faint)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text)',
                    textTransform: typeof value === 'string' ? 'capitalize' : 'none',
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {complaint.description && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                Student Description
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  padding: '10px 14px',
                  background: 'var(--bg)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}
              >
                {complaint.description}
              </div>
            </div>
          )}

          {(complaint.assignedTo || complaint.adminNote) && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--indigo)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Admin Response
              </div>
              {complaint.assignedTo && (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: 'var(--text-faint)' }}>Assigned to: </span>
                  <span style={{ color: 'var(--success)', fontWeight: 500 }}>
                    {complaint.assignedTo}
                  </span>
                </div>
              )}
              {complaint.adminNote && (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: 'var(--text-faint)' }}>Note: </span>
                  {complaint.adminNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminComplaintList({
  complaints,
  loading,
  onComplaintUpdated,
  showFilters = true,
  maxItems,
  emptyIcon = '🎉',
  emptyTitle = 'No complaints found',
  emptyMessage = 'Try changing the filters above.',
  summaryLabel,
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selected, setSelected] = useState(null);

  const filteredComplaints = complaints.filter((complaint) => {
    if (!showFilters) {
      return true;
    }

    const statusMatch =
      filterStatus === 'all' || complaint.status === filterStatus;
    const categoryMatch =
      filterCategory === 'all' || complaint.category === filterCategory;

    return statusMatch && categoryMatch;
  });

  const displayedComplaints =
    typeof maxItems === 'number'
      ? filteredComplaints.slice(0, maxItems)
      : filteredComplaints;
  const resolvedSummaryLabel =
    summaryLabel ||
    (showFilters
      ? `Showing ${filteredComplaints.length} complaint${
          filteredComplaints.length !== 1 ? 's' : ''
        }`
      : '');

  return (
    <>
      {showFilters && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 18,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'open', 'in-progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: filterStatus === status
                    ? 'linear-gradient(135deg, var(--indigo), var(--violet))'
                    : 'var(--bg-card)',
                  color: filterStatus === status ? 'white' : 'var(--text-muted)',
                  boxShadow: filterStatus === status
                    ? '0 4px 12px rgba(99,102,241,0.3)'
                    : 'none',
                  border: filterStatus === status
                    ? 'none'
                    : '1px solid var(--border)',
                  textTransform: 'capitalize',
                }}
              >
                {status === 'all'
                  ? 'All Status'
                  : status === 'in-progress'
                  ? 'In Progress'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'hostel', 'classroom'].map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: filterCategory === category
                    ? 'var(--bg-hover)'
                    : 'var(--bg-card)',
                  color: filterCategory === category
                    ? 'var(--text)'
                    : 'var(--text-muted)',
                  border: filterCategory === category
                    ? '1px solid var(--border-hover)'
                    : '1px solid var(--border)',
                  textTransform: 'capitalize',
                }}
              >
                {category === 'all' ? 'All Locations' : category}
              </button>
            ))}
          </div>

          <span
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: 'var(--text-faint)',
            }}
          >
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div
                  className="skeleton"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="skeleton"
                    style={{ height: 13, width: '45%', marginBottom: 8 }}
                  />
                  <div className="skeleton" style={{ height: 11, width: '30%' }} />
                </div>
                <div
                  className="skeleton"
                  style={{ height: 24, width: 80, borderRadius: 20 }}
                />
                <div
                  className="skeleton"
                  style={{ height: 32, width: 80, borderRadius: 8 }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : displayedComplaints.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{emptyIcon}</div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 8,
            }}
          >
            {emptyTitle}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{emptyMessage}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayedComplaints.map((complaint, index) => (
            <ComplaintRow
              key={complaint._id}
              complaint={complaint}
              index={index}
              onUpdate={setSelected}
            />
          ))}
        </div>
      )}

      {!loading && displayedComplaints.length > 0 && resolvedSummaryLabel && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 18,
            fontSize: 12,
            color: 'var(--text-faint)',
          }}
        >
          {resolvedSummaryLabel}
        </p>
      )}

      {selected && (
        <UpdateModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onSave={onComplaintUpdated}
        />
      )}
    </>
  );
}
