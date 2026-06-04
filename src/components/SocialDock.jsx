import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GITHUB_URL, LEETCODE_URL, LINKEDIN_URL, MAILTO, TWITTER_URL } from '../socialLinks';

const DOCK_LINKS = [
  { id: 'email', label: 'Email', href: MAILTO, icon: '/social-icons/email.png', external: false },
  { id: 'github', label: 'GitHub', href: GITHUB_URL, icon: '/social-icons/github.png', external: true },
  { id: 'linkedin', label: 'LinkedIn', href: LINKEDIN_URL, icon: '/social-icons/linkedin.png', external: true },
  { id: 'twitter', label: 'X (Twitter)', href: TWITTER_URL, icon: '/social-icons/twitter.png', external: true },
  {
    id: 'leetcode',
    label: 'LeetCode',
    href: LEETCODE_URL,
    icon: '/social-icons/leetcode.svg',
    external: true,
  },
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
          {DOCK_LINKS.map((item) => (
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
              <img className="social-dock-icon" src={item.icon} alt="" draggable={false} />
            </a>
          ))}

          <button
            type="button"
            className="social-dock-link social-dock-link--wechat"
            title="WeChat"
            aria-label="WeChat QR code"
            aria-expanded={wechatOpen}
            onClick={() => setWechatOpen((open) => !open)}
          >
            <img className="social-dock-icon" src="/social-icons/wechat.png" alt="" draggable={false} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SocialDock;
