/**
 * CSS breakpoint constants for responsive design
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
} as const;

/**
 * Layout constants for grid and spacing
 */
export const LAYOUT = {
  SIDEBAR_WIDTH_DESKTOP: 300,
  SIDEBAR_WIDTH_TABLET: 260,
  GAP_DESKTOP: 60,
  GAP_TABLET: 20,
  GAP_MOBILE: 16,
  CONTAINER_PADDING: 24,
} as const;

/**
 * Grid template values for CSS
 */
export const GRID_TEMPLATES = {
  TWO_COLUMN: (sidebarWidth: number) => `${sidebarWidth}px 1fr`,
  ONE_COLUMN: '1fr',
} as const;
