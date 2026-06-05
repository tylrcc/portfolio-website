import React, { useEffect, useState } from 'react';
import {
  CONNECT_LINKS,
  FOURSEAT,
  FOURSEAT_URL,
  PINNED_OPENSOURCE,
  QUANT_ALGO,
} from '../data/workProjects';

const CODE_LINES = [
  { key: 'l1', parts: [{ c: 'kw', t: 'import' }, { c: 'pl', t: ' numpy ' }, { c: 'kw', t: 'as' }, { c: 'var', t: ' np' }] },
  { key: 'l2', parts: [{ c: 'kw', t: 'from' }, { c: 'pl', t: ' dataclasses ' }, { c: 'kw', t: ' import' }, { c: 'fn', t: ' dataclass' }] },
  { key: 'l3', parts: [{ c: 'kw', t: 'from' }, { c: 'pl', t: ' scipy.optimize ' }, { c: 'kw', t: 'import' }, { c: 'fn', t: ' minimize' }] },
  { key: 'l4', parts: [] },
  { key: 'l5', parts: [{ c: 'mod', t: '@dataclass' }] },
  {
    key: 'l6',
    parts: [
      { c: 'kw', t: 'class' },
      { c: 'fn', t: ' WalkForwardConfig' },
      { c: 'pl', t: ':' },
    ],
  },
  {
    key: 'l7',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'var', t: 'train_days' },
      { c: 'pl', t: ': int = ' },
      { c: 'num', t: '252' },
      { c: 'pl', t: '; ' },
      { c: 'var', t: 'test_days' },
      { c: 'pl', t: ': int = ' },
      { c: 'num', t: '21' },
    ],
  },
  {
    key: 'l8',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'var', t: 'embargo' },
      { c: 'pl', t: ': int = ' },
      { c: 'num', t: '5' },
      { c: 'pl', t: '  # purged CV gap' },
    ],
  },
  { key: 'l9', parts: [] },
  {
    key: 'l10',
    parts: [
      { c: 'kw', t: 'def' },
      { c: 'fn', t: ' factor_ic' },
      { c: 'pl', t: '(' },
      { c: 'var', t: 'f' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'fwd_ret' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'w' },
      { c: 'pl', t: '):' },
    ],
  },
  {
    key: 'l11',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'var', t: 'rank_f' },
      { c: 'pl', t: ' = f.rank(pct=' },
      { c: 'kw', t: 'True' },
      { c: 'pl', t: '); ' },
      { c: 'var', t: 'rank_r' },
      { c: 'pl', t: ' = fwd_ret.rank(pct=' },
      { c: 'kw', t: 'True' },
      { c: 'pl', t: ')' },
    ],
  },
  {
    key: 'l12',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'kw', t: 'return' },
      { c: 'pl', t: ' float((' },
      { c: 'var', t: 'rank_f' },
      { c: 'pl', t: ' * ' },
      { c: 'var', t: 'rank_r' },
      { c: 'pl', t: ' * ' },
      { c: 'var', t: 'w' },
      { c: 'pl', t: ').sum() / ' },
      { c: 'var', t: 'w' },
      { c: 'pl', t: '.sum())' },
    ],
  },
  { key: 'l13', parts: [] },
  {
    key: 'l14',
    parts: [
      { c: 'kw', t: 'def' },
      { c: 'fn', t: ' cvar_objective' },
      { c: 'pl', t: '(' },
      { c: 'var', t: 'w' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'losses' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'alpha' },
      { c: 'pl', t: '=' },
      { c: 'num', t: '0.95' },
      { c: 'pl', t: '):' },
    ],
  },
  {
    key: 'l15',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'var', t: 'port' },
      { c: 'pl', t: ' = losses @ ' },
      { c: 'var', t: 'w' },
      { c: 'pl', t: '; ' },
      { c: 'var', t: 'q' },
      { c: 'pl', t: ' = np.quantile(' },
      { c: 'var', t: 'port' },
      { c: 'pl', t: ', ' },
      { c: 'num', t: '1' },
      { c: 'pl', t: ' - ' },
      { c: 'var', t: 'alpha' },
      { c: 'pl', t: ')' },
    ],
  },
  {
    key: 'l16',
    parts: [
      { c: 'pl', t: '    ' },
      { c: 'kw', t: 'return' },
      { c: 'pl', t: ' float(np.mean(np.maximum(' },
      { c: 'num', t: '0' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'q' },
      { c: 'pl', t: ' - ' },
      { c: 'var', t: 'port' },
      { c: 'pl', t: ')))' },
    ],
  },
  { key: 'l17', parts: [] },
  {
    key: 'l18',
    parts: [
      { c: 'var', t: 'w_star' },
      { c: 'pl', t: ' = minimize(' },
      { c: 'fn', t: 'cvar_objective' },
      { c: 'pl', t: ', ' },
      { c: 'var', t: 'x0' },
      { c: 'pl', t: ', args=(' },
      { c: 'var', t: 'L_hist' },
      { c: 'pl', t: '),' },
    ],
  },
  {
    key: 'l19',
    parts: [
      { c: 'pl', t: '                 method=' },
      { c: 'str', t: '"SLSQP"' },
      { c: 'pl', t: ', bounds=bnds, constraints=[turn, lev])' },
    ],
  },
];

const TERMINAL_LINES = [
  '$ python engine/run_walk_forward.py --regime-neutral --cost-bps 12',
  'Loaded 4.18M bars | universe: liquid_large_cap | factors: 38',
  'Walk-forward: 48 windows | train 252d | test 21d | embargo 5d',
  'Median OOS Sharpe: 2.31  | Calmar: 1.82  | Max DD: -5.1%',
  'Mean rank IC: 0.14 (t=3.8)  | turnover ann. 0.41×',
  'Post-cost net alpha (blend): +418 bps  | ADMM risk overlay: 41ms',
];

function renderLinePartial(line, maxChars) {
  let left = maxChars;
  return line.parts.map((p, j) => {
    if (left <= 0) return null;
    const take = Math.min(p.t.length, left);
    left -= take;
    if (take <= 0) return null;
    return (
      <span key={j} className={`q-${p.c}`}>
        {p.t.slice(0, take)}
      </span>
    );
  });
}

function MpwTitlebar({ title }) {
  return (
    <div className="work-mpw-titlebar">
      <span className="work-mpw-close" aria-hidden="true" />
      <span className="work-mpw-title">{title}</span>
      <span className="work-mpw-zoom" aria-hidden="true" />
    </div>
  );
}

function WorkFinderChrome() {
  return (
    <div className="work-finder-chrome">
      <div className="work-finder-menubar" aria-hidden="true">
        <span>File</span>
        <span>View</span>
        <span className="work-finder-menubar-fill" />
        <span className="work-finder-menubar-pill">Work</span>
      </div>
      <div className="work-finder-path" aria-label="Current folder">
        <img src="/finder-logo-classic.png" alt="" className="work-finder-path-icon" />
        <span>Macintosh HD</span>
        <span className="work-finder-chev">▸</span>
        <span>tyler</span>
        <span className="work-finder-chev">▸</span>
        <strong>Work</strong>
      </div>
    </div>
  );
}

function TechTags({ items }) {
  return (
    <div className="work-tech-tags" aria-label="Tech stack">
      <span className="work-tech-label">Built with</span>
      {items.map((t) => (
        <span key={t} className="work-tech-tag">{t}</span>
      ))}
    </div>
  );
}

function MacButton({ href, children, external = true }) {
  const props = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
  return (
    <a className="work-card-link work-card-link--mac" href={href} {...props}>
      {children}
    </a>
  );
}

function FourSeatMiniPreview() {
  return (
    <a
      href={FOURSEAT_URL}
      className="work-fourseat-mini-block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="work-fourseat-mini-browser">
        <div className="work-fourseat-mini-chrome" aria-hidden="true">
          <span className="work-fourseat-mini-close" />
          <span className="work-fourseat-mini-url">fourseat.dev</span>
          <span className="work-fourseat-mini-zoom" />
        </div>
        <div className="work-fourseat-mini-viewport">
          <div className="work-fourseat-faux" aria-hidden="true">
            <div
              className="work-fourseat-faux-bg"
              style={{ backgroundImage: 'url(/work/fourseat/hero-poster.jpg)' }}
            />
            <div className="work-fourseat-faux-scrim" />
            <nav className="work-fourseat-faux-nav">
              <div className="work-fourseat-faux-brand">
                <img src="/work/fourseat/logo-circle.png" alt="" />
                <span>fourseat</span>
              </div>
              <div className="work-fourseat-faux-nav-right">
                <span>Oracle</span>
                <span className="work-fourseat-faux-nav-hide-sm">How it works</span>
                <span className="work-fourseat-faux-cta">Get access</span>
              </div>
            </nav>
            <div className="work-fourseat-faux-hero">
              <p className="work-fourseat-faux-eyebrow">The Context Layer</p>
              <p className="work-fourseat-faux-word">fourseat</p>
              <p className="work-fourseat-faux-tag">Built for the modern company</p>
            </div>
          </div>
          <div className="work-fourseat-mini-shine" aria-hidden="true" />
        </div>
      </div>
      <span className="work-fourseat-mini-caption">
        Live preview — opens <strong>fourseat.dev</strong>
      </span>
    </a>
  );
}

function QuantCodeDemo() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= CODE_LINES.length) return undefined;
    const line = CODE_LINES[lineIdx];
    const len = line.parts.reduce((n, p) => n + p.t.length, 0);
    const delay = charIdx < len ? 10 : lineIdx === CODE_LINES.length - 1 ? 950 : 78;
    const id = window.setTimeout(() => {
      if (charIdx < len) {
        setCharIdx((c) => c + 1);
      } else {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [lineIdx, charIdx]);

  const visible = [];
  for (let i = 0; i < lineIdx; i += 1) {
    visible.push({ line: CODE_LINES[i], full: true });
  }
  if (lineIdx < CODE_LINES.length) {
    visible.push({ line: CODE_LINES[lineIdx], full: false, max: charIdx });
  }

  return (
    <div className="quant-demo">
      <div className="quant-window">
        <MpwTitlebar title="MPW:quantalgo-propfirms:walk_forward.py" />
        <pre className="quant-code">
          {visible.map(({ line, full, max }) => (
            <div key={line.key} className="quant-code-line">
              {full
                ? line.parts.map((p, j) => (
                    <span key={j} className={`q-${p.c}`}>{p.t}</span>
                  ))
                : renderLinePartial(line, max)}
            </div>
          ))}
          {lineIdx < CODE_LINES.length && <span className="quant-cursor">▍</span>}
        </pre>
      </div>
      <div className="quant-terminal">
        <MpwTitlebar title="MPW Shell — Output" />
        <div className={`quant-terminal-body${lineIdx >= CODE_LINES.length ? ' quant-terminal-body--live' : ''}`}>
          {lineIdx >= CODE_LINES.length
            && TERMINAL_LINES.map((t, i) => (
              <div
                key={i}
                className={i === 0 ? 'quant-term-cmd' : 'quant-term-line'}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {t}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function OssProjectRow({ project, index }) {
  return (
    <a
      href={project.url}
      className="work-oss-row"
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${0.08 + index * 0.07}s` }}
    >
      <span className="work-oss-row-icon" aria-hidden="true">{project.icon}</span>
      <span className="work-oss-row-main">
        <span className="work-oss-row-name">{project.title}</span>
        <span className="work-oss-row-desc">{project.description}</span>
      </span>
      <span className="work-oss-row-meta">
        <span className="work-oss-row-lang">{project.language}</span>
        <span className="work-oss-row-stars">★ {project.stars}</span>
      </span>
      <span className="work-oss-row-go" aria-hidden="true">▸</span>
    </a>
  );
}

function ConnectBar() {
  return (
    <section className="work-connect" aria-label="Find me online">
      <span className="work-connect-label">Connect</span>
      <div className="work-connect-links">
        {CONNECT_LINKS.map((l) => (
          <a
            key={l.label}
            className="work-connect-link"
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="work-connect-link-name">{l.label}</span>
            <span className="work-connect-link-handle">{l.handle}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const WorkApp = () => (
  <div className="mac-content-inner work-app">
    <WorkFinderChrome />

    <header className="work-intro-panel">
      <div className="work-intro-icon" aria-hidden="true">
        <img src="/desktop-icons/work.png" alt="" />
      </div>
      <div>
        <h2>Work</h2>
        <p>
          Products I ship, quant research, and pinned open source from{' '}
          <a href="https://github.com/tylrcc" target="_blank" rel="noopener noreferrer">@tylrcc</a>.
          Everything opens in a new tab.
        </p>
      </div>
    </header>

    <div className="work-stack">
      <article className="work-panel work-panel--fourseat">
        <div className="work-mpw-shell">
          <MpwTitlebar title={`Macintosh HD:Projects:${FOURSEAT.name}`} />
          <div className="work-mpw-body">
            <div className="work-panel-head">
              <img src={FOURSEAT.logo} alt="" className="work-panel-logo" />
              <div>
                <p className="work-card-kicker">{FOURSEAT.kicker}</p>
                <h3>{FOURSEAT.title}</h3>
              </div>
            </div>
            <p className="work-card-desc">{FOURSEAT.description}</p>
            <div className="work-fourseat-roles" aria-label="Board members">
              {FOURSEAT.roles.map((role, i) => (
                <span
                  key={role}
                  className="work-role-chip"
                  style={{ animationDelay: `${0.12 + i * 0.08}s` }}
                >
                  {role}
                </span>
              ))}
            </div>
            <FourSeatMiniPreview />
            <div className="work-card-footer">
              <TechTags items={FOURSEAT.tech} />
              <MacButton href={FOURSEAT.url}>Open fourseat.dev →</MacButton>
            </div>
          </div>
        </div>
      </article>

      <article className="work-panel work-panel--quant">
        <div className="work-mpw-shell">
          <MpwTitlebar title={`Macintosh HD:Projects:${QUANT_ALGO.name}`} />
          <div className="work-mpw-body work-mpw-body--quant">
            <p className="work-card-kicker">{QUANT_ALGO.kicker}</p>
            <h3>{QUANT_ALGO.title}</h3>
            <p className="work-card-desc">{QUANT_ALGO.description}</p>
            <div className="work-quant-demo-wrap">
              <QuantCodeDemo />
            </div>
            <div className="work-card-footer">
              <TechTags items={QUANT_ALGO.tech} />
              <MacButton href={QUANT_ALGO.url}>View on GitHub →</MacButton>
            </div>
          </div>
        </div>
      </article>

      <section className="work-oss-panel">
        <div className="work-mpw-shell">
          <MpwTitlebar title="Macintosh HD:Open Source (pinned)" />
          <div className="work-mpw-body work-mpw-body--oss">
            <p className="work-card-kicker">Open source</p>
            <h3>Pinned on GitHub</h3>
            <p className="work-card-desc work-card-desc--compact">
              Public repos I&apos;m building alongside Fourseat and quant work.
            </p>
            <div className="work-oss-list" role="list">
              {PINNED_OPENSOURCE.map((project, i) => (
                <OssProjectRow key={project.id} project={project} index={i} />
              ))}
            </div>
            <div className="work-oss-tags">
              {PINNED_OPENSOURCE.map((p) => (
                <div key={p.id} className="work-oss-tag-group">
                  <span className="work-oss-tag-name">{p.name}</span>
                  <TechTags items={p.tech} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>

    <ConnectBar />
  </div>
);

export default WorkApp;
