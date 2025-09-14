import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D8F',
    primaryContainer: '#B8E6ED',
    secondary: '#4CAF50',
    secondaryContainer: '#C8E6C9',
    tertiary: '#FF9800',
    tertiaryContainer: '#FFE0B2',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#F44336',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    onBackground: '#1C1B1F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4DD0E1',
    primaryContainer: '#2E7D8F',
    secondary: '#81C784',
    secondaryContainer: '#4CAF50',
    tertiary: '#FFB74D',
    tertiaryContainer: '#FF9800',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    background: '#000000',
    error: '#F44336',
    errorContainer: '#FFEBEE',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onTertiary: '#000000',
    onSurface: '#E3E3E3',
    onSurfaceVariant: '#CAC4D0',
    onBackground: '#E3E3E3',
    outline: '#938F99',
    outlineVariant: '#49454F',
  },
};

export const theme = lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const typography = {
  headline1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headline2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headline3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export const shadows = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  medium: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  large: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
};
