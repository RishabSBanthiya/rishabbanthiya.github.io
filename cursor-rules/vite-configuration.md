# Vite Configuration Guidelines

## Development Server

### Fast Refresh
- Leverage Vite's instant Hot Module Replacement (HMR)
- Preserve component state during hot updates
- Use React Fast Refresh for optimal DX

### Environment Variables

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

```typescript
// Usage in code
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Optimization

### Code Splitting

```typescript
// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const Terminal = lazy(() => import('./components/Terminal'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <Hero />
</Suspense>
```

### Asset Handling

```typescript
// Import assets
import logo from './assets/logo.png';
import styles from './styles/app.module.css';

// Use in JSX
<img src={logo} alt="Logo" />
```

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Generate sourcemaps for production debugging (optional)
    sourcemap: false,
    
    // Minification
    minify: 'esbuild', // or 'terser' for better minification
    
    // Output directory
    outDir: 'dist',
    
    // Asset directory
    assetsDir: 'assets',
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'bootstrap': ['bootstrap']
        }
      }
    }
  }
});
```

## Performance Optimizations

### Tree Shaking
- Import only what you need
- Use named imports from libraries
- Avoid importing entire libraries

```typescript
// Good
import { useState, useEffect } from 'react';

// Avoid (if you only need specific functions)
import * as React from 'react';
```

### Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        }
      }
    }
  }
});
```

## Plugin Configuration

### React Plugin

```typescript
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      
      // Babel options (if needed)
      babel: {
        plugins: []
      }
    })
  ]
});
```

## Path Aliases

```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
});

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@styles/*": ["./src/styles/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}

// Usage
import Hero from '@components/Hero';
import '@styles/App.css';
```

## Development Server Options

```typescript
export default defineConfig({
  server: {
    port: 3000,
    open: true, // Auto-open browser
    cors: true,
    
    // Proxy API requests
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## Preview Server

```typescript
export default defineConfig({
  preview: {
    port: 4173,
    open: true
  }
});
```

## CSS Configuration

```typescript
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});
```

## Best Practices

1. **Keep config minimal**: Only add what you need
2. **Use environment variables**: For different environments
3. **Optimize chunks**: Split vendor code appropriately
4. **Enable CSS code splitting**: For better loading performance
5. **Use build analysis**: Check bundle size regularly
6. **Leverage caching**: Configure proper cache headers
7. **Optimize images**: Use appropriate formats and sizes

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## Debugging

### Source Maps
```typescript
export default defineConfig({
  build: {
    sourcemap: true // Enable for debugging
  }
});
```

### Console output
- Check terminal for HMR updates
- Watch for build warnings
- Monitor chunk sizes

## Performance Checklist

- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ Asset optimization configured
- ✅ Environment variables properly set
- ✅ Build size optimized
- ✅ Tree shaking working correctly
- ✅ CSS properly split
- ✅ Images optimized
- ✅ Vendor chunks separated
- ✅ No unnecessary dependencies in bundle

