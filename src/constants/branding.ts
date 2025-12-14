// Strategy& Branding Konstanten (offizielle Farben)

export const COLORS = {
  primary: '#A32020',      // Strategy& Dunkelrot
  secondary: '#DB536A',    // Strategy& Hellrot/Rosa
  accent: '#F5F5F5',       // Accent für UI-Elemente
  gray: '#7D7D7D',         // Strategy& Grau
  text: '#000000',         // Schwarz für Text
  white: '#FFFFFF',        // Weiß
  black: '#000000',        // Schwarz
  border: '#7D7D7D',       // Grau für Borders
  lightGray: '#F5F5F5',    // Sehr helles Grau für Hintergründe
} as const;

export const FONTS = [
  'Inter',
  'Helvetica Neue',
  'Arial',
  'Impact',
  'Comic Sans MS',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Trebuchet MS',
] as const;

export const FONT_SIZES = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 120
] as const;

export const TEXT_COLORS = [
  '#FFFFFF', // Weiß
  '#000000', // Schwarz
  '#FF6600', // Strategy& Orange
  '#FF0000', // Rot
  '#00FF00', // Grün
  '#0000FF', // Blau
  '#FFFF00', // Gelb
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#808080', // Grau
] as const;

export const ICON_COLORS = TEXT_COLORS;

export const BRANDING = {
  appName: 'Strategy& Meme Generator',
  tagline: 'A part of the PwC network',
  logoText: 'Strategy&',
  logoUrl: 'https://www.strategyand.pwc.com/de/de.html', // Link zur Website
} as const;

