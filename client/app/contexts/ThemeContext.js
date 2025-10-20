import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the 8 color palettes
export const THEMES = {
  forest: {
    name: 'Forest Green',
    colors: ['#dad7cd', '#a3b18a', '#588157', '#3a5a40', '#344e41'],
    primary: '#588157',
    secondary: '#3a5a40',
    accent: '#a3b18a',
    background: '#dad7cd',
    text: '#344e41'
  },
  earth: {
    name: 'Earth Tones',
    colors: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#b6ad90', '#c2c5aa', '#a4ac86', '#656d4a', '#414833', '#333d29'],
    primary: '#7f4f24',
    secondary: '#582f0e',
    accent: '#a68a64',
    background: '#b6ad90',
    text: '#333d29'
  },
  pastel: {
    name: 'Pastel Dreams',
    colors: ['#edafb8', '#f7e1d7', '#dedbd2', '#b0c4b1', '#4a5759'],
    primary: '#edafb8',
    secondary: '#4a5759',
    accent: '#b0c4b1',
    background: '#f7e1d7',
    text: '#4a5759'
  },
  neutral: {
    name: 'Neutral Elegance',
    colors: ['#ede0d4', '#e6ccb2', '#ddb892', '#b08968', '#7f5539', '#9c6644'],
    primary: '#b08968',
    secondary: '#7f5539',
    accent: '#ddb892',
    background: '#ede0d4',
    text: '#7f5539'
  },
  sage: {
    name: 'Sage Green',
    colors: ['#6b9080', '#a4c3b2', '#cce3de', '#eaf4f4', '#f6fff8'],
    primary: '#6b9080',
    secondary: '#4a5759',
    accent: '#a4c3b2',
    background: '#f6fff8',
    text: '#4a5759'
  },
  forest_dark: {
    name: 'Dark Forest',
    colors: ['#cad2c5', '#84a98c', '#52796f', '#354f52', '#2f3e46'],
    primary: '#52796f',
    secondary: '#2f3e46',
    accent: '#84a98c',
    background: '#cad2c5',
    text: '#2f3e46'
  },
  ocean: {
    name: 'Ocean Breeze',
    colors: ['#ffa69e', '#faf3dd', '#b8f2e6', '#aed9e0', '#5e6472'],
    primary: '#5e6472',
    secondary: '#4a5759',
    accent: '#aed9e0',
    background: '#faf3dd',
    text: '#5e6472'
  },
  sunset: {
    name: 'Sunset Glow',
    colors: ['#ff6b6b', '#ffa726', '#ffcc80', '#d4e157', '#81c784'],
    primary: '#ff6b6b',
    secondary: '#d32f2f',
    accent: '#ffa726',
    background: '#fff3e0',
    text: '#d32f2f'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get theme from localStorage or default to forest
    const savedTheme = localStorage.getItem('selectedTheme');
    return savedTheme && THEMES[savedTheme] ? savedTheme : 'forest';
  });

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
      applyTheme(THEMES[themeName]);
      setIsThemeMenuOpen(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-text', theme.text);
    
    // Apply theme colors to specific elements
    root.style.setProperty('--theme-button-primary', theme.primary);
    root.style.setProperty('--theme-button-secondary', theme.secondary);
    root.style.setProperty('--theme-link-color', theme.primary);
    root.style.setProperty('--theme-border-color', theme.accent);
    root.style.setProperty('--theme-card-background', theme.background);
    
    // Additional theme variables for better control
    root.style.setProperty('--theme-text-primary', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.secondary);
    root.style.setProperty('--theme-text-light', theme.accent);
    root.style.setProperty('--theme-hover', theme.primary);
    root.style.setProperty('--theme-focus', theme.secondary);
    root.style.setProperty('--theme-shadow', `${theme.secondary}33`);
    root.style.setProperty('--theme-border', theme.accent);
    root.style.setProperty('--theme-input-bg', '#ffffff');
    root.style.setProperty('--theme-input-border', theme.accent);
    root.style.setProperty('--theme-input-focus', theme.primary);
  };

  useEffect(() => {
    // Apply theme on mount
    applyTheme(THEMES[currentTheme]);
  }, [currentTheme]);

  const value = {
    currentTheme,
    themes: THEMES,
    changeTheme,
    isThemeMenuOpen,
    setIsThemeMenuOpen
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
