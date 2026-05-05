import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';
import { loginUser } from '../../services/authApi';

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 CUSTOM ALERT STATE
  const [alert, setAlert] = useState({
    type: '',
    message: ''
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    const errs = {};

    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) {
      errs.password = 'Minimum 6 characters';
    }

    return errs;
  };

  // ================= CUSTOM ALERT =================
  const showAlert = (type, message) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 3000);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await loginUser(formData);

      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));

      // 🔥 SUCCESS ALERT
      showAlert('success', 'Login successful! Redirecting...');

      // Route by role returned from backend
      const role = (res.data.user?.role || '').toLowerCase();
      const target = role === 'superadmin' ? '/superadmin' : '/admin';

      setTimeout(() => {
        navigate(target);
      }, 1000);

    } catch (err) {
      // ❌ ERROR ALERT
      showAlert(
        'error',
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT */}
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <span>🌿</span> AgriFair
        </Link>

        <div className="auth-left-body">
          <h2>"Connecting farmers, traders, and administrators — one fair at a time."</h2>
          <p>Admin Portal · Secure Access · Role-Based Control</p>
        </div>

        <p className="auth-left-foot">© 2025 AgriFair Capstone</p>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Log in to your admin account</p>
          </div>

          {/* 🔥 CUSTOM ALERT */}
          {alert.message && (
            <div className={`custom-alert ${alert.type}`}>
              {alert.message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* EMAIL */}
            <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="auth-error-msg">{errors.email}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <span className="auth-error-msg">{errors.password}</span>
              )}

              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in…' : 'Log In'}
            </button>

          </form>

          <p className="auth-toggle">
            Don't have an account?{' '}
            <Link to="/register" className="auth-toggle-link">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}