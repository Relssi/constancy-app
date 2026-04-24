export const colors = {
  navy: '#0B2545',
  navyDeep: '#071833',
  navyDeeper: '#050E1F',
  navySoft: '#13315C',
  navyCard: 'rgba(255,255,255,0.035)',
  navyCardHi: 'rgba(255,255,255,0.06)',
  navyBorder: 'rgba(255,255,255,0.07)',
  navyBorderHi: 'rgba(255,255,255,0.12)',
  green: '#22C55E',
  greenBright: '#34E671',
  greenSoft: '#1FA34F',
  greenDeep: '#0A6B2F',
  greenGlow: 'rgba(34,197,94,0.22)',
  greenGlowStrong: 'rgba(34,197,94,0.45)',
  cream: '#F5F0E8',
  creamDeep: '#EDE5D6',
  textLight: '#F1F5F9',
  textMuted: 'rgba(241,245,249,0.62)',
  textDim: 'rgba(241,245,249,0.38)',
  textDark: '#0B2545',
  textDarkMuted: 'rgba(11,37,69,0.7)',
  danger: '#F87171',
  warn: '#FBBF24',
};

export const gradients = {
  streak: ['#0F3468', '#0B2545', '#071833'] as const,
  streakAccent: ['rgba(34,197,94,0.18)', 'rgba(34,197,94,0)'] as const,
  cta: ['#34E671', '#22C55E', '#1FA34F'] as const,
  glass: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,
  darkCard: ['rgba(255,255,255,0.045)', 'rgba(255,255,255,0.015)'] as const,
};

export const font = {
  serif: 'Fraunces, Georgia, "Times New Roman", serif',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  numeric: '"Space Grotesk", Inter, -apple-system, BlinkMacSystemFont, sans-serif',
};

// Tracking tokens (RN letterSpacing is in points, not em — use per-size)
export const tracking = {
  // -0.02em equivalents at common sizes
  tight: -0.3,
  tighter: -0.6,
  tightest: -1.2,
  normal: 0,
  loose: 0.4,
  caps: 1.2,
  capsWide: 2,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  pill: 999,
};

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  cardSoft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  glow: {
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 26,
    elevation: 12,
  },
  glowSoft: {
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
};
