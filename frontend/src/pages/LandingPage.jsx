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

// Footer link groups (multi-column layout, similar to the Smart reference)
const FOOTER_GROUPS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'About', href: '#about' },
      { label: 'Mobile App', href: '#about' },
      { label: 'Pricing', href: '#' },
      { label: 'What\u2019s New', href: '#' },
    ],
  },
  {
    heading: 'For Sellers',
    links: [
      { label: 'Seller Dashboard', href: '/login' },
      { label: 'List a Product', href: '/login' },
      { label: 'Order Management', href: '/login' },
      { label: 'Analytics', href: '/login' },
      { label: 'Become a Seller', href: '/register' },
    ],
  },
  {
    heading: 'For Buyers',
    links: [
      { label: 'Marketplace', href: '#' },
      { label: 'Track Order', href: '#' },
      { label: 'Payment Methods', href: '#' },
      { label: 'Delivery Areas', href: '#' },
      { label: 'Buyer Support', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press Kit', href: '#' },
      { label: 'Partnerships', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Use', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Sitemap', href: '#' },
    ],
  },
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

  const handleFooterLink = (href) => (e) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
    // Hash links (#about, #features, #) fall through to default browser behavior
  };

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

      {/* HERO — simplified: no dashboard window mock, no redundant Log In/Sign Up buttons */}
      <section className="lp-hero lp-hero-simple" ref={heroRef}>
        <div className="lp-hero-bg">
          <div className="lp-orb lp-orb1" />
          <div className="lp-orb lp-orb2" />
          <div className="lp-orb lp-orb3" />
        </div>
        <div className="lp-hero-content lp-hero-content-centered">
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

      {/* ABOUT — text on left, QR placeholder on right (replaces stacked admin-cards visual) */}
      <section className="lp-about" id="about">
        <div className="lp-section-inner lp-about-inner">
          <div className="lp-about-text animate-on-scroll">
            <span className="lp-section-badge">About</span>
            <h2 className="lp-section-title">Get the AgriFair Mobile App</h2>
            <p>
              AgriFair bridges the gap between field operations and administrative oversight.
              Scan the QR code to download the companion mobile app and start managing
              your fair on the go.
            </p>
            {/* "Sign In Now →" button removed — redundant with the nav CTA */}
          </div>

          <div className="lp-about-visual animate-on-scroll">
            <div className="lp-qr-card">
              <div className="lp-qr-phone">
                <div className="lp-qr-phone-screen">
                  <div className="lp-qr-phone-icon">🌾</div>
                  <div className="lp-qr-phone-label">AGRIFAIR</div>
                </div>
              </div>

              <div className="lp-qr-right">
                <h3 className="lp-qr-heading">Download AgriFair Now!</h3>
                <div className="lp-qr-code" aria-label="QR code placeholder">
                  {/* Pure-CSS placeholder QR (decorative). Replace with a real QR image when ready. */}
                  <div className="lp-qr-code-pattern">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <span key={i} className={`lp-qr-cell ${i % 3 === 0 || i % 5 === 0 ? 'on' : ''}`} />
                    ))}
                  </div>
                  <div className="lp-qr-corner lp-qr-corner-tl" />
                  <div className="lp-qr-corner lp-qr-corner-tr" />
                  <div className="lp-qr-corner lp-qr-corner-bl" />
                  <div className="lp-qr-corner lp-qr-corner-br" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <div className="lp-cta-inner animate-on-scroll">
          <h2>Ready to manage your fair?</h2>
          <p>Sign in with your admin credentials to get started.</p>
          <div className="lp-hero-actions lp-hero-actions-centered">
            <button className="lp-btn-white" onClick={() => navigate('/login')}>
              Log In <span>→</span>
            </button>
            <button className="lp-btn-outline-white" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER — expanded with multiple link columns (inspired by reference image) */}
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <div className="lp-footer-inner">
            {/* Left: brand + tagline + socials */}
            <div className="lp-footer-brand">
              <div className="lp-logo">
                <span className="lp-logo-icon">🌿</span>
                <span className="lp-logo-text">AgriFair</span>
              </div>
              <p className="lp-footer-tagline">
                AgriFair connects farmers, traders, and administrators in one trusted
                marketplace for the agricultural community.
              </p>
              <div className="lp-footer-socials" aria-label="Social media links">
                <a href="#" aria-label="Facebook"   className="lp-footer-social">f</a>
                <a href="#" aria-label="X / Twitter" className="lp-footer-social">𝕏</a>
                <a href="#" aria-label="Instagram"  className="lp-footer-social">◎</a>
                <a href="#" aria-label="YouTube"    className="lp-footer-social">▶</a>
                <a href="#" aria-label="LinkedIn"   className="lp-footer-social">in</a>
                <a href="#" aria-label="TikTok"     className="lp-footer-social">♪</a>
              </div>
            </div>

            {/* Right: link columns */}
            <div className="lp-footer-grid">
              {FOOTER_GROUPS.map((group) => (
                <div className="lp-footer-col" key={group.heading}>
                  <h4 className="lp-footer-heading">{group.heading}</h4>
                  <ul className="lp-footer-list">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={handleFooterLink(link.href)}
                          className="lp-footer-link"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lp-footer-mid">
          <div className="lp-footer-mid-inner">
            <a href="#" className="lp-footer-mid-link">Marketplace</a>
            <span className="lp-footer-mid-sep">|</span>
            <a href="#" className="lp-footer-mid-link">Blog</a>
            <span className="lp-footer-mid-sep">|</span>
            <a href="#" className="lp-footer-mid-link">Events &amp; Fairs</a>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <div className="lp-footer-bottom-inner">
            <p className="lp-footer-copy">© 2025 AgriFair. Capstone Project. All rights reserved.</p>
            <div className="lp-footer-legal">
              <a href="#">Terms of Use</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Careers</a>
              <a href="#">About Us</a>
              <a href="#">Contact Us</a>
              <a href="#">Our Network</a>
              <a href="#">Store Locator</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
