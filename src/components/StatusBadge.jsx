import React from 'react';

const STATUS_META = {
  open: {
    label: 'Open',
    className: 'badge badge-open',
  },
  pending: {
    label: 'Open',
    className: 'badge badge-open',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'badge badge-progress',
  },
  resolved: {
    label: 'Resolved',
    className: 'badge badge-resolved',
  },
};

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || {
    label: status || 'Unknown',
    className: 'badge badge-danger',
  };

  return <span className={meta.className}>{meta.label}</span>;
}
