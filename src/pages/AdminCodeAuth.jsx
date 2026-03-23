import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function AdminCodeAuth() {
  const navigate = useNavigate();
  const { pendingAdmin, verifyAdminCode, clearPendingAdminChallenge } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrorMessage('');

      await verifyAdminCode(accessCode.trim());
      toast.success('Admin access verified.');
      navigate('/admin', { replace: true });
    } catch (error) {
      const message = error.message || 'Unable to verify admin access code.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    clearPendingAdminChallenge();
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          flex: 1,
          display: window.innerWidth <= 640 ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 64px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background:
                'linear-gradient(135deg, var(--indigo), var(--violet))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              color: 'white',
              marginBottom: 20,
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}
          >
            G
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 38,
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              letterSpacing: '-0.8px',
              marginBottom: 16,
            }}
          >
            Admin access,
            <br />
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--indigo), var(--violet))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              one more secure step.
            </span>
          </h1>

          <p
            style={{
              fontSize: 15,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: 380,
            }}
          >
            Your Google account is verified. Enter the unique admin code to
            open the staff panel.
          </p>
        </div>
      </div>

      <div
        style={{
          width: window.innerWidth <= 640 ? '100%' : 460,
          minHeight: window.innerWidth <= 640 ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: window.innerWidth <= 640 ? '40px 24px' : '60px 48px',
          borderLeft: window.innerWidth <= 640 ? 'none' : '1px solid var(--border)',
          background: 'rgba(30,41,59,0.4)',
          backdropFilter: 'blur(20px)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(24px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
        }}
      >
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 8,
                letterSpacing: '-0.3px',
              }}
            >
              Verify admin access
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}
            >
              Continue as <strong>{pendingAdmin?.user?.email}</strong>
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                background: 'var(--danger-bg)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 20,
                fontSize: 13,
                color: 'var(--danger)',
                lineHeight: 1.5,
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="accessCode">Admin Access Code</label>
              <input
                id="accessCode"
                type="password"
                placeholder="Enter the unique admin code"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleBackToLogin}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !accessCode.trim()}
                style={{ flex: 2 }}
              >
                {submitting ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: 28,
              fontSize: 12,
              color: 'var(--text-faint)',
            }}
          >
            This extra step protects the admin panel from student logins on the
            same college domain.
          </p>
        </div>
      </div>
    </div>
  );
}
