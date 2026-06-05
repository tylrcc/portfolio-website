import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import {
  getViewportContentHeight,
  getViewportPadding,
  getViewportWidth,
  isMobileViewport,
} from '../desktopLayout';

const CHROME_WIDTH = 8;
const CHROME_HEIGHT = 32;
const MIN_WIDTH = 240;
const MIN_HEIGHT = 150;
const MAX_WIDTH_RATIO = 0.97;
/** On mobile, cap width so windows stay visibly inset even when content is wide. */
const MOBILE_MAX_WIDTH_RATIO = 0.94;

const DEFAULT_WINDOW_SIZE = { width: 420, height: 280 };

function clampInitialWindowSize(targetSize) {
  if (typeof window === 'undefined') return targetSize;
  const viewportWidth = getViewportWidth();
  const viewportHeight = getViewportContentHeight();
  const viewportPadding = getViewportPadding();
  const isMobile = isMobileViewport();
  const maxWidthRatio = isMobile ? MOBILE_MAX_WIDTH_RATIO : MAX_WIDTH_RATIO;
  const maxWidth = Math.max(
    MIN_WIDTH,
    Math.min(viewportWidth - viewportPadding * 2, viewportWidth * maxWidthRatio)
  );
  const maxHeight = Math.max(MIN_HEIGHT, viewportHeight - viewportPadding * 2);
  return {
    width: Math.min(maxWidth, Math.max(MIN_WIDTH, targetSize.width)),
    height: Math.min(maxHeight, Math.max(MIN_HEIGHT, targetSize.height))
  };
}

function computeCenteredTopLeft(targetSize) {
  if (typeof window === 'undefined') return { x: 100, y: 80 };
  const viewportWidth = getViewportWidth();
  const viewportHeight = getViewportContentHeight();
  const viewportPadding = getViewportPadding();
  return {
    x: Math.max(viewportPadding, Math.floor((viewportWidth - targetSize.width) / 2)),
    y: Math.max(viewportPadding, Math.floor((viewportHeight - targetSize.height) / 2))
  };
}

const Window = ({
  title,
  children,
  onClose,
  zIndex,
  onClick,
  minimized = false,
  onToggleMinimize,
  initialSize = DEFAULT_WINDOW_SIZE,
  /** When false, keep initialSize and skip content measurement (avoids welcome-step shrink flash). */
  autoFit = true,
  /** Center in viewport via flex overlay instead of absolute top-left + translate. */
  centered = false
}) => {
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const contentRef = useRef(null);
  const hasUserMovedRef = useRef(false);
  const userManuallySizedRef = useRef(false);
  const initialWindowSizeRef = useRef(clampInitialWindowSize(initialSize));
  const sizeRef = useRef(initialWindowSizeRef.current);
  const [size, setSize] = useState(initialWindowSizeRef.current);
  const [position, setPosition] = useState(() => (
    centered
      ? { x: 0, y: 0 }
      : computeCenteredTopLeft(initialWindowSizeRef.current)
  ));
  const [isReady, setIsReady] = useState(centered && !autoFit);
  const [mobileFit, setMobileFit] = useState(() => (
    typeof window !== 'undefined' && isMobileViewport()
  ));

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    const syncMobile = () => setMobileFit(isMobileViewport());
    syncMobile();
    window.addEventListener('resize', syncMobile);
    window.visualViewport?.addEventListener('resize', syncMobile);
    return () => {
      window.removeEventListener('resize', syncMobile);
      window.visualViewport?.removeEventListener('resize', syncMobile);
    };
  }, []);

  const getViewportLimits = useCallback(() => {
    const viewportWidth = getViewportWidth();
    const viewportHeight = getViewportContentHeight();
    const viewportPadding = getViewportPadding();
    const isMobile = isMobileViewport();
    const maxWidthRatio = isMobile ? MOBILE_MAX_WIDTH_RATIO : MAX_WIDTH_RATIO;
    return {
      maxWidth: Math.max(
        MIN_WIDTH,
        Math.min(viewportWidth - viewportPadding * 2, viewportWidth * maxWidthRatio)
      ),
      maxHeight: Math.max(MIN_HEIGHT, viewportHeight - viewportPadding * 2)
    };
  }, []);

  const clampWindowPosition = useCallback((pos, width, height) => {
    const viewportWidth = getViewportWidth();
    const viewportHeight = getViewportContentHeight();
    const viewportPadding = getViewportPadding();
    const minX = viewportPadding;
    const minY = viewportPadding;
    const maxX = Math.max(minX, viewportWidth - width - viewportPadding);
    const maxY = Math.max(minY, viewportHeight - height - viewportPadding);
    return {
      x: Math.min(Math.max(pos.x, minX), maxX),
      y: Math.min(Math.max(pos.y, minY), maxY)
    };
  }, []);

  const measureAndFit = useCallback(() => {
    if (!autoFit) return;
    if (userManuallySizedRef.current) return;
    if (!contentRef.current) return;
    const shell = contentRef.current.firstElementChild;
    const contentRoot =
      shell?.firstElementChild ||
      shell ||
      contentRef.current;
    const { maxWidth, maxHeight } = getViewportLimits();
    const measuredWidth = Math.max(contentRoot.scrollWidth, contentRoot.clientWidth) + CHROME_WIDTH;
    const measuredHeight = Math.max(contentRoot.scrollHeight, contentRoot.clientHeight) + CHROME_HEIGHT;
    const mobile = isMobileViewport();
    const fittedSize = {
      width: mobile
        ? maxWidth
        : Math.min(maxWidth, Math.max(MIN_WIDTH, measuredWidth)),
      height: Math.min(maxHeight, Math.max(MIN_HEIGHT, measuredHeight)),
    };
    const prevSize = sizeRef.current;
    setSize(fittedSize);
    if (centered) return;
    setPosition((prev) => {
      if (hasUserMovedRef.current) {
        return clampWindowPosition(prev, fittedSize.width, fittedSize.height);
      }
      const cx = prev.x + prevSize.width / 2;
      const cy = prev.y + prevSize.height / 2;
      const next = {
        x: Math.round(cx - fittedSize.width / 2),
        y: Math.round(cy - fittedSize.height / 2)
      };
      return clampWindowPosition(next, fittedSize.width, fittedSize.height);
    });
  }, [clampWindowPosition, getViewportLimits, autoFit, centered]);

  useLayoutEffect(() => {
    hasUserMovedRef.current = false;
    userManuallySizedRef.current = false;
    if (autoFit) {
      measureAndFit();
    }
    setIsReady(true);
  }, [children, measureAndFit, autoFit]);

  useEffect(() => {
    const handleViewportResize = () => {
      if (userManuallySizedRef.current) {
        const { maxWidth, maxHeight } = getViewportLimits();
        const clampedWidth = Math.min(Math.max(MIN_WIDTH, sizeRef.current.width), maxWidth);
        const clampedHeight = Math.min(Math.max(MIN_HEIGHT, sizeRef.current.height), maxHeight);
        setSize({ width: clampedWidth, height: clampedHeight });
        if (!centered) {
          setPosition((prev) => clampWindowPosition(prev, clampedWidth, clampedHeight));
        }
      } else if (autoFit) {
        measureAndFit();
      } else if (isMobileViewport()) {
        const clamped = clampInitialWindowSize(initialSize);
        setSize(clamped);
      } else if (!centered) {
        setPosition((prev) => clampWindowPosition(
          prev,
          sizeRef.current.width,
          sizeRef.current.height
        ));
      }
    };

    let observer = null;
    if (autoFit && contentRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measureAndFit();
      });
      observer.observe(contentRef.current);
      if (contentRef.current.firstElementChild) {
        observer.observe(contentRef.current.firstElementChild);
      }
    }

    window.addEventListener('resize', handleViewportResize);
    window.addEventListener('orientationchange', handleViewportResize);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleViewportResize);
      vv.addEventListener('scroll', handleViewportResize);
    }
    return () => {
      window.removeEventListener('resize', handleViewportResize);
      window.removeEventListener('orientationchange', handleViewportResize);
      if (vv) {
        vv.removeEventListener('resize', handleViewportResize);
        vv.removeEventListener('scroll', handleViewportResize);
      }
      if (observer) observer.disconnect();
    };
  }, [children, clampWindowPosition, getViewportLimits, measureAndFit, autoFit, centered, initialSize]);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    userManuallySizedRef.current = true;

    const startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const startWidth = sizeRef.current.width;
    const startHeight = sizeRef.current.height;
    const touchMoveOptions = { passive: false };

    const onMove = (moveEvent) => {
      if (!isResizing.current) return;
      moveEvent.preventDefault();

      const currentX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const { maxWidth, maxHeight } = getViewportLimits();
      const newWidth = Math.min(maxWidth, Math.max(MIN_WIDTH, startWidth + (currentX - startX)));
      const newHeight = Math.min(maxHeight, Math.max(MIN_HEIGHT, startHeight + (currentY - startY)));

      setSize({ width: newWidth, height: newHeight });
    };

    const onEnd = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove, touchMoveOptions);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, touchMoveOptions);
    window.addEventListener('touchend', onEnd);
  };

  const windowClassName = [
    'mac-window',
    minimized ? 'mac-window--minimized' : '',
    centered ? 'mac-window--overlay' : '',
    mobileFit ? 'mac-window--mobile-fit' : '',
    !isReady ? 'mac-window--pending' : ''
  ].filter(Boolean).join(' ');

  const windowStyle = {
    zIndex,
    width: mobileFit ? '100%' : size.width,
    maxWidth: mobileFit ? `${size.width}px` : undefined,
    height: minimized ? undefined : size.height,
    maxHeight: mobileFit ? `min(${size.height}px, calc(100dvh - 74px))` : undefined,
    resize: 'none',
    visibility: isReady ? 'visible' : 'hidden',
  };

  const windowNode = (
    <div
      ref={nodeRef}
      className={windowClassName}
      style={windowStyle}
    >
      <div
        className="mac-titlebar"
        onDoubleClick={(e) => {
          if (onToggleMinimize) {
            e.stopPropagation();
            onToggleMinimize();
          }
        }}
      >
        <button
          className="mac-close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        ></button>

        <div className="mac-titlebar-stripes"></div>
        <div className="mac-titlebar-text">{title}</div>

        <button
          className="mac-zoom-btn"
          aria-label={minimized ? 'Restore window' : 'Collapse window'}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleMinimize) onToggleMinimize();
          }}
        ></button>
      </div>

      {!minimized && (
        <div className="mac-content" ref={contentRef}>
          <div className={mobileFit ? 'mac-app-shell mac-app-shell--mobile' : 'mac-app-shell'}>
            {children}
          </div>
        </div>
      )}

      {!minimized && (
        <div
          className="mac-resize-handle"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        ></div>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="mac-window-layer" style={{ zIndex }} onMouseDown={onClick}>
        <Draggable
          nodeRef={nodeRef}
          defaultPosition={{ x: 0, y: 0 }}
          bounds="parent"
          onStart={() => {
            hasUserMovedRef.current = true;
          }}
          handle=".mac-titlebar"
          cancel=".mac-close-btn, .mac-content, .mac-resize-handle"
        >
          {windowNode}
        </Draggable>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      bounds="parent"
      onStart={() => {
        hasUserMovedRef.current = true;
      }}
      onDrag={(_, data) => {
        setPosition({ x: data.x, y: data.y });
      }}
      onMouseDown={onClick}
      handle=".mac-titlebar"
      cancel=".mac-close-btn, .mac-content, .mac-resize-handle"
    >
      {windowNode}
    </Draggable>
  );
};

export default Window;
