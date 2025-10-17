# Accessibility (a11y) Guidelines

## Core Principles (WCAG)

### Perceivable
Users must be able to perceive the information being presented

### Operable
Users must be able to operate the interface

### Understandable
Users must be able to understand the information and interface

### Robust
Content must be robust enough for various user agents

## Semantic HTML

### Use Proper Elements
```typescript
// Good: Semantic HTML
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>&copy; 2024</p>
</footer>

// Bad: Non-semantic divs
<div className="header">
  <div className="nav">
    <div className="link">Home</div>
  </div>
</div>
```

### Headings Hierarchy
```typescript
// Maintain proper heading order
<h1>Main Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

// Don't skip levels
// Bad: h1 -> h3 (skipping h2)
```

## ARIA Attributes

### ARIA Labels
```typescript
// Label interactive elements
<button aria-label="Close modal">×</button>

<input 
  type="search" 
  aria-label="Search products"
  placeholder="Search..."
/>

// Describe purpose when visual label isn't enough
<button aria-label="Delete item">
  <TrashIcon />
</button>
```

### ARIA Roles
```typescript
// Use when semantic HTML isn't available
<div role="alert" aria-live="polite">
  Form submitted successfully!
</div>

<div role="navigation" aria-label="Main navigation">
  {/* Navigation items */}
</div>

// Most semantic HTML elements have implicit roles
// Prefer <nav> over <div role="navigation">
```

### ARIA States and Properties
```typescript
// Expanded/collapsed state
<button 
  aria-expanded={isOpen}
  aria-controls="menu"
>
  Menu
</button>
<div id="menu" hidden={!isOpen}>
  {/* Menu items */}
</div>

// Selected state
<button 
  role="tab"
  aria-selected={isActive}
  aria-controls="panel-1"
>
  Tab 1
</button>

// Required fields
<input 
  type="email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

## Keyboard Navigation

### Focusable Elements
```typescript
// Ensure all interactive elements are keyboard accessible
<button onClick={handleClick}>
  Click me
</button>

// Make non-button elements accessible
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom button
</div>
```

### Tab Order
```typescript
// Natural tab order is best
// Use tabIndex sparingly

// Remove from tab order
<div tabIndex={-1}>Not focusable</div>

// Add to tab order (avoid if possible)
<div tabIndex={0}>Focusable</div>

// Don't use positive tabIndex (anti-pattern)
// Bad: <div tabIndex={1}>
```

### Focus Management
```typescript
// Trap focus in modals
const Modal = ({ isOpen, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const modal = modalRef.current;
    if (!modal) return;
    
    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Focus first focusable element in modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
    
    // Return focus on close
    return () => {
      previouslyFocused?.focus();
    };
  }, [isOpen]);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
};
```

### Skip Links
```typescript
// Allow users to skip navigation
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<nav>{/* Navigation */}</nav>

<main id="main-content">
  {/* Main content */}
</main>

// Style skip link
<style>{`
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 0;
  }
`}</style>
```

## Forms

### Labels
```typescript
// Always label inputs
<label htmlFor="email">Email Address</label>
<input 
  type="email" 
  id="email" 
  name="email"
  required
/>

// Alternative: aria-label
<input 
  type="search" 
  aria-label="Search"
  placeholder="Search..."
/>
```

### Error Messages
```typescript
// Associate errors with inputs
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<div>
  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  )}
</div>
```

### Form Validation
```typescript
// Provide clear validation messages
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      required
      minLength={8}
      aria-describedby="password-requirements"
    />
    <div id="password-requirements">
      Password must be at least 8 characters
    </div>
  </div>
</form>
```

## Images and Media

### Alt Text
```typescript
// Descriptive alt text for meaningful images
<img 
  src="chart.png" 
  alt="Bar chart showing 30% increase in sales in Q4" 
/>

// Empty alt for decorative images
<img src="decorative-line.png" alt="" />

// Avoid "image of" or "picture of"
// Bad: alt="Picture of a cat"
// Good: alt="Orange tabby cat sleeping on a couch"
```

### Icons
```typescript
// Icon with text
<button>
  <SaveIcon aria-hidden="true" />
  Save
</button>

// Icon without text
<button aria-label="Save">
  <SaveIcon aria-hidden="true" />
</button>
```

### Videos
```typescript
// Provide captions and transcripts
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track 
    kind="captions" 
    src="captions.vtt" 
    srcLang="en" 
    label="English"
  />
  Your browser doesn't support video.
</video>
```

## Color and Contrast

### Color Contrast
```css
/* WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text */
/* WCAG AAA Standard: 7:1 for normal text, 4.5:1 for large text */

/* Good contrast */
.text {
  color: #333; /* Dark text */
  background: #fff; /* White background */
}

/* Check contrast ratios with tools */
```

### Don't Rely on Color Alone
```typescript
// Bad: Color only
<span style={{ color: 'red' }}>Error</span>
<span style={{ color: 'green' }}>Success</span>

// Good: Color + icon/text
<span style={{ color: 'red' }}>
  <ErrorIcon aria-hidden="true" />
  Error
</span>
<span style={{ color: 'green' }}>
  <CheckIcon aria-hidden="true" />
  Success
</span>
```

## Live Regions

### Announcements
```typescript
// Announce dynamic content changes
const [message, setMessage] = useState('');

<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {message}
</div>

// For urgent messages
<div 
  role="alert" 
  aria-live="assertive"
>
  {errorMessage}
</div>
```

## Screen Reader Testing

### Hidden Content
```typescript
// Visually hidden but available to screen readers
<span className="sr-only">
  Navigate to homepage
</span>

// CSS for sr-only
<style>{`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`}</style>

// Hide from screen readers
<div aria-hidden="true">
  Decorative content
</div>
```

## Accessibility Checklist

### Essential
- ✅ All images have appropriate alt text
- ✅ Form inputs have associated labels
- ✅ Proper heading hierarchy (h1-h6)
- ✅ Sufficient color contrast (WCAG AA minimum)
- ✅ Keyboard navigation works throughout
- ✅ Focus indicators visible
- ✅ Semantic HTML elements used
- ✅ ARIA labels for icon buttons

### Advanced
- ✅ Skip navigation link provided
- ✅ Focus management in modals
- ✅ Live regions for dynamic content
- ✅ No keyboard traps
- ✅ Error messages associated with inputs
- ✅ Loading states announced
- ✅ Screen reader tested
- ✅ Zoom to 200% works properly

### Tools
- Use browser DevTools accessibility features
- Install axe DevTools extension
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Use automated testing (jest-axe, @testing-library)
- Validate with WAVE browser extension
- Check with Lighthouse accessibility audit

## Common Mistakes to Avoid

- ❌ Div/span elements for buttons
- ❌ Missing alt text on images
- ❌ Poor color contrast
- ❌ Unlabeled form inputs
- ❌ Keyboard inaccessible elements
- ❌ Incorrect heading hierarchy
- ❌ Missing focus indicators
- ❌ Using placeholder as label
- ❌ Redundant ARIA (semantic HTML already conveys meaning)
- ❌ Not testing with keyboard only
- ❌ Not testing with screen readers

