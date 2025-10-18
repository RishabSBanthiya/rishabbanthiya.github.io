# Theme System Documentation

## Overview

A toggleable theme system has been implemented with two themes inspired by different aesthetics:

1. **Terminal Theme** (Default) - Brown/beige terminal aesthetic
2. **Gas.zip Theme** - Cyberpunk/modern dark theme with neon green accents

## Features

### 🎨 Two Complete Themes

#### Terminal Theme
- Warm brown and beige color palette
- Classic terminal aesthetic
- Subtle, professional appearance

#### Gas.zip Theme
- Dark cyberpunk aesthetic (#0a0a0f background)
- Neon green (#00ff88) primary accents
- Cyan highlights (#00ffff)
- Glowing text effects and animations
- Scanline overlay effect
- Pulsing glow effects on UI elements

### ⚡ Smart Persistence
- Theme preference saved to localStorage
- Automatically restores user's last selected theme on page load

### 🎯 Implementation Details

#### Files Created
- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/components/ThemeToggle.tsx` - Toggle button component
- `src/styles/theme.css` - CSS variables and theme definitions

#### Files Modified
- `src/main.tsx` - Added ThemeProvider wrapper
- `src/App.tsx` - Added ThemeToggle component
- `src/styles/App.css` - Converted all hardcoded colors to CSS variables
- `src/styles/index.css` - Updated global styles to use theme variables

### 🎛️ CSS Variables

All colors and styles now use CSS variables:

```css
--bg-primary          /* Main background color */
--bg-secondary        /* Secondary background (headers, etc.) */
--bg-tertiary         /* Tertiary background (buttons, etc.) */
--text-primary        /* Primary text color */
--text-secondary      /* Secondary text color */
--text-tertiary       /* Tertiary text color */
--accent-primary      /* Primary accent color */
--accent-success      /* Success state color */
--accent-error        /* Error state color */
--border-primary      /* Primary border color */
--border-secondary    /* Secondary border color */
--shadow-sm           /* Small shadow */
--shadow-md           /* Medium shadow */
```

### 🌟 Gas.zip Theme Special Effects

1. **Scanline Overlay** - Subtle horizontal lines for CRT effect
2. **Text Glow** - Neon glow on important text elements
3. **Pulsing Animation** - Theme toggle button pulses
4. **Border Glow** - Terminal windows have glowing borders
5. **Smooth Transitions** - All color changes animate smoothly

### 🎮 User Experience

- **Toggle Button**: Fixed position (top-right corner)
- **Visual Feedback**: Icon changes based on current theme
- **Responsive**: Adapts to mobile screens
- **Accessible**: Proper ARIA labels and keyboard support

## Usage

Users can toggle between themes by clicking the button in the top-right corner of the screen. The button displays:
- ⚡ + "Gas.zip" when on Terminal theme (click to switch to Gas.zip)
- 🖥️ + "Terminal" when on Gas.zip theme (click to switch to Terminal)

## Technical Implementation

### Theme Context
```typescript
const { theme, toggleTheme } = useTheme()
```

### Data Attribute
The theme is applied via a data attribute on the root element:
```html
<html data-theme="terminal"> or <html data-theme="gaszip">
```

All CSS rules automatically switch based on this attribute using CSS variable selectors.

## Browser Support

- Modern browsers with CSS custom properties support
- localStorage for persistence
- Graceful fallback to default theme if localStorage is unavailable

## Performance

- CSS-only theme switching (no JavaScript re-renders)
- Smooth 0.3s transitions for all color changes
- Optimized animations using CSS transforms
- No layout shifts during theme changes

