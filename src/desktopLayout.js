export const MENU_BAR_HEIGHT = 28;
export const BOTTOM_CHROME_HEIGHT = 34;
export const DESKTOP_PADDING = 10;
export const MOBILE_EDGE_PADDING = 12;
export const ICON_WIDTH = 80;
export const ICON_ROW_HEIGHT = 82;
export const MOBILE_ICON_WIDTH = 68;
export const MOBILE_ICON_ROW_HEIGHT = 58;

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

/** Large centered app window — uses most of the desktop without going edge-to-edge. */
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
    return getResponsiveWindowSize({
      width: Math.max(minWidth, width - padding * 2),
      height: Math.max(minHeight, Math.floor(height * 0.88)),
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
  const maxWidth = Math.max(240, width - padding * 2);
  const maxHeight = Math.max(180, height - padding * 2);
  if (!isMobile) {
    return {
      width: Math.min(preferred.width, maxWidth),
      height: Math.min(preferred.height, maxHeight),
    };
  }
  return {
    width: maxWidth,
    height: Math.min(preferred.height, Math.floor(maxHeight * 0.82)),
  };
}

/** Positions for desktop icons inside `.desktop-area` (padding-aware). */
export function getDesktopLayout(width, height) {
  const isMobile = width <= 768;
  const isSmall = width <= 480;
  const pad = isMobile ? 4 : DESKTOP_PADDING;
  const iconWidth = isMobile ? MOBILE_ICON_WIDTH : ICON_WIDTH;
  const rowGap = isSmall ? MOBILE_ICON_ROW_HEIGHT : isMobile ? MOBILE_ICON_ROW_HEIGHT + 2 : ICON_ROW_HEIGHT;
  const topY = isSmall ? 2 : isMobile ? 4 : 20;

  const contentWidth = width - pad * 2;
  const leftColumnX = isMobile ? 0 : pad;
  const rightColumnX = isMobile
    ? Math.min(iconWidth + 4, Math.max(iconWidth + 4, contentWidth - iconWidth))
    : Math.max(leftColumnX + ICON_WIDTH + 8, contentWidth - ICON_WIDTH);
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
