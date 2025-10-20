import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Container, Row, Col } from 'reactstrap';
import './styles.scss';

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme, isThemeMenuOpen, setIsThemeMenuOpen } = useTheme();

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  return (
    <div className="theme-selector">
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        title="Change Theme"
      >
        <i className="fa fa-palette"></i>
        <span>Theme</span>
      </button>

      {isThemeMenuOpen && (
        <div className="theme-menu">
          <div className="theme-menu-header">
            <h4>Choose Your Theme</h4>
            <button 
              className="close-btn"
              onClick={() => setIsThemeMenuOpen(false)}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          
          <div className="theme-grid">
            {Object.entries(themes).map(([key, theme]) => (
              <div
                key={key}
                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                onClick={() => handleThemeChange(key)}
              >
                <div className="theme-preview">
                  {theme.colors.slice(0, 5).map((color, index) => (
                    <div
                      key={index}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="theme-name">{theme.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isThemeMenuOpen && (
        <div 
          className="theme-overlay"
          onClick={() => setIsThemeMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
