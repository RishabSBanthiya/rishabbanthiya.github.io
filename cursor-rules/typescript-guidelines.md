# TypeScript Guidelines

## General Principles

- Enable strict mode in tsconfig.json
- Avoid `any` - use `unknown` if type is truly unknown
- Use type inference where possible
- Be explicit with function return types
- Use const assertions for literal types

## Type Definitions

### Interfaces vs Types

```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use types for unions, intersections, primitives
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;
```

### Naming Conventions

- PascalCase for types and interfaces
- Avoid prefixing with 'I' or 'T'
- Use descriptive names

```typescript
// Good
interface UserProfile {
  // ...
}

// Avoid
interface IUserProfile {
  // ...
}
```

## React + TypeScript

### Component Props

```typescript
// Use interface for component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  // ...
}
```

### Event Handlers

```typescript
// Type event handlers properly
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

### Hooks Typing

```typescript
// useState with explicit type
const [user, setUser] = useState<User | null>(null);

// useRef for DOM elements
const inputRef = useRef<HTMLInputElement>(null);

// useContext with type
const theme = useContext<ThemeContextType>(ThemeContext);
```

## Advanced Patterns

### Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <>{items.map(renderItem)}</>;
}
```

### Utility Types

```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>;

// Record - create object type with keys and value type
type UserRoles = Record<string, Role>;

// ReturnType - get return type of function
type Response = ReturnType<typeof fetchData>;
```

### Type Guards

```typescript
// User-defined type guard
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.name); // TypeScript knows this is User
}
```

### Discriminated Unions

```typescript
interface SuccessState {
  status: 'success';
  data: string;
}

interface ErrorState {
  status: 'error';
  error: Error;
}

interface LoadingState {
  status: 'loading';
}

type State = SuccessState | ErrorState | LoadingState;

function handleState(state: State) {
  switch (state.status) {
    case 'success':
      return state.data; // TypeScript knows state has data
    case 'error':
      return state.error.message; // TypeScript knows state has error
    case 'loading':
      return 'Loading...';
  }
}
```

## Best Practices

### Avoid Type Assertions

```typescript
// Bad
const value = data as string;

// Good - use type guard
if (typeof data === 'string') {
  const value = data;
}
```

### Use Const Assertions

```typescript
// Creates readonly literal types
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;

// config.apiUrl is type "https://api.example.com", not string
// config is readonly
```

### Enum Alternatives

```typescript
// Instead of enum, use const object with as const
const Status = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

type StatusType = typeof Status[keyof typeof Status];
```

### Function Overloads

```typescript
// When function behavior varies by parameter type
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value * 2;
}
```

## Common Pitfalls to Avoid

- ❌ Using `any` instead of proper types
- ❌ Not enabling strict mode
- ❌ Type assertions without validation
- ❌ Ignoring TypeScript errors with `@ts-ignore`
- ❌ Over-complex type definitions
- ❌ Not typing function parameters
- ❌ Using `{}` or `Object` as types
- ❌ Not using utility types when appropriate

