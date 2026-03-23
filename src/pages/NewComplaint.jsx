import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { api, getApiErrorMessage } from '../utils/api';

// ─────────────────────────────────────────────
// CATEGORY OPTIONS
// Each category has styling info (color, border, glow)
// used to highlight the selected card
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    value: 'hostel',
    label: 'Hostel',
    icon: '🏠',
    desc: 'Room, corridor, bathroom, common area',
    color: 'rgba(245,158,11,0.15)',   // amber tint for hostel
    border: 'rgba(245,158,11,0.3)',
    glow: 'rgba(245,158,11,0.1)',
  },
  {
    value: 'classroom',
    label: 'Classroom',
    icon: '🏫',
    desc: 'Lecture hall, lab, seminar room',
    color: 'rgba(99,102,241,0.15)',   // indigo tint for classroom
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.1)',
  },
];

// ─────────────────────────────────────────────
// ISSUE TYPES
// Different issues available per category
// hostel gets AC, classroom gets projector/table/chair
// ─────────────────────────────────────────────
const ISSUES = {
  hostel: [
    { value: 'fan',    icon: '🌀', label: 'Fan' },
    { value: 'light',  icon: '💡', label: 'Light' },
    { value: 'ac',     icon: '❄️', label: 'AC' },
    { value: 'window', icon: '🪟', label: 'Window' },
    { value: 'door',   icon: '🚪', label: 'Door' },
    { value: 'other',  icon: '🔧', label: 'Other' },
  ],
  classroom: [
    { value: 'fan',       icon: '🌀', label: 'Fan' },
    { value: 'light',     icon: '💡', label: 'Light' },
    { value: 'projector', icon: '📽️', label: 'Projector' },
    { value: 'window',    icon: '🪟', label: 'Window' },
    { value: 'door',      icon: '🚪', label: 'Door' },
    { value: 'table',     icon: '🛋️', label: 'Table' },
    { value: 'chair',     icon: '🪑', label: 'Chair' },
    { value: 'other',     icon: '🔧', label: 'Other' },
  ],
};

// Step labels shown in the progress indicator at the top
const STEPS = ['Location', 'Room Details', 'Issue Type'];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function NewComplaint() {
  const navigate = useNavigate();

  // Current step (1, 2, or 3)
  const [step, setStep] = useState(1);

  // Loading state while complaint is being submitted
  const [submitting, setSubmitting] = useState(false);

  // Form data — all fields in one object
  const [form, setForm] = useState({
    category: '',     // 'hostel' or 'classroom'
    floor: '',        // floor number as string
    roomNumber: '',   // room number e.g. '204' or 'CS-101'
    issueType: '',    // one of the ISSUES values above
    otherIssueText: '',
    description: '',  // optional extra detail from student
  });

  // Helper to update a single field without overwriting others
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── Step navigation ──────────────────────────

  // Validate current step before moving forward
  const goNext = () => {
    if (step === 1 && !form.category) {
      toast.error('Please select a location type');
      return;
    }
    if (step === 2) {
      if (!form.floor.trim())      { toast.error('Please enter floor number'); return; }
      if (!form.roomNumber.trim()) { toast.error('Please enter room number');  return; }
    }
    setStep(s => s + 1);
  };

  const goBack = () => setStep(s => s - 1);

  // ── Submit handler ───────────────────────────

  const handleSubmit = async () => {
    if (!form.issueType) {
      toast.error('Please select an issue type');
      return;
    }

    if (form.issueType === 'other' && !form.otherIssueText.trim()) {
      toast.error('Please describe the other issue');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category: form.category,
        floor: form.floor.trim(),
        roomNumber: form.roomNumber.trim(),
        issueType: form.issueType,
        description: form.description.trim(),
      };

      if (form.issueType === 'other') {
        payload.otherIssueText = form.otherIssueText.trim();
      }

      const { data } = await api.post('/complaints', payload);

      toast.success(
        `${data.complaint?.ticketId || 'Complaint'} submitted successfully.`
      );
      navigate('/my-complaints', { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to submit. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Issues list changes based on selected category
  const issues = ISSUES[form.category] || [];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', animation: 'fadeUp 0.4s ease both' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 700,
          color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6
        }}>New Complaint</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Tell us what needs fixing — we'll get it sorted.
        </p>
      </div>

      {/* ── Step progress indicator ── */}
      {/* Shows 3 numbered circles connected by a line
          Completed steps turn green with a checkmark
          Active step glows indigo */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {STEPS.map((label, i) => {
          const num    = i + 1;
          const done   = step > num;   // step is completed
          const active = step === num; // step is currently active
          return (
            <React.Fragment key={label}>
              {/* Step circle + label */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  transition: 'all 0.3s ease',
                  background: done
                    ? 'var(--success)'                                          // green when done
                    : active
                    ? 'linear-gradient(135deg, var(--indigo), var(--violet))'  // indigo when active
                    : 'var(--bg-card)',                                         // dark when upcoming
                  border: done || active ? 'none' : '1px solid var(--border)',
                  color: done || active ? 'white' : 'var(--text-faint)',
                  boxShadow: active ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                }}>
                  {/* Show checkmark for done steps, number for others */}
                  {done
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : num
                  }
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                  color: active ? 'var(--indigo)' : done ? 'var(--success)' : 'var(--text-faint)',
                }}>{label}</span>
              </div>

              {/* Connector line between steps — turns green when step is done */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 20,
                  marginLeft: 6, marginRight: 6,
                  background: step > num ? 'var(--success)' : 'var(--border)',
                  transition: 'background 0.4s ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Main card — content changes per step ── */}
      <div className="card" style={{ padding: 28 }}>

        {/* ══════════════════════════════════════
            STEP 1 — Choose hostel or classroom
            Auto-advances to step 2 on click
            ══════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.3s ease both' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 600,
              color: 'var(--text)', marginBottom: 6
            }}>Where is the problem?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
              Select the area where the issue is located.
            </p>

            {/* Two big clickable category cards */}
           <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  // Select category and auto-advance after short delay
                  onClick={() => { set('category', cat.value); setTimeout(goNext, 200); }}
                  style={{
                    padding: '24px 20px', borderRadius: 14,
                    cursor: 'pointer', textAlign: 'left', border: 'none',
                    // Highlight selected card with category color
                    background: form.category === cat.value ? cat.color : 'var(--bg)',
                    outline: `2px solid ${form.category === cat.value ? cat.border : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    boxShadow: form.category === cat.value ? `0 0 20px ${cat.glow}` : 'none',
                  }}
                  onMouseEnter={e => {
                    if (form.category !== cat.value) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.outline = '2px solid var(--border-hover)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (form.category !== cat.value) {
                      e.currentTarget.style.background = 'var(--bg)';
                      e.currentTarget.style.outline = '2px solid transparent';
                    }
                  }}
                >
                  <div style={{ fontSize: 34, marginBottom: 12 }}>{cat.icon}</div>
                  <div style={{
                    fontSize: 16, fontWeight: 600, color: 'var(--text)',
                    marginBottom: 5, fontFamily: 'var(--font-display)'
                  }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {cat.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 2 — Enter floor and room number
            Shows a live preview pill as user types
            Enter key moves to next step
            ══════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp 0.3s ease both' }}>
            {/* Header with category icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>
                {CATEGORIES.find(c => c.value === form.category)?.icon}
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18, fontWeight: 600, color: 'var(--text)'
              }}>
                {form.category === 'hostel' ? 'Hostel' : 'Classroom'} — Location Details
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
              Which floor and room is the issue in?
            </p>

            {/* Floor + room inputs side by side */}
            <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Floor Number</label>
                <input
                  type="text"
                  placeholder={form.category === 'hostel' ? 'e.g. 2' : 'e.g. 1'}
                  value={form.floor}
                  onChange={e => set('floor', e.target.value)}
                  autoFocus // focus first input automatically
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Room Number</label>
                <input
                  type="text"
                  placeholder={form.category === 'hostel' ? 'e.g. 204' : 'e.g. CS-101'}
                  value={form.roomNumber}
                  onChange={e => set('roomNumber', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goNext()} // Enter key shortcut
                />
              </div>
            </div>

            {/* Live location preview — only shows when user has typed something */}
            {(form.floor || form.roomNumber) && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 20,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                fontSize: 13, color: 'var(--info)',
                marginBottom: 4, animation: 'scaleIn 0.2s ease both'
              }}>
                📍 {form.category} · Floor {form.floor || '?'} · Room {form.roomNumber || '?'}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={goBack} style={{ flex: 1 }}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={goNext} style={{ flex: 2 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 3 — Pick issue type + description
            Grid of issue buttons (changes based on category)
            Optional description textarea
            Spinner shown while submitting
            ══════════════════════════════════════ */}
        {step === 3 && (
          <div style={{ animation: 'fadeUp 0.3s ease both' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 600,
              color: 'var(--text)', marginBottom: 8
            }}>What is the problem?</h2>

            {/* Location summary pill — reminds user of their previous selections */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 20, marginBottom: 22,
              background: 'var(--bg)', border: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text-muted)'
            }}>
              📍 {form.category} · Floor {form.floor} · Room {form.roomNumber}
            </div>

            {/* Issue type grid — 4 columns
                Issues list is different for hostel vs classroom */}
            <div className="issue-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 10, marginBottom: 24
                }}>
              {issues.map((issue, i) => (
                <button
                  key={issue.value}
                  type="button"
                  onClick={() => {
                    set('issueType', issue.value);

                    if (issue.value !== 'other') {
                      set('otherIssueText', '');
                    }
                  }}
                  style={{
                    padding: '16px 8px', borderRadius: 12,
                    cursor: 'pointer', textAlign: 'center', border: 'none',
                    // Highlight selected issue with indigo glow
                    background: form.issueType === issue.value
                      ? 'rgba(99,102,241,0.15)' : 'var(--bg)',
                    outline: `2px solid ${form.issueType === issue.value
                      ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                    transition: 'all 0.18s ease',
                    // Stagger animation for each button appearing
                    animation: `fadeUp 0.3s ease both ${i * 0.05}s`,
                    boxShadow: form.issueType === issue.value
                      ? '0 0 16px rgba(99,102,241,0.15)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (form.issueType !== issue.value) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.outline = '2px solid var(--border-hover)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (form.issueType !== issue.value) {
                      e.currentTarget.style.background = 'var(--bg)';
                      e.currentTarget.style.outline = '2px solid transparent';
                    }
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{issue.icon}</div>
                  <div style={{
                    fontSize: 12, fontWeight: 500,
                    // Label color changes when selected
                    color: form.issueType === issue.value
                      ? 'var(--info)' : 'var(--text-muted)'
                  }}>{issue.label}</div>
                </button>
              ))}
            </div>

            {form.issueType === 'other' && (
              <div className="form-group">
                <label>Other Issue</label>
                <input
                  type="text"
                  placeholder="Describe the issue briefly"
                  value={form.otherIssueText}
                  onChange={e => set('otherIssueText', e.target.value)}
                  maxLength={200}
                  autoFocus
                />
              </div>
            )}

            {/* Optional description box */}
            <div className="form-group">
              <label>
                Additional Description{' '}
                <span style={{
                  color: 'var(--text-faint)',
                  fontWeight: 400,
                  textTransform: 'none'
                }}>(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe the issue in more detail — e.g. 'Fan makes loud noise and stops after 5 minutes'"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                style={{ resize: 'vertical', minHeight: 80 }}
              />
            </div>

            {/* Navigation + submit buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={goBack} style={{ flex: 1 }}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                // Disabled if no issue selected or currently submitting
                disabled={submitting || !form.issueType}
                style={{ flex: 2 }}
              >
                {submitting ? (
                  // Spinner shown while API call is in progress
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 14, height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block'
                    }}/>
                    Submitting...
                  </span>
                ) : '✓ Submit Complaint'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Hint text below the card ── */}
      {/* Guides the user on what to do at each step */}
      <p style={{
        textAlign: 'center', marginTop: 16,
        fontSize: 12, color: 'var(--text-faint)'
      }}>
        Step {step} of {STEPS.length}
        {step === 1 && ' — Click a card to continue'}
        {step === 2 && ' — Press Enter to continue'}
        {step === 3 && ' — Select the issue type above'}
      </p>

    </div>
  );
}
