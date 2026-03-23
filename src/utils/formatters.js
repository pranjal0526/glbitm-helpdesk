export function toTitleCase(value) {
  if (!value) {
    return 'General';
  }

  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function formatDate(value) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value) {
  if (!value) {
    return 'just now';
  }

  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);

  if (minutes < 1) {
    return 'just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

export function normalizeComplaintStatus(status) {
  if (!status) {
    return 'open';
  }

  return status === 'pending' ? 'open' : status;
}

export function getComplaintIssueLabel(complaint) {
  if (!complaint) {
    return 'General';
  }

  const rawValue =
    complaint.issueType === 'other'
      ? complaint.otherIssueText || complaint.title || 'Other'
      : complaint.issueType || complaint.title || 'General';

  return toTitleCase(String(rawValue).replace(/\s+issue$/i, ''));
}
