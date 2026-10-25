import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Top-Right Theme Toggle Component
 * Allows users to choose between:
 * - Bright Theme (Sun symbol)
 * - Dark Theme (Moon symbol)
 */
const ThemeToggle = ({ className = '', showLabels = true }) => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div
      className={`theme-switch-capsule ${className}`}
      role="radiogroup"
      aria-label="Theme Selection (Bright or Dark)"
    >
      <button
        type="button"
        className={`theme-switch-btn ${!isDark ? 'active-bright' : ''}`}
        onClick={() => setTheme('light')}
        title="Bright Theme (Sun) - Clean institutional view"
        aria-label="Select Bright Theme (Sun)"
        aria-checked={!isDark}
        role="radio"
      >
        <Sun size={16} className="theme-symbol sun-symbol" />
        {showLabels && <span className="theme-btn-label">Bright</span>}
      </button>

      <button
        type="button"
        className={`theme-switch-btn ${isDark ? 'active-dark' : ''}`}
        onClick={() => setTheme('dark')}
        title="Dark Theme (Moon) - Menacing dark obsidian view"
        aria-label="Select Dark Theme (Moon)"
        aria-checked={isDark}
        role="radio"
      >
        <Moon size={16} className="theme-symbol moon-symbol" />
        {showLabels && <span className="theme-btn-label">Dark</span>}
      </button>
    </div>
  );
};

export default ThemeToggle;
