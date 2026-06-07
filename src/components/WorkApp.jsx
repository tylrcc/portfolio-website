import React, { useEffect, useRef, useState } from 'react';
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

const FOURSEAT_PREVIEW_W = 800;
const FOURSEAT_PREVIEW_H = 500;

function FourSeatMiniPreview() {
  const viewportRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.35);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    const updateScale = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (!width || !height) return;
      // Cover the viewport (crop edges) so letterboxing never exposes the browser chrome.
      setPreviewScale(Math.max(width / FOURSEAT_PREVIEW_W, height / FOURSEAT_PREVIEW_H));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
        <div className="work-fourseat-mini-viewport" ref={viewportRef}>
          <div
            className="work-fourseat-faux-scale"
            style={{ transform: `scale(${previewScale})` }}
            aria-hidden="true"
          >
            <div className="work-fourseat-faux">
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
    const delay = charIdx < len ? 4 : lineIdx === CODE_LINES.length - 1 ? 380 : 26;
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
          {TERMINAL_LINES.map((t, i) => {
            const live = lineIdx >= CODE_LINES.length;
            return (
              <div
                key={i}
                className={[
                  i === 0 ? 'quant-term-cmd' : 'quant-term-line',
                  live ? null : 'quant-term-line--reserved',
                ].filter(Boolean).join(' ')}
                style={live ? { animationDelay: `${i * 0.06}s` } : undefined}
                aria-hidden={!live}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TremorMeshDemo() {
  return (
    <div className="work-oss-demo work-oss-demo--seismic" aria-hidden="true">
      <div className="work-oss-demo-chrome">
        <span className="work-oss-demo-status">
          <span className="work-oss-demo-pulse" />
          sensor mesh · 5 nodes
        </span>
        <span className="work-oss-demo-metric">P-wave 0.31s</span>
      </div>
      <div className="work-seismic-chart">
        <div className="work-seismic-line work-seismic-line--1" />
        <div className="work-seismic-line work-seismic-line--2" />
        <div className="work-seismic-line work-seismic-line--3" />
      </div>
      <div className="work-seismic-nodes">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="work-seismic-node"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TapelineDemo() {
  const ticks = ['142.31', '142.28', '142.35', '142.29', '142.33', '142.30', '142.32', '142.27'];
  return (
    <div className="work-oss-demo work-oss-demo--tape" aria-hidden="true">
      <div className="work-oss-demo-chrome">
        <span className="work-oss-demo-status">
          <span className="work-oss-demo-pulse work-oss-demo-pulse--tape" />
          FPGA · live avg
        </span>
        <span className="work-oss-demo-metric">42 ns/tick</span>
      </div>
      <div className="work-tape-scroll-wrap">
        <div className="work-tape-scroll">
          {[...ticks, ...ticks].map((t, i) => (
            <span key={i} className="work-tape-tick">{t}</span>
          ))}
        </div>
      </div>
      <div className="work-tape-vwap">
        <span className="work-tape-vwap-label">VWAP</span>
        <div className="work-tape-vwap-track">
          <div className="work-tape-vwap-fill" />
        </div>
        <span className="work-tape-vwap-num">142.302</span>
      </div>
    </div>
  );
}

function OssProjectPanel({ project, demo: Demo, panelIndex }) {
  return (
    <article
      className={`work-panel work-panel--oss work-panel--${project.id}`}
      style={{ animationDelay: `${0.12 + panelIndex * 0.06}s` }}
    >
      <div className="work-mpw-shell">
        <MpwTitlebar title={`Macintosh HD:Projects:${project.name}`} />
        <div className="work-mpw-body work-mpw-body--oss">
          <div className="work-panel-head work-panel-head--oss">
            <span className="work-oss-panel-icon" aria-hidden="true">{project.icon}</span>
            <div>
              <p className="work-card-kicker">Open source</p>
              <h3>{project.title}</h3>
            </div>
          </div>
          <p className="work-card-desc work-card-desc--compact">{project.description}</p>
          <Demo />
          <div className="work-card-footer">
            <TechTags items={project.tech} />
            <MacButton href={project.url}>View on GitHub →</MacButton>
          </div>
        </div>
      </div>
    </article>
  );
}

const OSS_DEMOS = {
  'tremor-mesh': TremorMeshDemo,
  tapeline: TapelineDemo,
};

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
      <div className="work-featured">
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
            <p className="work-card-desc work-card-desc--featured">{FOURSEAT.description}</p>
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
          <div className="work-mpw-body work-mpw-body--quant work-mpw-body--featured">
            <div className="work-panel-head">
              <span className="work-panel-logo work-panel-logo--quant" aria-hidden="true">∑</span>
              <div>
                <p className="work-card-kicker">{QUANT_ALGO.kicker}</p>
                <h3>{QUANT_ALGO.title}</h3>
              </div>
            </div>
            <p className="work-card-desc work-card-desc--featured">{QUANT_ALGO.description}</p>
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
      </div>

      <div className="work-oss-grid">
      {PINNED_OPENSOURCE.map((project, i) => {
        const Demo = OSS_DEMOS[project.id];
        return (
          <OssProjectPanel
            key={project.id}
            project={project}
            demo={Demo}
            panelIndex={i}
          />
        );
      })}
      </div>
    </div>

    <ConnectBar />
  </div>
);

export default WorkApp;
