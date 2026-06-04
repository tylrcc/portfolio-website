import React, { useState } from 'react';
import { LINKEDIN_PROFILE, LINKEDIN_URL } from '../data/linkedinProfile';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'more', label: 'Skills & More' },
];

const ProfileTab = () => (
  <div className="linkedin9-pane">
    <h3 className="linkedin9-pane-title">About</h3>
    <p className="linkedin9-about">{LINKEDIN_PROFILE.about}</p>
    <h3 className="linkedin9-pane-title">Recent activity</h3>
    <ul className="linkedin9-activity-list">
      {LINKEDIN_PROFILE.activity.map((item) => (
        <li key={item.title} className="linkedin9-activity-item">
          <span className="linkedin9-activity-type">{item.type}</span>
          <strong>{item.title}</strong>
          <p>{item.excerpt}</p>
        </li>
      ))}
    </ul>
  </div>
);

const ExperienceTab = () => (
  <div className="linkedin9-pane">
    <p className="linkedin9-meta-line">
      Total experience: <strong>{LINKEDIN_PROFILE.experienceYears}</strong>
    </p>
    <ul className="linkedin9-list">
      {LINKEDIN_PROFILE.experience.map((job) => (
        <li key={`${job.company}-${job.title}`} className="linkedin9-list-row">
          <div className="linkedin9-list-icon" aria-hidden="true">
            {job.current ? '▣' : '▢'}
          </div>
          <div className="linkedin9-list-body">
            <div className="linkedin9-list-head">
              <strong>{job.title}</strong>
              {job.current && <span className="linkedin9-pill">Current</span>}
            </div>
            <div className="linkedin9-list-sub">
              {job.company}
              {job.location ? ` · ${job.location}` : ''}
            </div>
            <div className="linkedin9-list-date">{job.period}</div>
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
    <ul className="linkedin9-list">
      {LINKEDIN_PROFILE.education.map((edu) => (
        <li key={edu.school} className="linkedin9-list-row">
          <div className="linkedin9-list-icon linkedin9-list-icon--edu" aria-hidden="true">
            E
          </div>
          <div className="linkedin9-list-body">
            <strong>{edu.school}</strong>
            <div className="linkedin9-list-sub">{edu.degree}</div>
            <div className="linkedin9-list-date">
              {edu.period} · {edu.location}
            </div>
          </div>
        </li>
      ))}
    </ul>
    <h3 className="linkedin9-pane-title">Licenses &amp; certifications</h3>
    <table className="linkedin9-table">
      <tbody>
        {LINKEDIN_PROFILE.certifications.map((cert) => (
          <tr key={cert.name}>
            <td className="linkedin9-table-label">{cert.name}</td>
            <td>
              {cert.issuer} · {cert.issued}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MoreTab = () => (
  <div className="linkedin9-pane">
    <h3 className="linkedin9-pane-title">Top skills</h3>
    <div className="linkedin9-skill-grid">
      {LINKEDIN_PROFILE.skills.map((skill) => (
        <span key={skill} className="linkedin9-skill-chip">
          {skill}
        </span>
      ))}
    </div>
    <h3 className="linkedin9-pane-title">Languages</h3>
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
    <p className="linkedin9-footnote">
      Full skill list and endorsements live on{' '}
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
        linkedin.com
      </a>
      .
    </p>
  </div>
);

const TAB_PANELS = {
  profile: ProfileTab,
  experience: ExperienceTab,
  education: EducationTab,
  more: MoreTab,
};

const LinkedInApp = () => {
  const [tab, setTab] = useState('profile');
  const Panel = TAB_PANELS[tab];

  return (
    <div className="mac-content-inner linkedin9">
      <header className="linkedin9-toolbar">
        <div className="linkedin9-toolbar-brand">
          <img
            src="/desktop-icons/linkedin.png"
            alt=""
            className="linkedin9-toolbar-icon"
            width={32}
            height={32}
          />
          <div>
            <div className="linkedin9-toolbar-title">LinkedIn Profile</div>
            <div className="linkedin9-toolbar-sub">Mac OS 9 viewer · not affiliated with LinkedIn</div>
          </div>
        </div>
        <a
          className="retro-mac-btn linkedin9-open-btn"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on LinkedIn
        </a>
      </header>

      <div className="linkedin9-shell">
        <aside className="linkedin9-card">
          <div className="linkedin9-avatar" aria-hidden="true">
            TR
          </div>
          <h1 className="linkedin9-name">{LINKEDIN_PROFILE.name}</h1>
          <p className="linkedin9-headline">{LINKEDIN_PROFILE.headline}</p>
          <p className="linkedin9-location">{LINKEDIN_PROFILE.location}</p>
          <table className="linkedin9-stats">
            <tbody>
              <tr>
                <td className="linkedin9-stats-label">Connections</td>
                <td>{LINKEDIN_PROFILE.connections}</td>
              </tr>
              <tr>
                <td className="linkedin9-stats-label">Followers</td>
                <td>{LINKEDIN_PROFILE.followers}</td>
              </tr>
            </tbody>
          </table>
          <a
            className="retro-mac-btn linkedin9-card-btn"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View live profile
          </a>
        </aside>

        <div className="linkedin9-main">
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
      </div>
    </div>
  );
};

export default LinkedInApp;
