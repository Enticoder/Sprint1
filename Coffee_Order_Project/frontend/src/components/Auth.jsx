// Authentication page component
// Provides Google OAuth sign-in and manual login placeholder
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import CoffeeCarousel from "../index.jsx";
import "./Auth.css";

// Backend base URL for auth endpoints
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

  async function fakeRequest(payload) {
    await new Promise((res) => setTimeout(res, 650));
    return { 
      ok: true, 
      message: `${mode === "login" ? "Welcome back" : "Account created"}!`,
      user: {
        email: payload.email,
        name: payload.name || email.split('@')[0],
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(email)) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup" && name.trim().length < 2) return setError("Please enter your name.");

    setLoading(true);
    try {
      const res = await fakeRequest({ email, password, name, mode });
      if (res.ok) {
        setSuccess(res.message);
        login(res.user);
        setTimeout(() => navigate('/'), 1000);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSuccess(credentialResponse) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");
      setSuccess(`Welcome ${data.user?.name || ""}! Logged in with Google.`);
      login(data.user);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  function onGoogleError() {
    setError("Google login popup closed or failed.");
  }

  return (
    <div className="auth-page theme-orange">
      <div className="container">
        <div className="left-panel">
          <div className="brand-row">
            <div className="brand-logo">B</div>
            <div>
              <h1 className="brand-title">Breakfasted</h1>
              <p className="brand-sub">Welcome back! please enter your details.</p>
            </div>
          </div>

          <div className="row between" style={{ marginBottom: 10 }}>
            <div className="tabs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                className="ghost"
                style={{ background: mode === "login" ? "#fff" : undefined, borderColor: mode === "login" ? "var(--primary2)" : undefined }}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className="ghost"
                style={{ background: mode === "signup" ? "#fff" : undefined, borderColor: mode === "signup" ? "var(--primary2)" : undefined }}
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="field">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@domain.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            </div>

            <div className="row between">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="link">Forgot password</button>
            </div>

            <button className="primary" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <div className="divider"><span>or continue</span></div>

          <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} width="336" theme="filled_blue" shape="rect" text="continue_with" />

          <p className="brand-sub" style={{ marginTop: 10 }}>
            Not a member yet? <button className="link" onClick={() => setMode("signup")}>Sign up</button>
          </p>
        </div>

        <div className="right-panel">
          <div className="media">
            <CoffeeCarousel />

            <div className="rating">
              <div className="rating-title">Enjoy our coffee?</div>
              <div className="rating-row">
                <div className="score">4.8</div>
                <button className="ghost">Leave a review</button>
              </div>
            </div>

            <div className="reviews">
              {["A", "L", "M"].map((ch, i) => (
                <div key={i} className="review">
                  <div className="review-header">
                    <div className="avatar">{ch}</div>
                    <div>
                      <div className="review-name">Guest {i + 1}</div>
                      <div className="review-meta">5 ★ • 2 days ago</div>
                    </div>
                  </div>
                  <div className="review-body">
                    Love the aroma, great staff, and cozy seating.
                  </div>
                  <div className="review-actions">Helpful • Share</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}