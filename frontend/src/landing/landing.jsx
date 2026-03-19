import React, { useState } from 'react';
import './landing.css';

export default function Landing({ onLogout }) {
  const [activeTab, setActiveTab] = useState('objectives');
  const [expandedTutorial, setExpandedTutorial] = useState(0);

  const objectives = [
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Monitor system performance and user activity with comprehensive real-time dashboards and detailed reports.'
    },
    {
      icon: '🔒',
      title: 'Enhanced Security',
      description: 'Enterprise-grade security features with role-based access control and advanced authentication mechanisms.'
    },
    {
      icon: '📱',
      title: 'Mobile Integration',
      description: 'Seamless mobile application integration with full feature parity and offline capabilities.'
    },
    {
      icon: '⚡',
      title: 'Performance Optimization',
      description: 'Lightning-fast response times and optimized resource utilization for maximum efficiency.'
    },
    {
      icon: '🎯',
      title: 'User-Centric Design',
      description: 'Intuitive interface designed with user experience at the forefront for easy adoption.'
    },
    {
      icon: '🔄',
      title: 'Seamless Integration',
      description: 'Easy integration with existing systems and third-party services through robust APIs.'
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with the Mobile App',
      description: 'Learn the basics of navigating the mobile application interface',
      steps: [
        'Download the app from your device\'s app store',
        'Create or log in with your admin credentials',
        'Explore the main dashboard and navigation menu',
        'Customize your profile and preferences'
      ],
      image: '📲'
    },
    {
      id: 2,
      title: 'Managing User Accounts',
      description: 'How to create, edit, and manage user accounts in the system',
      steps: [
        'Navigate to the Users section from the main menu',
        'Click "Add New User" to create a new account',
        'Fill in user details and assign appropriate roles',
        'Set permissions and access levels',
        'Save and confirm the new user account'
      ],
      image: '👥'
    },
    {
      id: 3,
      title: 'Viewing Analytics & Reports',
      description: 'Access and interpret system analytics and generate custom reports',
      steps: [
        'Go to the Analytics section from the dashboard',
        'Select your desired date range and metrics',
        'Choose visualization type (charts, tables, etc.)',
        'Export reports in multiple formats (PDF, CSV, Excel)',
        'Schedule automated report delivery'
      ],
      image: '📈'
    },
    {
      id: 4,
      title: 'System Configuration',
      description: 'Configure system settings and preferences for optimal performance',
      steps: [
        'Access Settings from the admin menu',
        'Configure general system preferences',
        'Set up notification rules and alerts',
        'Manage API keys and integrations',
        'Review and update security settings'
      ],
      image: '⚙️'
    },
    {
      id: 5,
      title: 'Mobile App Features',
      description: 'Explore advanced features available in the mobile application',
      steps: [
        'Access offline mode for uninterrupted service',
        'Use push notifications for real-time updates',
        'Sync data across multiple devices',
        'Use biometric authentication for security',
        'Access advanced filtering and search options'
      ],
      image: '🚀'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">System</h1>
            <p className="tagline">Admin Dashboard</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Welcome to Our System</h2>
          <p className="hero-subtitle">
            A powerful, intuitive platform designed for administrators and super admins to manage and monitor operations efficiently.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Scalability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="tabs-section">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'objectives' ? 'active' : ''}`}
            onClick={() => setActiveTab('objectives')}
          >
            <span className="tab-icon">🎯</span>
            System Objectives
          </button>
          <button
            className={`tab-button ${activeTab === 'tutorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorial')}
          >
            <span className="tab-icon">📚</span>
            UI Tutorial
          </button>
        </div>
      </section>

      {/* Content Sections */}
      <main className="content-section">
        {/* Objectives Section */}
        {activeTab === 'objectives' && (
          <section className="objectives-section">
            <div className="section-header">
              <h3 className="section-title">System Objectives</h3>
              <p className="section-description">
                Our system is built with the following core objectives to ensure optimal performance and user satisfaction.
              </p>
            </div>

            <div className="objectives-grid">
              {objectives.map((objective, index) => (
                <div key={index} className="objective-card">
                  <div className="objective-icon">{objective.icon}</div>
                  <h4 className="objective-title">{objective.title}</h4>
                  <p className="objective-description">{objective.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tutorial Section */}
        {activeTab === 'tutorial' && (
          <section className="tutorial-section">
            <div className="section-header">
              <h3 className="section-title">Mobile App UI Tutorial</h3>
              <p className="section-description">
                Learn how to use our mobile application with these comprehensive step-by-step guides.
              </p>
            </div>

            <div className="tutorials-container">
              {tutorials.map((tutorial, index) => (
                <div
                  key={tutorial.id}
                  className={`tutorial-card ${expandedTutorial === index ? 'expanded' : ''}`}
                >
                  <div
                    className="tutorial-header"
                    onClick={() => setExpandedTutorial(expandedTutorial === index ? -1 : index)}
                  >
                    <div className="tutorial-header-content">
                      <span className="tutorial-image">{tutorial.image}</span>
                      <div className="tutorial-info">
                        <h4 className="tutorial-title">{tutorial.title}</h4>
                        <p className="tutorial-description">{tutorial.description}</p>
                      </div>
                    </div>
                    <span className={`expand-icon ${expandedTutorial === index ? 'rotated' : ''}`}>
                      ▼
                    </span>
                  </div>

                  {expandedTutorial === index && (
                    <div className="tutorial-content">
                      <ol className="tutorial-steps">
                        {tutorial.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="tutorial-step">
                            <span className="step-number">{stepIndex + 1}</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 System. All rights reserved. | Admin & Super Admin Access Only
          </p>
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <a href="#support" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
