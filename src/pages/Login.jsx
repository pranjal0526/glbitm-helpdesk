import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  ALLOWED_DOMAIN,
  getApiErrorMessage,
  GOOGLE_CLIENT_ID,
} from "../utils/api";

const CREATORS = [
  {
    name: "Pranjal Pandey",
    role: "Handled the backend",
    initials: "PP",
    surface: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.18)",
    glow: "linear-gradient(135deg, rgba(56,189,248,0.24), rgba(59,130,246,0.08))",
  },
  {
    name: "Keshav Gupta",
    role: "Handled the front end",
    initials: "KG",
    surface: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.18)",
    glow: "linear-gradient(135deg, rgba(167,139,250,0.24), rgba(236,72,153,0.08))",
  },
];

function CreatorSection({ compact = false }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: compact ? 20 : 38,
        padding: compact ? "16px" : "18px 18px 16px",
        borderRadius: 18,
        background:
          "linear-gradient(160deg, rgba(15,23,42,0.84), rgba(30,41,59,0.72))",
        border: "1px solid rgba(148,163,184,0.16)",
        boxShadow: "0 18px 48px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -20,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -20,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            borderRadius: 999,
            marginBottom: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 11 }}>✦</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(226,232,240,0.82)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Creators
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: compact ? 17 : 20,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.3px",
                marginBottom: 6,
              }}
            >
              Built by the minds behind the system
            </h3>
            <p
              style={{
                fontSize: compact ? 12 : 13,
                color: "rgba(226,232,240,0.76)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: compact ? "100%" : 420,
              }}
            >
              A collaborative build where backend reliability meets frontend
              polish.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
            gap: 12,
          }}
        >
          {CREATORS.map((creator) => (
            <div
              key={creator.name}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: compact ? "13px 14px" : "14px",
                borderRadius: 15,
                background: creator.surface,
                border: `1px solid ${creator.border}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: creator.glow,
                  opacity: 0.8,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, rgba(15,23,42,0.86), rgba(51,65,85,0.9))",
                      border: "1px solid rgba(255,255,255,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {creator.initials}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: compact ? 14 : 15,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 3,
                      }}
                    >
                      {creator.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(226,232,240,0.76)",
                        lineHeight: 1.5,
                      }}
                    >
                      {creator.role}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: compact ? 11.5 : 12.5,
                    color: "rgba(241,245,249,0.86)",
                    lineHeight: 1.6,
                  }}
                >
                  {creator.name === "Pranjal Pandey"
                    ? "Designed the backend flow, authentication, APIs, and data layer."
                    : "Shaped the frontend experience, interactions, and visual design language."}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(148,163,184,0.12)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: "#fda4af" }}>♥</span>
          <span
            style={{
              fontSize: compact ? 12 : 13,
              color: "rgba(241,245,249,0.84)",
              letterSpacing: "0.02em",
            }}
          >
            Made with Love in Noida
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      const message = "Google login did not return a credential token.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    try {
      setSigningIn(true);
      setErrorMessage("");

      const result = await loginWithGoogle(credentialResponse.credential);

      if (result.requiresAdminCode) {
        toast.success("Google account verified. Enter your admin access code.");
        navigate("/admin-access", { replace: true });
        return;
      }

      toast.success("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to sign in with Google right now."
      );

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSigningIn(false);
    }
  };

  const googleConfigured = Boolean(GOOGLE_CLIENT_ID);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          ...(window.innerWidth <= 640 ? { display: "none" } : {}),
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-24px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, var(--indigo), var(--violet))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "white",
              marginBottom: 20,
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            G
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 38,
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.15,
              letterSpacing: "-0.8px",
              marginBottom: 16,
            }}
          >
            Campus issues,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--indigo), var(--violet))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              resolved fast.
            </span>
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "var(--text-muted)",
              lineHeight: 1.7,
              maxWidth: 380,
            }}
          >
            The official maintenance helpdesk for GLBITM, Greater Noida.
            Report hostel or classroom issues and track them in real time.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "⚡", text: "Admin notified instantly on every complaint" },
            { icon: "📍", text: "Track your complaint status in real time" },
            { icon: "🔒", text: "Restricted to approved Google accounts only" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(-16px)",
                transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  flexShrink: 0,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            ...(window.innerWidth <= 640 ? { display: "none" } : {}),
          }}
        >
          <CreatorSection />
        </div>
      </div>

      <div style={{
        width: window.innerWidth <= 640 ? '100%' : 460,
        minHeight: window.innerWidth <= 640 ? '100vh' : 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: window.innerWidth <= 640 ? '40px 24px' : '60px 48px',
        borderLeft: window.innerWidth <= 640 ? 'none' : '1px solid var(--border)',
        background: 'rgba(30,41,59,0.4)',
        backdropFilter: 'blur(20px)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(24px)',
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8,
                letterSpacing: "-0.3px",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              Sign in with your approved Google account to continue.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                background: "var(--danger-bg)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "var(--danger)",
                lineHeight: 1.5,
                animation: "scaleIn 0.25s ease both",
              }}
            >
              {errorMessage}
            </div>
          )}

          {!googleConfigured && (
            <div
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "var(--warning)",
                lineHeight: 1.6,
              }}
            >
              Add <strong>REACT_APP_GOOGLE_CLIENT_ID</strong> to the frontend
              <code style={{ marginLeft: 4 }}>.env</code> file.
            </div>
          )}

          <div style={{ position: "relative", marginBottom: 16 }}>
            <button
              type="button"
              disabled={signingIn || !googleConfigured}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "13px 20px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text)",
                textDecoration: "none",
                transition: "all 0.18s ease",
                cursor: signingIn || !googleConfigured ? "not-allowed" : "pointer",
                opacity: signingIn ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (signingIn || !googleConfigured) {
                  return;
                }

                e.currentTarget.style.background = "var(--bg-hover)";
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-card)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {signingIn ? "Signing in..." : "Continue with Google"}
            </button>

            {googleConfigured && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.01,
                  overflow: "hidden",
                  pointerEvents: signingIn ? "none" : "auto",
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    const message = "Google sign-in failed. Please try again.";
                    setErrorMessage(message);
                    toast.error(message);
                  }}
                  width={window.innerWidth <= 640 ? 292 : 340}
                  theme="outline"
                  size="large"
                  text="continue_with"
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
              GLBITM ONLY
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
              🔒
            </span>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              This portal is exclusively for{" "}
              <strong style={{ color: "var(--info)" }}>@{ALLOWED_DOMAIN}</strong>{" "}
              students and staff. Admin accounts go through one extra access-code
              verification step after Google sign-in.
            </p>
          </div>

          {window.innerWidth <= 640 && <CreatorSection compact />}

          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: 12,
              color: "var(--text-faint)",
            }}
          >
            Having trouble? Contact your IT department.
          </p>
        </div>
      </div>
    </div>
  );
}
