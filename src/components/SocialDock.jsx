import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GITHUB_URL, LEETCODE_URL, LINKEDIN_URL, MAILTO, TWITTER_URL } from '../socialLinks';

const STRIP_ICONS = [
  { id: 'email', label: 'Email', href: MAILTO, external: false, spriteIndex: 0 },
  { id: 'github', label: 'GitHub', href: GITHUB_URL, external: true, spriteIndex: 1 },
  { id: 'linkedin', label: 'LinkedIn', href: LINKEDIN_URL, external: true, spriteIndex: 2 },
  { id: 'twitter', label: 'X (Twitter)', href: TWITTER_URL, external: true, spriteIndex: 3 },
];

const SocialDock = () => {
  const [wechatOpen, setWechatOpen] = useState(false);
  const dockRef = useRef(null);

  const closeWechat = useCallback(() => setWechatOpen(false), []);

  useEffect(() => {
    if (!wechatOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeWechat();
    };
    const onPointer = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) closeWechat();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [wechatOpen, closeWechat]);

  return (
    <div className="social-dock-wrap" ref={dockRef} onClick={(e) => e.stopPropagation()}>
      {wechatOpen && (
        <div className="social-wechat-card mac-window" role="dialog" aria-label="WeChat QR code">
          <div className="mac-titlebar social-wechat-title">
            <button
              type="button"
              className="mac-close-btn"
              aria-label="Close"
              onClick={closeWechat}
            />
            <div className="mac-titlebar-stripes" aria-hidden="true" />
            <div className="mac-titlebar-text">WeChat</div>
          </div>
          <div className="social-wechat-body">
            <img src="/wechat-qr.png" alt="Scan to add ty on WeChat" width={220} height={294} />
            <p className="social-wechat-hint">Scan QR code to add me as a friend.</p>
          </div>
        </div>
      )}

      <nav className="social-dock" aria-label="Contact and social links">
        <span className="social-dock-label">Connect</span>
        <div className="social-dock-icons">
          {STRIP_ICONS.map((item) => (
            <a
              key={item.id}
              className="social-dock-link"
              href={item.href}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              title={item.label}
              aria-label={item.label}
            >
              <span
                className="social-dock-sprite"
                style={{ backgroundPosition: `${(item.spriteIndex / 5) * 100}% 0` }}
                aria-hidden="true"
              />
            </a>
          ))}

          <a
            className="social-dock-link social-dock-link--leetcode"
            href={LEETCODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="LeetCode"
            aria-label="LeetCode"
          >
            <span className="social-dock-lc" aria-hidden="true">
              LC
            </span>
          </a>

          <button
            type="button"
            className="social-dock-link social-dock-link--wechat"
            title="WeChat"
            aria-label="WeChat QR code"
            aria-expanded={wechatOpen}
            onClick={() => setWechatOpen((open) => !open)}
          >
            <span
              className="social-dock-sprite"
              style={{ backgroundPosition: '100% 0' }}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SocialDock;
