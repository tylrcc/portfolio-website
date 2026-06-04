export const MENU_BAR_HEIGHT = 28;
export const DESKTOP_PADDING = 10;
export const ICON_WIDTH = 80;
export const ICON_ROW_HEIGHT = 82;

export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 1000, height: 700 };
  }
  const vv = window.visualViewport;
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round((vv?.height ?? window.innerHeight) - MENU_BAR_HEIGHT),
  };
}

/** Positions for desktop icons inside `.desktop-area` (padding-aware). */
export function getDesktopLayout(width, height) {
  const isMobile = width <= 768;
  const isSmall = width <= 480;
  const pad = DESKTOP_PADDING;
  const rowGap = isSmall ? 70 : isMobile ? 76 : ICON_ROW_HEIGHT;
  const topY = isSmall ? 10 : isMobile ? 12 : 20;

  const leftColumnX = isSmall ? 0 : isMobile ? 2 : pad;
  const maxX = Math.max(leftColumnX, width - pad - ICON_WIDTH);
  const rightColumnX = Math.max(leftColumnX + ICON_WIDTH + 8, maxX);
  const maxY = Math.max(topY, height - pad - ICON_ROW_HEIGHT);

  const iconY = (row) => topY + row * rowGap;

  return {
    isMobile,
    isSmall,
    leftColumnX,
    rightColumnX,
    iconY,
    maxX,
    maxY,
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
