import React, { useLayoutEffect, useRef, useState } from 'react';
import AboutWindow from './AboutWindow';

/** About This Computer is authored at 540px wide; scale to fill the preview host. */
const ABOUT_BASE_WIDTH = 540;

const WizAboutFill = () => {
  const hostRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;

    const fit = () => {
      const about = inner.querySelector('.about9');
      const contentW = about?.offsetWidth || ABOUT_BASE_WIDTH;
      const contentH = about?.offsetHeight || 400;
      const pad = 2;
      const sw = (host.clientWidth - pad) / contentW;
      const sh = (host.clientHeight - pad) / contentH;
      setScale(Math.min(sw, sh, 1.25));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="wiz9-about-fill">
      <div
        ref={innerRef}
        className="wiz9-about-fill-inner"
        style={{ transform: `scale(${scale})` }}
      >
        <AboutWindow />
      </div>
    </div>
  );
};

export default WizAboutFill;
