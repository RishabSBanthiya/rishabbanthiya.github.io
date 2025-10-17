# Performance Optimization Guidelines

## React Performance

### Component Optimization

#### React.memo()
```typescript
// Use React.memo for expensive components that re-render frequently
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Heavy computation or complex rendering
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  return prevProps.data.id === nextProps.data.id;
});
```

#### useMemo()
```typescript
// Cache expensive computations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]); // Only recompute when data changes

// Don't overuse for simple operations
// Bad: const doubled = useMemo(() => value * 2, [value]);
// Good: const doubled = value * 2;
```

#### useCallback()
```typescript
// Memoize callback functions passed to child components
const handleClick = useCallback((id: string) => {
  // Handler logic
  updateItem(id);
}, [updateItem]); // Only recreate when updateItem changes

// Use with React.memo children
<MemoizedChild onClick={handleClick} />
```

### State Management

#### Minimize State Updates
```typescript
// Bad: Multiple state updates
setName(newName);
setAge(newAge);
setEmail(newEmail);

// Good: Single state update
setUser(prev => ({
  ...prev,
  name: newName,
  age: newAge,
  email: newEmail
}));
```

#### Derived State
```typescript
// Bad: Storing derived state
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0); // Redundant!

// Good: Calculate on render (cheap operation)
const [items, setItems] = useState([]);
const itemCount = items.length;
```

#### Lazy State Initialization
```typescript
// Expensive initial state calculation
const [state, setState] = useState(() => {
  const initialState = expensiveComputation();
  return initialState;
});
```

### Code Splitting

#### Route-based Splitting
```typescript
import { lazy, Suspense } from 'react';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
}
```

#### Component-based Splitting
```typescript
// Split large features
const HeavyChart = lazy(() => import('./components/HeavyChart'));

export function Dashboard() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

## Asset Optimization

### Images

#### Lazy Loading
```typescript
// Use native lazy loading
<img 
  src="image.jpg" 
  alt="Description" 
  loading="lazy"
/>

// Or use Intersection Observer for more control
const LazyImage = ({ src, alt }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImageSrc(src);
        observer.disconnect();
      }
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return <img ref={imgRef} src={imageSrc} alt={alt} />;
};
```

#### Optimize Image Formats
- Use WebP for better compression
- Provide fallbacks for older browsers
- Use appropriate image sizes
- Implement responsive images

```typescript
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" />
</picture>
```

### Bundle Size

#### Analyze Bundle
```bash
# Install bundle analyzer
npm install --save-dev vite-plugin-visualizer

# Use in vite.config.ts
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

#### Tree Shaking
```typescript
// Good: Named imports
import { useState, useEffect } from 'react';
import { formatDate } from './utils';

// Bad: Importing everything
import * as React from 'react';
import * as utils from './utils';
```

#### Dynamic Imports
```typescript
// Load libraries only when needed
const loadChart = async () => {
  const ChartLibrary = await import('chart.js');
  return new ChartLibrary.Chart(/* ... */);
};
```

## Network Performance

### API Optimization

#### Request Batching
```typescript
// Batch multiple requests
const fetchData = async (ids: string[]) => {
  const response = await fetch('/api/batch', {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
  return response.json();
};
```

#### Caching
```typescript
// Simple cache implementation
const cache = new Map();

const fetchWithCache = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  
  return data;
};
```

#### Debouncing and Throttling
```typescript
// Debounce search input
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const searchTerm = useDebounce(inputValue, 300);
```

## Rendering Performance

### Virtual Lists
```typescript
// For long lists, use virtualization
// Example with react-window
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }: { items: Item[] }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index].name}
      </div>
    )}
  </FixedSizeList>
);
```

### Avoid Unnecessary Renders

#### Key Props
```typescript
// Use stable keys for lists
// Bad: Using index
{items.map((item, index) => <Item key={index} {...item} />)}

// Good: Using unique ID
{items.map(item => <Item key={item.id} {...item} />)}
```

#### Pure Components
```typescript
// Extend PureComponent for class components
// Or use React.memo for functional components

// Prevent re-renders when props haven't changed
const OptimizedComponent = React.memo(Component);
```

## CSS Performance

### Minimize CSS
```css
/* Use efficient selectors */
.button { /* Good: class selector */ }
div.button { /* Avoid: tag + class */ }
div > div > .button { /* Avoid: deep nesting */ }

/* Avoid expensive properties */
/* Be careful with: box-shadow, filter, transform, opacity */
```

### CSS-in-JS Optimization
```typescript
// Extract static styles
const staticStyles = {
  container: {
    display: 'flex',
    padding: '1rem'
  }
};

// Only compute dynamic styles
const dynamicStyles = {
  color: isActive ? 'blue' : 'gray'
};
```

## Monitoring Performance

### React DevTools Profiler
```typescript
// Wrap components to profile
import { Profiler } from 'react';

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) => {
  console.log({ id, phase, actualDuration });
};

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### Web Vitals
```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Performance Checklist

### Development
- ✅ Use React DevTools Profiler
- ✅ Profile slow renders
- ✅ Identify unnecessary re-renders
- ✅ Check bundle size regularly

### Production
- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ Images optimized
- ✅ Assets compressed
- ✅ Bundle analyzed
- ✅ Tree shaking working
- ✅ Minimal dependencies
- ✅ Efficient state management
- ✅ Proper caching strategy
- ✅ No console.logs
- ✅ Source maps disabled (if not needed)

### Common Anti-patterns
- ❌ Creating components inside render
- ❌ Using index as key for dynamic lists
- ❌ Not memoizing expensive computations
- ❌ Prop drilling multiple levels
- ❌ Large useEffect hooks
- ❌ Unnecessary state updates
- ❌ Not splitting code
- ❌ Loading everything upfront
- ❌ Not lazy loading images
- ❌ Synchronous large operations

