import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PHOTO_CAMERAS, PHOTOS } from '../data/photos';

const PhotosApp = () => {
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.camera === filter)),
    [filter]
  );

  const activeIndex = useMemo(
    () => (activeId == null ? -1 : visible.findIndex((p) => p.id === activeId)),
    [activeId, visible]
  );
  const active = activeIndex >= 0 ? visible[activeIndex] : null;

  const closeLightbox = useCallback(() => setActiveId(null), []);

  const showPrev = useCallback(() => {
    if (visible.length === 0 || activeIndex < 0) return;
    const next = (activeIndex - 1 + visible.length) % visible.length;
    setActiveId(visible[next].id);
  }, [activeIndex, visible]);

  const showNext = useCallback(() => {
    if (visible.length === 0 || activeIndex < 0) return;
    const next = (activeIndex + 1) % visible.length;
    setActiveId(visible[next].id);
  }, [activeIndex, visible]);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, closeLightbox, showPrev, showNext]);

  useEffect(() => {
    if (activeId && !visible.some((p) => p.id === activeId)) {
      setActiveId(null);
    }
  }, [visible, activeId]);

  return (
    <div className={`mac-content-inner photos9${entered ? ' photos9--in' : ''}`}>
      <header className="photos9-head">
        <div className="photos9-head-copy">
          <p className="photos9-kicker">PictureViewer</p>
          <h2 className="photos9-title">Photos</h2>
          <p className="photos9-sub">
            A small roll from the Nikon F3 and Fujifilm X-Pro3. Film grain included free of charge.
          </p>
        </div>
        <div className="photos9-meta" aria-hidden="true">
          <span className="photos9-meta-chip">{PHOTOS.length} frames</span>
          <span className="photos9-meta-chip">2 cameras</span>
        </div>
      </header>

      <div className="photos9-toolbar" role="tablist" aria-label="Camera filter">
        {PHOTO_CAMERAS.map((cam) => (
          <button
            key={cam.id}
            type="button"
            role="tab"
            aria-selected={filter === cam.id}
            className={`photos9-tab${filter === cam.id ? ' photos9-tab--on' : ''}`}
            onClick={() => setFilter(cam.id)}
          >
            {cam.label}
          </button>
        ))}
        <span className="photos9-count">{visible.length} shown</span>
      </div>

      <div className="photos9-grid" role="list">
        {visible.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            role="listitem"
            className={`photos9-card photos9-card--${photo.orient}`}
            data-photo={photo.id}
            style={{ animationDelay: `${0.05 + i * 0.045}s` }}
            onClick={() => setActiveId(photo.id)}
            aria-label={`${photo.title}, ${photo.place}`}
          >
            <span className="photos9-card-frame">
              <span className="photos9-card-shine" aria-hidden="true" />
              <img
                className="photos9-card-img"
                src={photo.src}
                alt=""
                loading="lazy"
                draggable={false}
              />
            </span>
            <span className="photos9-card-caption">
              <span className="photos9-card-title">{photo.title}</span>
              <span className="photos9-card-place">
                {photo.place} · {photo.cameraLabel}
              </span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="photos9-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={closeLightbox}
        >
          <div
            className="photos9-lightbox-window mac-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mac-titlebar photos9-lightbox-titlebar">
              <button
                type="button"
                className="mac-close-btn"
                aria-label="Close"
                onClick={closeLightbox}
              />
              <div className="mac-titlebar-stripes" aria-hidden="true" />
              <div className="mac-titlebar-text">{active.title}</div>
            </div>
            <div className="photos9-lightbox-stage">
              <button
                type="button"
                className="photos9-nav photos9-nav--prev retro-mac-btn"
                onClick={showPrev}
                aria-label="Previous photo"
              >
                ◂
              </button>
              <div key={active.id} className="photos9-lightbox-frame">
                <img
                  className="photos9-lightbox-img"
                  src={active.src}
                  alt={active.title}
                  draggable={false}
                />
              </div>
              <button
                type="button"
                className="photos9-nav photos9-nav--next retro-mac-btn"
                onClick={showNext}
                aria-label="Next photo"
              >
                ▸
              </button>
            </div>
            <div className="photos9-lightbox-footer">
              <span>
                {active.place} · {active.cameraLabel}
              </span>
              <span>
                {activeIndex + 1} / {visible.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosApp;
