# Bootstrap 5.3 Integration Guidelines

## Setup and Usage

### Import Bootstrap

```typescript
// main.tsx - Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Optional: Import Bootstrap JS for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### Custom Styles

```css
/* Import Bootstrap first, then custom styles */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Your custom CSS overrides */
:root {
  /* Override Bootstrap variables if needed */
  --bs-primary: #your-color;
}
```

## Component Integration

### Bootstrap Components with React

```typescript
// Use Bootstrap classes in JSX
export function Card({ title, content }: CardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
}
```

### Navigation

```typescript
export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Brand</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#home">Home</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
```

## Layout System

### Grid System

```typescript
// 12-column grid
<div className="container">
  <div className="row">
    <div className="col-md-6 col-lg-4">Column 1</div>
    <div className="col-md-6 col-lg-4">Column 2</div>
    <div className="col-md-12 col-lg-4">Column 3</div>
  </div>
</div>

// Auto-layout columns
<div className="container">
  <div className="row">
    <div className="col">Equal width</div>
    <div className="col">Equal width</div>
  </div>
</div>
```

### Responsive Breakpoints

```typescript
// Bootstrap breakpoints
// xs: <576px
// sm: ≥576px
// md: ≥768px
// lg: ≥992px
// xl: ≥1200px
// xxl: ≥1400px

<div className="d-none d-md-block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>

<div className="col-12 col-md-6 col-lg-4">
  {/* Full width mobile, half on tablet, third on desktop */}
</div>
```

## Utility Classes

### Spacing

```typescript
// Margin and Padding
// m/p - {t,b,l,r,x,y} - {0-5}
<div className="mt-3 mb-4 px-2 py-3">
  {/* margin-top: 1rem, margin-bottom: 1.5rem */}
  {/* padding-left/right: 0.5rem, padding-top/bottom: 1rem */}
</div>
```

### Colors

```typescript
// Text colors
<p className="text-primary">Primary text</p>
<p className="text-danger">Danger text</p>
<p className="text-muted">Muted text</p>

// Background colors
<div className="bg-primary text-white">Primary background</div>
<div className="bg-light">Light background</div>
```

### Display

```typescript
// Display utilities
<div className="d-flex justify-content-between align-items-center">
  <span>Left</span>
  <span>Right</span>
</div>

<div className="d-grid gap-3">
  {/* CSS Grid with gap */}
</div>
```

## Interactive Components

### Modals with React

```typescript
import { useEffect, useRef } from 'react';

export function Modal({ show, onHide, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    
    // Use Bootstrap modal instance
    const bsModal = new (window as any).bootstrap.Modal(modal);
    
    if (show) {
      bsModal.show();
    } else {
      bsModal.hide();
    }
    
    return () => bsModal.dispose();
  }, [show]);
  
  return (
    <div 
      className="modal fade" 
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

### Forms

```typescript
export function ContactForm() {
  const [validated, setValidated] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    
    const form = e.currentTarget;
    if (form.checkValidity()) {
      // Submit form
    }
  };
  
  return (
    <form 
      className={`needs-validation ${validated ? 'was-validated' : ''}`}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          className="form-control" 
          id="email"
          required 
        />
        <div className="invalid-feedback">
          Please provide a valid email.
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}
```

### Alerts

```typescript
export function Alert({ variant, message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${variant} alert-dismissible fade show`}>
      {message}
      <button 
        type="button" 
        className="btn-close" 
        onClick={onClose}
      />
    </div>
  );
}
```

## Best Practices

### Do's

✅ Use Bootstrap utility classes for common styling
✅ Leverage the grid system for responsive layouts
✅ Use Bootstrap components for consistent UI
✅ Combine Bootstrap classes with custom CSS when needed
✅ Follow Bootstrap naming conventions
✅ Use container classes for proper spacing
✅ Implement responsive breakpoints
✅ Use Bootstrap's color system for consistency

### Don'ts

❌ Override Bootstrap styles unnecessarily
❌ Mix Bootstrap grid with custom grid systems
❌ Use inline styles instead of utility classes
❌ Ignore responsive breakpoints
❌ Load unused Bootstrap components
❌ Fight against Bootstrap conventions
❌ Use deprecated Bootstrap classes
❌ Overuse !important to override styles

## Common Patterns

### Hero Section

```typescript
export function Hero() {
  return (
    <section className="hero bg-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">Welcome</h1>
            <p className="lead">Your description here</p>
            <button className="btn btn-light btn-lg">Get Started</button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Card Grid

```typescript
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {projects.map((project) => (
          <div key={project.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <img 
                src={project.image} 
                className="card-img-top" 
                alt={project.title} 
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text flex-grow-1">{project.description}</p>
                <a href={project.link} className="btn btn-primary mt-auto">
                  View Project
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Customization

### Override Variables

```css
/* Create custom.scss */
/* Override Bootstrap variables before import */
$primary: #your-color;
$font-family-base: 'Your Font', sans-serif;

@import '~bootstrap/scss/bootstrap';

/* Your custom styles */
```

### Custom Utilities

```css
/* Add custom utility classes */
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.custom-card {
  border-radius: 1rem;
  transition: transform 0.3s;
}

.custom-card:hover {
  transform: translateY(-5px);
}
```

## Performance Tips

1. Import only needed Bootstrap components
2. Use Bootstrap's built-in utilities instead of custom CSS
3. Minimize custom overrides
4. Leverage Bootstrap's responsive utilities
5. Use Bootstrap's spacing utilities consistently
6. Avoid loading full Bootstrap JS if not needed

