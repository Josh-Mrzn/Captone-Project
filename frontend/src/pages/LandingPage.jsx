import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  {
    icon: '🌾',
    title: 'Real-time Analytics',
    desc: 'Monitor agricultural data streams and fair activity with live dashboards.',
  },
  {
    icon: '🔒',
    title: 'Secure Access',
    desc: 'Role-based control ensures only authorized admins manage the system.',
  },
  {
    icon: '📱',
    title: 'Mobile Integration',
    desc: 'Seamlessly syncs with the companion mobile app for field use.',
  },
  {
    icon: '📊',
    title: 'Performance Reports',
    desc: 'Generate detailed reports on fair performance and user engagement.',
  },
  {
    icon: '👥',
    title: 'User Management',
    desc: 'Manage participants, vendors, and staff accounts from one place.',
  },
  {
    icon: '⚙️',
    title: 'Easy Configuration',
    desc: 'Configure system settings, schedules, and modules with ease.',
  },
];

const STATS = [
  { value: '500+', label: 'Registered Users' },
  { value: '120+', label: 'Events Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-root">
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <span className="lp-logo-icon">🌿</span>
            <span className="lp-logo-text">AgriFair</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button className="lp-nav-cta" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-bg">
          <div className="lp-orb lp-orb1" />
          <div className="lp-orb lp-orb2" />
          <div className="lp-orb lp-orb3" />
        </div>
        <div className="lp-hero-content">
          <div className="lp-hero-badge">Admin Management System</div>
          <h1 className="lp-hero-title">
            Manage Your
            <br />
            <span className="lp-hero-accent">Agricultural Fair</span>
            <br />
            With Confidence
          </h1>
          <p className="lp-hero-sub">
            A centralized platform for admins to oversee events, users, analytics,
            and mobile integrations — all in one place.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={() => navigate('/login')}>
              Get Started
              <span>→</span>
            </button>
            <button className="lp-btn-ghost" onClick={() => navigate('/register')}>
              Request Access
            </button>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-dashboard-mock">
            <div className="lp-mock-header">
              <span className="lp-mock-dot red" />
              <span className="lp-mock-dot yellow" />
              <span className="lp-mock-dot green" />
              <span className="lp-mock-title">Dashboard</span>
            </div>
            <div className="lp-mock-body">
              <div className="lp-mock-stat-row">
                {['Users', 'Events', 'Revenue'].map((s, i) => (
                  <div className="lp-mock-stat" key={s}>
                    <div className="lp-mock-stat-bar" style={{ height: `${40 + i * 18}px` }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div className="lp-mock-lines">
                {[...Array(4)].map((_, i) => (
                  <div className="lp-mock-line" key={i} style={{ width: `${85 - i * 15}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          {STATS.map((s) => (
            <div className="lp-stat-item animate-on-scroll" key={s.label}>
              <span className="lp-stat-value">{s.value}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-header animate-on-scroll">
            <span className="lp-section-badge">Features</span>
            <h2 className="lp-section-title">Everything You Need</h2>
            <p className="lp-section-sub">
              Built for agricultural fair administrators who need power, speed, and clarity.
            </p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <div
                className="lp-feature-card animate-on-scroll"
                key={f.title}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="lp-about" id="about">
        <div className="lp-section-inner lp-about-inner">
          <div className="lp-about-text animate-on-scroll">
            <span className="lp-section-badge">About</span>
            <h2 className="lp-section-title">Built for AgriTech Admins</h2>
            <p>
              AgriFair Admin is a capstone project designed to streamline the management
              of agricultural fairs and events. The platform bridges the gap between
              field operations (via mobile) and administrative oversight (via web).
            </p>
            <p>
              With role-based access, only authorized administrators can log in, ensuring
              the integrity of your event data.
            </p>
            <button className="lp-btn-primary" onClick={() => navigate('/login')}>
              Sign In Now <span>→</span>
            </button>
          </div>
          <div className="lp-about-visual animate-on-scroll">
            <div className="lp-about-card">
              <div className="lp-about-card-icon">🌱</div>
              <h3>Admin Portal</h3>
              <p>Full system control for super admins and event managers.</p>
            </div>
            <div className="lp-about-card lp-about-card-offset">
              <div className="lp-about-card-icon">📲</div>
              <h3>Mobile Companion</h3>
              <p>Field officers use the mobile app, synced in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <div className="lp-cta-inner animate-on-scroll">
          <h2>Ready to manage your fair?</h2>
          <p>Sign in with your admin credentials to get started.</p>
          <div className="lp-hero-actions">
            <button className="lp-btn-white" onClick={() => navigate('/login')}>
              Sign In <span>→</span>
            </button>
            <button className="lp-btn-outline-white" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">
            <span className="lp-logo-icon">🌿</span>
            <span className="lp-logo-text">AgriFair</span>
          </div>
          <p className="lp-footer-copy">© 2025 AgriFair. Capstone Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
