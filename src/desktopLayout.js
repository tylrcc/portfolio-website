export const MENU_BAR_HEIGHT = 28;
export const BOTTOM_CHROME_HEIGHT = 34;
export const DESKTOP_PADDING = 10;
export const MOBILE_EDGE_PADDING = 10;
export const ICON_WIDTH = 80;
export const ICON_ROW_HEIGHT = 82;
export const MOBILE_ICON_WIDTH = 72;
export const MOBILE_ICON_ROW_HEIGHT = 70;

export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 1000, height: 700 };
  }
  const vv = window.visualViewport;
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round(getViewportContentHeight()),
  };
}

/** Usable height below the menu bar and above the bottom control strips. */
export function getViewportContentHeight() {
  if (typeof window === 'undefined') {
    return 700;
  }
  const vv = window.visualViewport;
  const fullHeight = vv?.height ?? window.innerHeight;
  return Math.round(fullHeight - MENU_BAR_HEIGHT - BOTTOM_CHROME_HEIGHT);
}

export function getViewportWidth() {
  if (typeof window === 'undefined') {
    return 1000;
  }
  return Math.round(window.visualViewport?.width ?? window.innerWidth);
}

export function isMobileViewport() {
  return getViewportWidth() <= 768;
}

export function getViewportPadding() {
  if (typeof window === 'undefined') {
    return 20;
  }
  return isMobileViewport() ? MOBILE_EDGE_PADDING : 20;
}

/** Large centered app window, uses most of the desktop without going edge-to-edge. */
export function getLargeAppWindowSize(options = {}) {
  const {
    minWidth = 760,
    minHeight = 580,
    widthRatio = 0.9,
    heightRatio = 0.86,
  } = options;

  if (typeof window === 'undefined') {
    return { width: minWidth, height: minHeight };
  }

  const width = getViewportWidth();
  const height = getViewportContentHeight();
  const padding = getViewportPadding();
  const isMobile = isMobileViewport();

  if (isMobile) {
    // Keep phone windows inset and shorter so they don't swallow the desktop.
    return getResponsiveWindowSize({
      width: Math.max(280, width - padding * 2),
      height: Math.max(260, Math.floor(height * 0.7)),
    });
  }

  const maxWidth = Math.max(minWidth, width - padding * 2);
  const maxHeight = Math.max(minHeight, height - padding * 2);

  return {
    width: Math.min(maxWidth, Math.max(minWidth, Math.floor(width * widthRatio))),
    height: Math.min(maxHeight, Math.max(minHeight, Math.floor(height * heightRatio))),
  };
}

/** Clamp a preferred window size to the current viewport (mobile-first). */
export function getResponsiveWindowSize(preferred) {
  if (typeof window === 'undefined') {
    return preferred;
  }
  const width = getViewportWidth();
  const height = getViewportContentHeight();
  const padding = getViewportPadding();
  const isMobile = isMobileViewport();
  if (!isMobile) {
    const maxWidth = Math.max(240, width - padding * 2);
    const maxHeight = Math.max(180, height - padding * 2);
    return {
      width: Math.min(preferred.width, maxWidth),
      height: Math.min(preferred.height, maxHeight),
    };
  }
  const edge = Math.max(padding, 12);
  const maxWidth = Math.max(240, Math.floor(width - edge * 2));
  const maxHeight = Math.max(200, Math.floor(height * 0.7));
  return {
    width: Math.min(preferred.width, maxWidth),
    height: Math.min(preferred.height, maxHeight),
  };
}

/** Positions for desktop icons inside `.desktop-area` (padding-aware). */
export function getDesktopLayout(width, height) {
  const isMobile = width <= 768;
  const isSmall = width <= 480;
  const pad = isMobile ? 8 : DESKTOP_PADDING;
  const iconWidth = isMobile ? MOBILE_ICON_WIDTH : ICON_WIDTH;
  const rowGap = isSmall ? 66 : isMobile ? MOBILE_ICON_ROW_HEIGHT : ICON_ROW_HEIGHT;
  const topY = isSmall ? 6 : isMobile ? 8 : 20;

  const contentWidth = width - pad * 2;
  const leftColumnX = pad;
  // Keep the two columns on opposite edges (old Math.min pinned both to the left).
  const rightColumnX = Math.max(leftColumnX + iconWidth + 12, contentWidth - iconWidth);
  const maxX = Math.max(leftColumnX, contentWidth - iconWidth);
  const maxY = Math.max(topY, height - pad - rowGap);

  const iconY = (row) => topY + row * rowGap;

  return {
    isMobile,
    isSmall,
    leftColumnX,
    rightColumnX,
    iconY,
    maxX,
    maxY,
    iconWidth,
    contentWidth: width - pad * 2,
    contentHeight: height - pad * 2,
  };
}

export function clampIconPosition(position, layout) {
  return {
    x: Math.min(Math.max(0, position.x), layout.maxX),
    y: Math.min(Math.max(0, position.y), layout.maxY),
  };
}
