import React, { useState } from 'react';
import './login.css';

export default function Login({ onLoginSuccess }) {
  const [currentView, setCurrentView] = useState('login'); // login, signup, forgot-password
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (currentView === 'login') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }

    if (currentView === 'signup') {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentView === 'forgot-password') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (currentView === 'login') {
        // Check if user is Admin or Super Admin
        // This is a mock check - replace with actual API call
        const isAdminOrSuperAdmin = formData.email.includes('admin') || formData.email.includes('superadmin');
        
        if (!isAdminOrSuperAdmin) {
          setErrors({ submit: 'Access denied. Only Admin and Super Admin users can log in.' });
          setLoading(false);
          return;
        }

        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          // Store user session
          localStorage.setItem('userSession', JSON.stringify({
            email: formData.email,
            role: formData.email.includes('superadmin') ? 'Super Admin' : 'Admin',
            loginTime: new Date().toISOString()
          }));
          
          // Call the callback to redirect to landing page
          if (onLoginSuccess) {
            onLoginSuccess({
              email: formData.email,
              role: formData.email.includes('superadmin') ? 'Super Admin' : 'Admin'
            });
          }
        }, 1500);
      } else if (currentView === 'signup') {
        setErrors({ submit: 'Sign up is disabled. Only Admin and Super Admin accounts can access this system.' });
        setLoading(false);
      } else if (currentView === 'forgot-password') {
        setSuccessMessage('Password reset link sent to your email!');
        setTimeout(() => {
          setCurrentView('login');
          setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    // Simulate social login
    setTimeout(() => {
      setSuccessMessage(`Logging in with ${provider}...`);
      setTimeout(() => {
        console.log(`Redirect via ${provider}`);
        setLoading(false);
      }, 1000);
    }, 500);
  };

  const switchView = (view) => {
    setCurrentView(view);
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Auth</h1>
          <p className="login-subtitle">
            {currentView === 'login' && 'Welcome back'}
            {currentView === 'signup' && 'Create your account'}
            {currentView === 'forgot-password' && 'Reset your password'}
          </p>
        </div>

        {/* Form Container */}
        <div className={`form-container ${currentView}`}>
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name - Signup Only */}
            {currentView === 'signup' && (
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password */}
            {currentView !== 'forgot-password' && (
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            )}

            {/* Confirm Password - Signup Only */}
            {currentView === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            {/* Forgot Password Link - Login Only */}
            {currentView === 'login' && (
              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="forgot-password-link"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && <div className="error-banner">{errors.submit}</div>}

            {/* Success Message */}
            {successMessage && <div className="success-banner">{successMessage}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {currentView === 'login' && 'Signing in...'}
                  {currentView === 'signup' && 'Creating account...'}
                  {currentView === 'forgot-password' && 'Sending link...'}
                </>
              ) : (
                <>
                  {currentView === 'login' && 'Sign In'}
                  {currentView === 'signup' && 'Create Account'}
                  {currentView === 'forgot-password' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Social Login - Login and Signup Only */}
          {currentView !== 'forgot-password' && (
            <>
              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-button email-button"
                  onClick={() => handleSocialLogin('Email')}
                  disabled={loading}
                  title="Continue with Email"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  className="social-button facebook-button"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={loading}
                  title="Continue with Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Toggle View Links */}
          <div className="toggle-view">
            {currentView === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('signup')}
                  className="toggle-link"
                >
                  Sign up
                </button>
              </p>
            )}

            {currentView === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="toggle-link"
                >
                  Sign in
                </button>
              </p>
            )}

            {currentView === 'forgot-password' && (
              <p>
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="toggle-link"
                >
                  Back to sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
