import React, { useEffect, useState } from 'react';
import { LINKEDIN_PROFILE } from '../data/linkedinProfile';

const FULL_NAME = 'Tyler Riccardi';

/** "About This Computer" style resource bars, but for a person. */
const POWER_BARS = [
  { label: 'Shipping products', pct: 94, note: 'Fourseat, Glasskin, Racketfit, this site' },
  { label: 'Quant research', pct: 88, note: 'walk-forward, rank IC, CVaR objectives' },
  { label: 'Finance & accounting', pct: 82, note: 'UCF finance + real tax season reps' },
  { label: 'Creative direction', pct: 76, note: '5-figure vintage brand, built from zero' },
];

/** Skills rendered like the classic Mac OS extensions parade at boot. */
const EXTENSIONS = [
  { name: 'Python', mono: 'Py', hue: '#2f6cb0' },
  { name: 'NumPy', mono: 'Np', hue: '#4a5fae' },
  { name: 'React', mono: 'Re', hue: '#1f8ea8' },
  { name: 'Next.js', mono: 'Nx', hue: '#3f3f46' },
  { name: 'LLMs', mono: 'AI', hue: '#7a4fb0' },
  { name: 'Stripe', mono: 'St', hue: '#5a68c9' },
  { name: 'Excel', mono: 'Xl', hue: '#2e7d4f' },
  { name: 'Fusion 360', mono: 'Fu', hue: '#c96e2e' },
  { name: 'SolidWorks', mono: 'Sw', hue: '#b03737' },
  { name: 'Figma', mono: 'Fg', hue: '#8a4fc9' },
];

const CVApp = () => {
  const [typedCount, setTypedCount] = useState(0);
  const [barsLive, setBarsLive] = useState(false);
  const [spins, setSpins] = useState(0);
  const profile = LINKEDIN_PROFILE;

  useEffect(() => {
    if (typedCount >= FULL_NAME.length) return undefined;
    const id = window.setTimeout(() => setTypedCount((n) => n + 1), 72);
    return () => window.clearTimeout(id);
  }, [typedCount]);

  useEffect(() => {
    const id = window.setTimeout(() => setBarsLive(true), 420);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="mac-content-inner cv9">
      <header className="cv9-hero">
        <img
          className="cv9-photo"
          src={profile.photo}
          alt="Tyler Riccardi"
          onClick={() => setSpins((n) => n + 1)}
          style={{
            transform: `rotate(${spins * 360}deg)`,
            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
          }}
        />
        <div className="cv9-hero-main">
          <p className="cv9-kicker">About This Human</p>
          <h2 className="cv9-name">
            {FULL_NAME.slice(0, typedCount)}
            <span className="cv9-cursor" aria-hidden="true" />
          </h2>
          <p className="cv9-headline">
            Founder of Fourseat. Quant-curious finance student. Ships something every week.
          </p>
          <div className="cv9-chips">
            <span className="cv9-chip">Orlando, FL</span>
            <span className="cv9-chip">UCF &rsquo;27 &middot; Accounting &amp; Finance</span>
            <span className="cv9-chip">EN / ES</span>
            <span className="cv9-chip cv9-chip--live">
              <span className="cv9-led" aria-hidden="true" /> now building fourseat.dev
            </span>
          </div>
        </div>
      </header>

      <section className="cv9-panel cv9-panel--power" aria-label="System resources">
        <div className="cv9-panel-title">System Resources</div>
        <div className="cv9-panel-body">
          {POWER_BARS.map((bar, i) => (
            <div key={bar.label} className="cv9-bar-row">
              <span className="cv9-bar-label">{bar.label}</span>
              <span className="cv9-bar-track">
                <span
                  className="cv9-bar-fill"
                  style={{
                    width: barsLive ? `${bar.pct}%` : '0%',
                    transitionDelay: `${0.1 + i * 0.16}s`,
                  }}
                />
              </span>
              <span className="cv9-bar-note">{bar.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cv9-panel" aria-label="About me">
        <div className="cv9-panel-title">Read Me</div>
        <div className="cv9-panel-body">
          <p className="cv9-about">{profile.about}</p>
        </div>
      </section>

      <section className="cv9-panel" aria-label="Experience timeline">
        <div className="cv9-panel-title">Timeline</div>
        <ol className="cv9-timeline">
          {profile.experience.map((job, i) => (
            <li
              key={job.id}
              className={`cv9-job${job.current ? ' cv9-job--current' : ''}`}
              style={{ animationDelay: `${0.2 + i * 0.12}s` }}
            >
              <span className="cv9-job-dot" aria-hidden="true" />
              <div className="cv9-job-head">
                <strong className="cv9-job-title">{job.title}</strong>
                <span className="cv9-job-co">{job.company}</span>
                {job.current && <span className="cv9-job-now">NOW</span>}
              </div>
              <p className="cv9-job-sum">{job.summary}</p>
              <p className="cv9-job-meta">
                {job.period} &middot; {job.location}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cv9-panel" aria-label="Skills">
        <div className="cv9-panel-title">Extensions Loaded</div>
        <div className="cv9-ext-row">
          {EXTENSIONS.map((ext, i) => (
            <span key={ext.name} className="cv9-ext" style={{ animationDelay: `${0.25 + i * 0.09}s` }}>
              <span className="cv9-ext-icon" style={{ background: ext.hue }}>
                {ext.mono}
              </span>
              <span className="cv9-ext-name">{ext.name}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="cv9-panel" aria-label="Certifications">
        <div className="cv9-panel-title">Installed Software</div>
        <ul className="cv9-certs">
          {profile.certifications.map((cert, i) => (
            <li key={cert.name} className="cv9-cert" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              {cert.logo && <img className="cv9-cert-logo" src={cert.logo} alt="" />}
              <span className="cv9-cert-name">{cert.name}</span>
              <span className="cv9-cert-meta">
                {cert.issuer} &middot; {cert.issued}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="cv9-actions">
        <a
          className="retro-mac-btn cv9-action-btn"
          href="/TylerRiccardiResume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Formal PDF
        </a>
        <a
          className="retro-mac-btn cv9-action-btn"
          href="https://www.linkedin.com/in/tylerriccardi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          className="retro-mac-btn cv9-action-btn"
          href="https://fourseat.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          fourseat.dev
        </a>
      </footer>
    </div>
  );
};

export default CVApp;
