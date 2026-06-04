import React, { useState } from 'react';
import { LINKEDIN_PROFILE, LINKEDIN_URL } from '../data/linkedinProfile';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'network', label: 'Network' },
];

const ProfilePhoto = ({ className = '', size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`linkedin9-photo linkedin9-photo--fallback linkedin9-photo--${size} ${className}`}>
        TR
      </div>
    );
  }
  return (
    <img
      src={LINKEDIN_PROFILE.photo}
      alt={LINKEDIN_PROFILE.name}
      className={`linkedin9-photo linkedin9-photo--${size} ${className}`}
      onError={() => setFailed(true)}
    />
  );
};

const OrgLogo = ({ logo, label, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!logo || failed) {
    return (
      <div className="linkedin9-org-logo linkedin9-org-logo--fallback" aria-hidden="true">
        {(label || alt || '?').slice(0, 3).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={logo}
      alt=""
      className="linkedin9-org-logo"
      onError={() => setFailed(true)}
      aria-hidden="true"
    />
  );
};

const OverviewTab = () => (
  <div className="linkedin9-pane">
    <fieldset className="linkedin9-fieldset">
      <legend>Summary</legend>
      <p className="linkedin9-about">{LINKEDIN_PROFILE.about}</p>
    </fieldset>
    <fieldset className="linkedin9-fieldset">
      <legend>Top skills</legend>
      <div className="linkedin9-skill-grid">
        {LINKEDIN_PROFILE.skills.slice(0, 10).map((skill) => (
          <span key={skill} className="linkedin9-skill-chip">
            {skill}
          </span>
        ))}
      </div>
    </fieldset>
    <fieldset className="linkedin9-fieldset">
      <legend>Certifications</legend>
      <ul className="linkedin9-cert-list">
        {LINKEDIN_PROFILE.certifications.map((cert) => (
          <li key={cert.name} className="linkedin9-cert-row">
            <OrgLogo logo={cert.logo} label={cert.issuer} alt={cert.issuer} />
            <div>
              <strong>{cert.name}</strong>
              <div className="linkedin9-list-date">
                {cert.issuer} · {cert.issued}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </fieldset>
    <fieldset className="linkedin9-fieldset">
      <legend>Languages</legend>
      <table className="linkedin9-table">
        <tbody>
          {LINKEDIN_PROFILE.languages.map((lang) => (
            <tr key={lang.name}>
              <td className="linkedin9-table-label">{lang.name}</td>
              <td>{lang.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  </div>
);

const ExperienceTab = () => (
  <div className="linkedin9-pane">
    <p className="linkedin9-meta-line">
      Total experience: <strong>{LINKEDIN_PROFILE.experienceYears}</strong>
    </p>
    <ul className="linkedin9-exp-list">
      {LINKEDIN_PROFILE.experience.map((job) => (
        <li key={job.id} className="linkedin9-exp-card">
          <OrgLogo logo={job.logo} label={job.logoLabel || job.company} alt={job.company} />
          <div className="linkedin9-exp-body">
            <div className="linkedin9-list-head">
              <strong className="linkedin9-exp-title">{job.title}</strong>
              {job.current && <span className="linkedin9-pill">Current</span>}
            </div>
            <div className="linkedin9-exp-company">{job.company}</div>
            <div className="linkedin9-list-date">
              {job.period}
              {job.location ? ` · ${job.location}` : ''}
            </div>
            <p className="linkedin9-list-desc">{job.summary}</p>
            {job.url && (
              <a
                className="linkedin9-inline-link"
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {job.url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const EducationTab = () => (
  <div className="linkedin9-pane">
    {LINKEDIN_PROFILE.education.map((edu) => (
      <div key={edu.school} className="linkedin9-edu-hero">
        <OrgLogo logo={edu.logo} label="UCF" alt={edu.school} />
        <div>
          <h3 className="linkedin9-edu-school">{edu.school}</h3>
          <div className="linkedin9-exp-company">{edu.degree}</div>
          <div className="linkedin9-list-date">
            {edu.period} · {edu.location}
          </div>
        </div>
      </div>
    ))}
    <h3 className="linkedin9-pane-title">Also certified in</h3>
    <div className="linkedin9-badge-row">
      {LINKEDIN_PROFILE.certifications.map((cert) => (
        <div key={cert.name} className="linkedin9-badge" title={cert.name}>
          <OrgLogo logo={cert.logo} label={cert.issuer} alt={cert.issuer} />
          <span>{cert.issuer}</span>
        </div>
      ))}
    </div>
  </div>
);

const NetworkTab = () => (
  <div className="linkedin9-pane">
    <p className="linkedin9-meta-line">
      <strong>{LINKEDIN_PROFILE.followers}</strong> followers ·{' '}
      <strong>{LINKEDIN_PROFILE.connections}</strong> connections
    </p>
    <ul className="linkedin9-feed">
      {LINKEDIN_PROFILE.activity.map((item) => (
        <li key={item.title} className="linkedin9-feed-card">
          <div className="linkedin9-feed-head">
            <ProfilePhoto size="xs" />
            <div>
              <strong>{LINKEDIN_PROFILE.name}</strong>
              <div className="linkedin9-feed-meta">
                <span className="linkedin9-activity-type">{item.type}</span>
                {item.date && <span> · {item.date}</span>}
              </div>
            </div>
          </div>
          <h4 className="linkedin9-feed-title">{item.title}</h4>
          <p>{item.excerpt}</p>
          {item.url && (
            <a
              className="linkedin9-inline-link"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on LinkedIn
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const TAB_PANELS = {
  overview: OverviewTab,
  experience: ExperienceTab,
  education: EducationTab,
  network: NetworkTab,
};

const LinkedInApp = () => {
  const [tab, setTab] = useState('overview');
  const Panel = TAB_PANELS[tab];

  return (
    <div className="mac-content-inner linkedin9">
      <div className="linkedin9-app">
        <div className="linkedin9-menubar" aria-hidden="true">
          <span className="linkedin9-menu-item linkedin9-menu-item--bold">LinkedIn</span>
          <span className="linkedin9-menu-item">File</span>
          <span className="linkedin9-menu-item">Profile</span>
          <span className="linkedin9-menu-item">Search</span>
          <span className="linkedin9-menu-item">Connect</span>
        </div>

        <div className="linkedin9-urlbar">
          <span className="linkedin9-url-label">Address</span>
          <div className="linkedin9-url-field">{LINKEDIN_PROFILE.profileUrl}</div>
          <a
            className="retro-mac-btn linkedin9-go-btn"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go
          </a>
        </div>

        <header className="linkedin9-web-header">
          <div className="linkedin9-in-logo" aria-hidden="true">
            in
          </div>
          <p className="linkedin9-tagline">Your network is bigger than you think.</p>
        </header>

        <section className="linkedin9-hero">
          <ProfilePhoto size="lg" className="linkedin9-hero-photo" />
          <div className="linkedin9-hero-info">
            <h1 className="linkedin9-name">{LINKEDIN_PROFILE.name}</h1>
            <p className="linkedin9-headline">{LINKEDIN_PROFILE.headline}</p>
            <p className="linkedin9-location">{LINKEDIN_PROFILE.location}</p>
            <div className="linkedin9-stat-chips">
              <span className="linkedin9-stat-chip">
                <strong>{LINKEDIN_PROFILE.connections}</strong> connections
              </span>
              <span className="linkedin9-stat-chip">
                <strong>{LINKEDIN_PROFILE.followers}</strong> followers
              </span>
            </div>
            <a
              className="retro-mac-btn linkedin9-connect-btn"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View full profile
            </a>
          </div>
        </section>

        <div className="linkedin9-workspace">
          <div className="linkedin9-tabs" role="tablist" aria-label="Profile sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`linkedin9-tab${tab === t.id ? ' linkedin9-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="linkedin9-scroll" role="tabpanel">
            <Panel />
          </div>
        </div>

        <footer className="linkedin9-statusbar">
          <span>Mac OS 9 viewer · fan tribute · not affiliated with LinkedIn</span>
          <span>{LINKEDIN_PROFILE.experienceYears} experience</span>
        </footer>
      </div>
    </div>
  );
};

export default LinkedInApp;
