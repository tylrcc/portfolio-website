import React, { useState, useCallback } from 'react';
import AboutWindow from './AboutWindow';

const WIZ_ICONS = {
  work: '/desktop-icons/work.png',
  readme: '/desktop-icons/readme.png',
  spotify: '/desktop-icons/spotify.png',
  hd: '/desktop-icons/hd.png',
  linkedin: '/desktop-icons/linkedin.png',
  about: '/desktop-icons/about.png',
  contact: '/desktop-icons/contact.png',
  doom: '/desktop-icons/doom.png',
  cv: '/desktop-icons/cv.png',
};

const PreviewCursor = ({ className = '' }) => (
  <svg
    className={`wiz9-cursor ${className}`}
    viewBox="0 0 16 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1 1 L1 14 L4.5 11 L7 17 L9.5 16 L7 10 L12 10 Z"
      fill="#fff"
      stroke="#000"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

const PreviewDesktopIcon = ({ src, label, className = '' }) => (
  <div className={`wiz9-prev-icon ${className}`}>
    <img src={src} alt="" className="wiz9-prev-icon-img" aria-hidden="true" />
    <div className="wiz9-prev-icon-label">{label}</div>
  </div>
);

const MiniWindow = ({ title, children, className = '', showResize = false }) => (
  <div className={`wiz9-mini-window ${className}`}>
    <div className="wiz9-mini-titlebar">
      <span className="wiz9-mini-close" />
      <span className="wiz9-mini-stripes" />
      <span className="wiz9-mini-title">{title}</span>
      <span className="wiz9-mini-zoom" />
    </div>
    <div className="wiz9-mini-body">{children}</div>
    {showResize && <span className="wiz9-mini-resize" aria-hidden="true" />}
  </div>
);

const StepRail = ({ step, steps }) => (
  <nav className="wiz9-step-rail" aria-label="Setup sections">
    <ol className="wiz9-step-rail-list">
      {steps.map((s, i) => (
        <li
          key={s.id}
          className={
            i === step
              ? 'wiz9-step-rail-item wiz9-step-rail-item--current'
              : i < step
                ? 'wiz9-step-rail-item wiz9-step-rail-item--done'
                : 'wiz9-step-rail-item'
          }
        >
          <span className="wiz9-step-rail-bullet" aria-hidden="true">
            {i < step ? '✓' : i === step ? '▸' : '○'}
          </span>
          <span className="wiz9-step-rail-label">{s.railLabel}</span>
        </li>
      ))}
    </ol>
  </nav>
);

const PreviewWelcome = () => (
  <div className="wiz9-prev wiz9-prev--welcome">
    <div className="wiz9-prev-about">
      <AboutWindow />
    </div>
  </div>
);

const PreviewOpenIcon = () => (
  <div className="wiz9-prev wiz9-prev--open">
    <div className="wiz9-prev-desk">
      <PreviewDesktopIcon
        src={WIZ_ICONS.work}
        label="Work"
        className="wiz9-prev-icon--anim"
      />
      <div className="wiz9-prev-window-anim">
        <MiniWindow title="Work" showResize>
          <div className="wiz9-mini-row" />
          <div className="wiz9-mini-row wiz9-mini-row--short" />
          <div className="wiz9-mini-row" />
          <div className="wiz9-mini-row wiz9-mini-row--short" />
        </MiniWindow>
      </div>
      <PreviewCursor className="wiz9-cursor--open" />
    </div>
  </div>
);

const PreviewMoveWindow = () => (
  <div className="wiz9-prev wiz9-prev--move">
    <div className="wiz9-prev-desk">
      <div className="wiz9-prev-drag-window">
        <MiniWindow title="About Me" showResize>
          <div className="wiz9-mini-row" />
          <div className="wiz9-mini-row wiz9-mini-row--short" />
          <div className="wiz9-mini-row" />
        </MiniWindow>
      </div>
      <PreviewCursor className="wiz9-cursor--drag" />
    </div>
  </div>
);

const PREVIEW_APPS = [
  { icon: WIZ_ICONS.readme, label: 'readme.txt', cls: 'wiz9-prev-app--1' },
  { icon: WIZ_ICONS.hd, label: 'Mac HD', cls: 'wiz9-prev-app--2' },
  { icon: WIZ_ICONS.spotify, label: 'spotify.exe', cls: 'wiz9-prev-app--3' },
  { icon: WIZ_ICONS.linkedin, label: 'LinkedIn', cls: 'wiz9-prev-app--4' },
  { icon: WIZ_ICONS.about, label: 'About Me', cls: 'wiz9-prev-app--5' },
  { icon: WIZ_ICONS.contact, label: 'Contact', cls: 'wiz9-prev-app--6' },
  { icon: WIZ_ICONS.doom, label: 'Doom', cls: 'wiz9-prev-app--7' },
  { icon: WIZ_ICONS.work, label: 'Work', cls: 'wiz9-prev-app--8' },
  { icon: WIZ_ICONS.cv, label: 'CV', cls: 'wiz9-prev-app--9' },
];

const PreviewApps = () => (
  <div className="wiz9-prev wiz9-prev--apps">
    <div className="wiz9-prev-desk">
      <div className="wiz9-prev-app-grid">
        {PREVIEW_APPS.map(({ icon, label, cls }) => (
          <div key={label} className={`wiz9-prev-app ${cls}`}>
            <img src={icon} alt="" className="wiz9-prev-app-ico" aria-hidden="true" />
            <span className="wiz9-prev-app-lab">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PreviewComplete = () => (
  <div className="wiz9-prev wiz9-prev--complete">
    <div className="wiz9-prev-desk">
      <div className="wiz9-prev-stack wiz9-prev-stack--back">
        <MiniWindow title="Work" showResize>
          <div className="wiz9-mini-row" />
          <div className="wiz9-mini-row wiz9-mini-row--short" />
        </MiniWindow>
      </div>
      <div className="wiz9-prev-stack wiz9-prev-stack--front">
        <MiniWindow title="About Me" showResize>
          <div className="wiz9-mini-row" />
          <div className="wiz9-mini-row wiz9-mini-row--short" />
          <div className="wiz9-mini-row" />
        </MiniWindow>
      </div>
      <div className="wiz9-prev-complete-badge" aria-hidden="true">
        ✓
      </div>
    </div>
  </div>
);

const STEPS = [
  {
    id: 'welcome',
    railLabel: 'Introduction',
    panelLabel: 'Introduction',
    title: "Welcome to ty's Portfolio",
    preview: PreviewWelcome,
    body: (current) => (
      <>
        <p>
          This Setup Assistant will guide you through the site. Each step shows
          a quick preview of how it works.
        </p>
        <p className="wiz9-italic">To begin exploring, click Next.</p>
        <p className="wiz9-section-label">The next sections of the tour are:</p>
        <ul className="wiz9-tour-list">
          <li className={current === 1 ? 'wiz9-tour-item--active' : ''}>
            <span className="wiz9-tour-marker">▸</span>
            1) Open icons
          </li>
          <li className={current === 2 ? 'wiz9-tour-item--active' : ''}>
            2) Move &amp; resize windows
          </li>
          <li className={current === 3 ? 'wiz9-tour-item--active' : ''}>
            3) Try the apps
          </li>
          <li className={current === 4 ? 'wiz9-tour-item--active' : ''}>
            4) Setup Complete!
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'open',
    railLabel: 'Open icons',
    panelLabel: 'Desktop',
    title: 'Open icons',
    preview: PreviewOpenIcon,
    body: () => (
      <>
        <p>
          <strong>Double-click any icon</strong> on the desktop to open it.
          Try <em>Work</em> to browse projects, <em>readme.txt</em> for my
          résumé, or <em>About Me</em> for a quick intro.
        </p>
        <p>On a phone, a single tap opens icons.</p>
        <p className="wiz9-italic">Click Next to learn how to move windows around.</p>
      </>
    ),
  },
  {
    id: 'move',
    railLabel: 'Windows',
    panelLabel: 'Windows',
    title: 'Move & resize windows',
    preview: PreviewMoveWindow,
    body: () => (
      <>
        <p>
          Grab the <strong>striped title bar</strong> to drag a window anywhere
          on the desktop. Drag the small triangle at the bottom-right corner to
          resize.
        </p>
        <p>
          Click the small square in the top-left to <strong>close</strong>, or
          the square in the top-right to <strong>collapse</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'apps',
    railLabel: 'Applications',
    panelLabel: 'Desktop',
    title: 'Try the apps',
    preview: PreviewApps,
    body: () => (
      <>
        <p>Everything on the desktop is interactive:</p>
        <ul className="wiz9-bullets">
          <li>
            <strong>spotify.exe</strong> &mdash; play music while you browse.
          </li>
          <li>
            <strong>Doom</strong> &mdash; a small portfolio mini-game.
          </li>
          <li>
            <strong>Work / CV</strong> &mdash; projects and résumé.
          </li>
          <li>
            <strong>LinkedIn / Contact</strong> &mdash; get in touch.
          </li>
        </ul>
        <p className="wiz9-italic">One more step — almost there!</p>
      </>
    ),
  },
  {
    id: 'done',
    railLabel: 'Complete',
    panelLabel: 'Finished',
    title: 'Setup Complete!',
    preview: PreviewComplete,
    body: () => (
      <>
        <p>
          That&apos;s the tour. Have fun poking around — windows drag, icons stack,
          and the menu bar at the top actually works.
        </p>
        <p>Thanks for stopping by!</p>
        <p className="wiz9-italic">Click Finish to start exploring the desktop.</p>
      </>
    ),
  },
];

const SetupWizard = ({ onFinish, onCancel }) => {
  const [step, setStep] = useState(0);
  const last = STEPS.length - 1;
  const isLast = step === last;
  const isFirst = step === 0;

  const next = useCallback(() => {
    if (isLast) {
      onFinish?.();
    } else {
      setStep((s) => Math.min(s + 1, last));
    }
  }, [isLast, onFinish, last]);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const cancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const current = STEPS[step];
  const Preview = current.preview;

  const isWelcome = step === 0;

  return (
    <div className={`wiz9${isWelcome ? ' wiz9--welcome' : ''}`}>
      <div className="wiz9-body">
        <StepRail step={step} steps={STEPS} />
        <div className="wiz9-main">
          <div className="wiz9-preview-col">
            <div className="wiz9-preview-caption">{current.panelLabel}</div>
            <div
              className={`wiz9-preview-frame ${
                isWelcome ? 'wiz9-preview-frame--about' : 'wiz9-preview-frame--compact'
              }`}
            >
              <div className="wiz9-preview">
                <Preview />
              </div>
            </div>
          </div>
          <div className="wiz9-content-panel">
            <h2 className="wiz9-step-title">{current.title}</h2>
            <div className="wiz9-step-body">{current.body(step + 1)}</div>
          </div>
        </div>
      </div>
      <div className="wiz9-footer">
        <div className="wiz9-footer-rule" />
        <div className="wiz9-footer-row">
          <span className="wiz9-footer-status">
            Step {step + 1} of {STEPS.length}
          </span>
          <div className="wiz9-footer-buttons">
            <button
              className="wiz9-btn"
              onClick={back}
              disabled={isFirst}
              type="button"
            >
              &lt; Back
            </button>
            <button
              className={`wiz9-btn wiz9-btn--default ${isLast ? 'wiz9-btn--finish' : ''}`}
              onClick={next}
              type="button"
            >
              {isLast ? 'Finish' : 'Next >'}
            </button>
            <button className="wiz9-btn" onClick={cancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
