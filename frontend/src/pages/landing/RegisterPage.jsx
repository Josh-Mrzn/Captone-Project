import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';
import { registerUser } from '../../services/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin', // ✅ auto assigned
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

    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) {
      errs.password = 'Minimum 6 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'Admin' // 🔥 forced backend role
      };

      await registerUser(payload);

      // ✅ SUCCESS ALERT
      showAlert('success', 'Account created successfully! Redirecting...');

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      // ❌ ERROR ALERT
      showAlert(
        'error',
        err.response?.data?.message || 'Registration failed'
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
          <h2>"Grow the system. Empower the fair."</h2>
          <p>Create an admin account to manage agricultural events.</p>
        </div>

        <p className="auth-left-foot">© 2025 AgriFair Capstone</p>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-header">
            <h1>Create Account</h1>
            <p>Register for admin access</p>
          </div>

          {/* 🔥 CUSTOM ALERT */}
          {alert.message && (
            <div className={`custom-alert ${alert.type}`}>
              {alert.message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* FULL NAME */}
            <div className={`auth-field ${errors.fullName ? 'has-error' : ''}`}>
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan dela Cruz"
                  disabled={loading}
                />
              </div>
              {errors.fullName && (
                <span className="auth-error-msg">{errors.fullName}</span>
              )}
            </div>

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
                  placeholder="admin@example.com"
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
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={`auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <span className="auth-error-msg">{errors.confirmPassword}</span>
              )}
            </div>

            {/* SUBMIT */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

          </form>

          <p className="auth-toggle">
            Already have an account?{' '}
            <Link to="/login" className="auth-toggle-link">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}