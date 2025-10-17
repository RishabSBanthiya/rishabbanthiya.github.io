# React Best Practices

## Component Structure

- Use functional components exclusively
- Keep components small and focused (under 200 lines)
- One component per file
- Use descriptive, PascalCase names for components
- Export components as named exports

## Hooks Guidelines

### useState
- Initialize state with proper types
- Use functional updates when new state depends on old state
- Group related state into objects when appropriate

### useEffect
- Keep effects focused and minimal
- Always include proper dependencies
- Implement cleanup functions for subscriptions/timers
- Avoid unnecessary effects - prefer derived state

### useCallback and useMemo
- Use for expensive computations
- Use when passing callbacks to optimized child components
- Don't over-optimize - measure first

### Custom Hooks
- Prefix with 'use'
- Encapsulate reusable logic
- Return arrays for ordered values, objects for named values
- Document hook behavior and dependencies

## Props Management

- Use TypeScript interfaces for prop types
- Destructure props in function signature
- Provide default values using destructuring
- Avoid prop drilling - use Context or composition

## Performance

- Use React.memo() for expensive components
- Implement virtualization for long lists
- Lazy load route components
- Code split large features
- Optimize re-renders with proper key props

## Error Handling

- Implement Error Boundaries
- Handle async errors in components
- Provide fallback UI for errors
- Log errors appropriately

## Code Organization

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import type { ComponentProps } from './types';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function Component({ prop1, prop2 }: Props) {
  // 3a. Hooks
  const [state, setState] = useState();
  
  // 3b. Derived state
  const derivedValue = useMemo(() => {}, []);
  
  // 3c. Effects
  useEffect(() => {}, []);
  
  // 3d. Handlers
  const handleClick = useCallback(() => {}, []);
  
  // 3e. Render
  return <div>{/* JSX */}</div>;
}

// 4. Subcomponents (if any)
// 5. Helper functions
// 6. Static content/constants
```

## Common Patterns

### Conditional Rendering
```typescript
// Good: Use short-circuit or ternary
{isLoading && <Spinner />}
{data ? <Content data={data} /> : <Empty />}

// Avoid: Complex logic in JSX
```

### List Rendering
```typescript
// Always use stable keys
{items.map(item => (
  <Item key={item.id} {...item} />
))}
```

### Event Handlers
```typescript
// Good: Named handlers
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // logic
};

// Good: Inline for simple cases
<button onClick={() => setCount(c => c + 1)}>
```

## Anti-Patterns to Avoid

- ❌ Modifying state directly
- ❌ Using index as key for dynamic lists
- ❌ Defining components inside other components
- ❌ Unnecessary useEffect with setState
- ❌ Not cleaning up effects
- ❌ Prop drilling more than 2 levels
- ❌ Large useEffect with multiple concerns
- ❌ Mixing business logic with rendering logic

