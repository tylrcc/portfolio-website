import React, { useEffect, useState } from 'react';
import { isMobileViewport } from '../desktopLayout';

const PDF_PATH = '/TylerRiccardiResume.pdf';

const ReadmeResumeApp = () => {
  const [frameSrc, setFrameSrc] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [mobile, setMobile] = useState(() => (
    typeof window !== 'undefined' && isMobileViewport()
  ));

  useEffect(() => {
    const onResize = () => setMobile(isMobileViewport());
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const blobUrlRef = { current: null };

    const load = async () => {
      try {
        const response = await fetch(PDF_PATH, { credentials: 'same-origin' });
        if (!response.ok) throw new Error('bad status');
        const blob = await response.blob();
        if (cancelled) return;
        blobUrlRef.current = URL.createObjectURL(blob);
        setFrameSrc(blobUrlRef.current);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const pdfViewSrc = frameSrc
    ? `${frameSrc}${mobile ? '#view=FitH&toolbar=0&navpanes=0&scrollbar=0' : ''}`
    : null;

  return (
    <div className={`mac-content-inner readme-resume word95${mobile ? ' word95--mobile' : ''}`}>
      <div className="word95-menu-row" aria-label="Word menu bar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span className="word95-menu-extra">Insert</span>
        <span className="word95-menu-extra">Format</span>
        <span className="word95-menu-extra">Tools</span>
        <span className="word95-menu-extra">Table</span>
        <span className="word95-menu-active word95-menu-extra">Window</span>
        <span className="word95-menu-extra">Help</span>
      </div>

      <div className="word95-toolbar" aria-label="Resume actions">
        <a className="retro-mac-btn word95-icon-btn" href={PDF_PATH} download="TylerRiccardiResume.pdf">
          Save
        </a>
        <a className="retro-mac-btn word95-icon-btn" href={PDF_PATH} target="_blank" rel="noopener noreferrer">
          Open
        </a>
        <span className="word95-toolbar-separator word95-toolbar-extra"></span>
        <span className="word95-select word95-toolbar-extra">Normal</span>
        <span className="word95-select word95-font-select word95-toolbar-extra">Times New Roman</span>
        <span className="word95-select word95-toolbar-extra">12</span>
      </div>

      <div className="word95-ruler" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index}>{index}</span>
        ))}
      </div>

      <div className="word95-document-shell">
        {loadError && (
          <div className="word95-pdf-fallback">
            <p>Could not load the PDF in this window.</p>
            <p>
              <a href={PDF_PATH} download="TylerRiccardiResume.pdf">
                Download
              </a>
              {' · '}
              <a href={PDF_PATH} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </p>
          </div>
        )}
        {!loadError && pdfViewSrc && (
          <iframe className="word95-resume-frame" src={pdfViewSrc} title="Tyler Riccardi resume PDF" />
        )}
        {!loadError && !frameSrc && <div className="word95-pdf-loading">Loading document...</div>}
      </div>

      <div className="word95-statusbar">
        <span>Page 1</span>
        <span className="word95-status-extra">Sec 1</span>
        <span>Words: Resume</span>
        <span className="word95-status-extra">Zoom: {mobile ? 'Fit' : '100%'}</span>
      </div>
    </div>
  );
};

export default ReadmeResumeApp;
