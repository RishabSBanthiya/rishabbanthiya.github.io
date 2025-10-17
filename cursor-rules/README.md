# Cursor Rules for Rishab Banthiya Portfolio

This directory contains comprehensive development guidelines and best practices for building and maintaining the portfolio website.

## Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.2** - Type-safe JavaScript
- **Vite 4.5** - Build tool and dev server
- **Bootstrap 5.3** - CSS framework
- **ESLint** - Code linting

## Available Rule Files

### 1. Main Configuration
- **`.cursorrules`** - Main cursor rules file at project root

### 2. Detailed Guidelines

#### [react-best-practices.md](./react-best-practices.md)
Comprehensive React development guidelines including:
- Component structure and organization
- Hooks best practices (useState, useEffect, useCallback, useMemo)
- Props management
- Performance optimization
- Common patterns and anti-patterns

#### [typescript-guidelines.md](./typescript-guidelines.md)
TypeScript development standards covering:
- Type definitions and interfaces
- React + TypeScript integration
- Advanced patterns (generics, type guards, discriminated unions)
- Utility types
- Common pitfalls to avoid

#### [vite-configuration.md](./vite-configuration.md)
Vite-specific configuration and optimization:
- Development server setup
- Build optimization
- Code splitting strategies
- Asset handling
- Environment variables
- Path aliases

#### [bootstrap-integration.md](./bootstrap-integration.md)
Bootstrap 5.3 integration guidelines:
- Setup and usage
- Component integration with React
- Grid system and responsive design
- Utility classes
- Interactive components (modals, forms, alerts)
- Best practices and common patterns

#### [performance-optimization.md](./performance-optimization.md)
Performance optimization techniques:
- React performance (memo, useMemo, useCallback)
- Code splitting and lazy loading
- Asset optimization
- Network performance
- Rendering optimization
- Monitoring and profiling

#### [accessibility-guidelines.md](./accessibility-guidelines.md)
Web accessibility (a11y) standards:
- WCAG principles
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Forms accessibility
- Color and contrast
- Screen reader support

## How to Use

### For Cursor AI

The main `.cursorrules` file at the project root is automatically detected by Cursor AI and applied to your coding sessions.

### For Developers

1. **Quick Reference**: Check the main `.cursorrules` file for a quick overview
2. **Deep Dive**: Read specific guideline files in this directory for detailed best practices
3. **Before Coding**: Review relevant sections based on what you're working on
4. **Code Review**: Use these guidelines as a checklist during code reviews

## File Organization

```
.cursorrules                    # Main rules file (auto-detected by Cursor)
cursor-rules/                   # Detailed guidelines directory
├── README.md                   # This file
├── react-best-practices.md     # React development guide
├── typescript-guidelines.md    # TypeScript standards
├── vite-configuration.md       # Vite setup and optimization
├── bootstrap-integration.md    # Bootstrap usage guide
├── performance-optimization.md # Performance tips
└── accessibility-guidelines.md # Accessibility standards
```

## Contributing

When adding new rules:
1. Follow the existing format and structure
2. Include code examples
3. Explain the "why" not just the "what"
4. Add both good and bad examples
5. Keep guidelines practical and actionable

## Quick Tips

### Development Workflow
```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Common Patterns

#### Component Structure
```typescript
// Imports
import React, { useState } from 'react';

// Types
interface Props {
  title: string;
}

// Component
export function Component({ title }: Props) {
  const [state, setState] = useState('');
  
  return <div>{title}</div>;
}
```

#### Responsive Layout with Bootstrap
```typescript
<div className="container">
  <div className="row">
    <div className="col-12 col-md-6 col-lg-4">
      {/* Content */}
    </div>
  </div>
</div>
```

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com) - Browser compatibility
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing

## License

MIT - See LICENSE file in project root

---

**Last Updated**: October 2024
**Maintained by**: Rishab Banthiya

