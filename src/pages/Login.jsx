import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Login() {
  const [params] = useSearchParams();
  const error = params.get('error');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Background glow orbs ── */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* ── Left panel — branding ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 64px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 22, color: 'white', marginBottom: 20,
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            animation: 'float 4s ease-in-out infinite'
          }}>G</div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 38, fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.15,
            letterSpacing: '-0.8px', marginBottom: 16
          }}>
            Campus issues,<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>resolved fast.</span>
          </h1>

          <p style={{
            fontSize: 15, color: 'var(--text-muted)',
            lineHeight: 1.7, maxWidth: 380
          }}>
            The official maintenance helpdesk for GLBIT Greater Noida.
            Report hostel or classroom issues and track them in real time.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '⚡', text: 'Admin notified instantly on every complaint' },
            { icon: '📍', text: 'Track your complaint status in real time' },
            { icon: '🔒', text: 'Restricted to @glbitm.ac.in accounts only' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s`
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16
              }}>{item.icon}</div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — login card ── */}
      <div style={{
        width: 460, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
        borderLeft: '1px solid var(--border)',
        background: 'rgba(30,41,59,0.4)',
        backdropFilter: 'blur(20px)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(24px)',
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>

        <div style={{ width: '100%', maxWidth: 340 }}>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24, fontWeight: 700,
              color: 'var(--text)', marginBottom: 8,
              letterSpacing: '-0.3px'
            }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Sign in with your college Google account to continue.
            </p>
          </div>

          {/* Error banner */}
          {error === 'domain' && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '12px 14px',
              marginBottom: 20, fontSize: 13,
              color: 'var(--danger)', lineHeight: 1.5,
              animation: 'scaleIn 0.25s ease both'
            }}>
              ⚠️ Only <strong>@glbitm.ac.in</strong> accounts are allowed.
              Please use your college Gmail.
            </div>
          )}

          {/* Google button */}
          <a href="/api/auth/google" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12,
            width: '100%', padding: '13px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12, fontSize: 14, fontWeight: 500,
            color: 'var(--text)', textDecoration: 'none',
            transition: 'all 0.18s ease',
            cursor: 'pointer', marginBottom: 16
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 12, marginBottom: 16
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>GLBITM ONLY</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Domain restriction notice */}
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', gap: 10, alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔒</span>
            <p style={{
              fontSize: 12, color: 'var(--text-muted)',
              lineHeight: 1.6, margin: 0
            }}>
              This portal is exclusively for <strong style={{ color: 'var(--info)' }}>@glbitm.ac.in</strong> students
              and staff. Personal Gmail accounts will be rejected.
            </p>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: 'center', marginTop: 28,
            fontSize: 12, color: 'var(--text-faint)'
          }}>
            Having trouble? Contact your IT department.
          </p>

        </div>
      </div>
    </div>
  );
}