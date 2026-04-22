export const COLORS = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1A2640',
  border: '#2D3F5A',
  accent: '#FF6B2B',
  accentLight: '#FF8F5E',
  accentDark: '#D94E15',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  star: '#FBBF24',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
  overlay: 'rgba(15,23,42,0.8)',
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const FONTS = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  extrabold: { fontWeight: '800' as const },
};
