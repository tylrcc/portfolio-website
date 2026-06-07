import React, { useLayoutEffect, useRef, useState } from 'react';
import AboutWindow from './AboutWindow';

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
      if (!about) return;
      const contentH = about.offsetHeight || 400;
      const sh = host.clientHeight / contentH;
      /* Full width via CSS; only scale down when taller than the preview pane */
      setScale(Math.min(1, sh));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="wiz9-about-fill">
      <div
        ref={innerRef}
        className="wiz9-about-fill-inner"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        <AboutWindow />
      </div>
    </div>
  );
};

export default WizAboutFill;
