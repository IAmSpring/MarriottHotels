# Frontend Performance Optimization

This document outlines the performance optimization strategies and best practices implemented in the Marriott Hotels frontend application.

## Table of Contents

- [Performance Overview](#performance-overview)
- [Core Web Vitals](#core-web-vitals)
- [Optimization Strategies](#optimization-strategies)
- [Code Splitting](#code-splitting)
- [Image Optimization](#image-optimization)
- [Caching Strategies](#caching-strategies)
- [Bundle Optimization](#bundle-optimization)
- [Monitoring and Metrics](#monitoring-and-metrics)

## Performance Overview

The frontend application is built with performance as a core priority, implementing modern optimization techniques to ensure fast loading times and smooth user interactions.

### Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

### Performance Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN Layer     │    │   Edge Caching  │    │   Browser Cache │
│   (Static Assets)│   │   (API Responses)│   │   (Local Storage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Splitting│    │   Lazy Loading  │    │   Prefetching   │
│   (Route-based) │    │   (Components)  │    │   (Critical)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Image Opt.    │    │   Bundle Opt.   │    │   State Mgmt    │
│   (WebP, Lazy)  │    │   (Tree Shaking)│    │   (Optimized)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Web Vitals

### 1. Largest Contentful Paint (LCP)

LCP measures the time from when the page starts loading until the largest content element is rendered.

#### Optimization Strategies:

1. **Critical Resource Optimization**
   ```typescript
   // Optimize critical CSS loading
   const criticalCSS = `
     .hero-section { /* Critical styles */ }
     .navigation { /* Critical styles */ }
   `;
   
   // Inline critical CSS
   <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
   ```

2. **Image Optimization**
   ```typescript
   // Optimized image component
   const OptimizedImage = ({ src, alt, priority = false }) => (
     <Image
       src={src}
       alt={alt}
       priority={priority}
       placeholder="blur"
       blurDataURL="data:image/jpeg;base64,..."
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     />
   );
   ```

3. **Server Response Optimization**
   ```typescript
   // Optimize API responses
   const optimizedHotelData = {
     id: hotel.id,
     name: hotel.name,
     image: hotel.image,
     // Only include essential data for initial render
   };
   ```

### 2. First Input Delay (FID)

FID measures the time from when a user first interacts with the page until the browser responds.

#### Optimization Strategies:

1. **JavaScript Optimization**
   ```typescript
   // Debounce user interactions
   const debouncedSearch = useMemo(
     () => debounce((query) => performSearch(query), 300),
     []
   );
   ```

2. **Event Handler Optimization**
   ```typescript
   // Optimize event handlers
   const handleClick = useCallback((event) => {
     event.preventDefault();
     // Minimal processing in event handler
     queueMicrotask(() => {
       // Defer heavy processing
       processClick(event);
     });
   }, []);
   ```

3. **Third-party Script Management**
   ```typescript
   // Load third-party scripts asynchronously
   useEffect(() => {
     const script = document.createElement('script');
     script.src = 'https://analytics.example.com/script.js';
     script.async = true;
     document.head.appendChild(script);
   }, []);
   ```

### 3. Cumulative Layout Shift (CLS)

CLS measures the stability of the page layout during loading.

#### Optimization Strategies:

1. **Reserve Space for Dynamic Content**
   ```css
   /* Reserve space for images */
   .hotel-card {
     aspect-ratio: 16/9;
     background: #f0f0f0;
   }
   
   .hotel-card img {
     width: 100%;
     height: 100%;
     object-fit: cover;
   }
   ```

2. **Font Loading Optimization**
   ```typescript
   // Preload critical fonts
   <link
     rel="preload"
     href="/fonts/inter-var.woff2"
     as="font"
     type="font/woff2"
     crossOrigin="anonymous"
   />
   ```

3. **Ad and Dynamic Content Management**
   ```typescript
   // Reserve space for dynamic content
   const AdContainer = ({ height = 250 }) => (
     <div style={{ height: `${height}px`, minHeight: `${height}px` }}>
       {/* Ad content */}
     </div>
   );
   ```

## Optimization Strategies

### 1. Code Splitting

Implement route-based and component-based code splitting to reduce initial bundle size.

#### Route-based Splitting:
```typescript
// Lazy load routes
const HotelsPage = lazy(() => import('./pages/HotelsPage'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Route configuration
const routes = [
  {
    path: '/hotels',
    component: HotelsPage,
    preload: () => import('./pages/HotelsPage')
  }
];
```

#### Component-based Splitting:
```typescript
// Lazy load heavy components
const AIChatBot = lazy(() => import('./components/AIChatBot'));
const HotelMap = lazy(() => import('./components/HotelMap'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// Conditional loading
const ConditionalComponent = ({ show }) => {
  if (!show) return null;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AIChatBot />
    </Suspense>
  );
};
```

### 2. Bundle Optimization

Optimize JavaScript bundles for faster loading and execution.

#### Tree Shaking:
```typescript
// Use ES modules for better tree shaking
import { useState, useEffect } from 'react';
import { debounce } from 'lodash-es';

// Avoid importing entire libraries
// Bad: import _ from 'lodash';
// Good: import { debounce } from 'lodash-es';
```

#### Bundle Analysis:
```json
// package.json scripts
{
  "scripts": {
    "analyze": "npm run build && npx @next/bundle-analyzer",
    "build:analyze": "ANALYZE=true npm run build"
  }
}
```

### 3. Memory Management

Implement efficient memory management to prevent memory leaks.

#### Component Cleanup:
```typescript
// Clean up resources in useEffect
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });
  
  return () => controller.abort();
}, []);
```

#### Event Listener Management:
```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## Image Optimization

### 1. Next.js Image Component

Use Next.js Image component for automatic optimization.

```typescript
import Image from 'next/image';

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <Image
      src={hotel.image}
      alt={hotel.name}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={hotel.featured}
    />
  </div>
);
```

### 2. Responsive Images

Implement responsive images for different screen sizes.

```typescript
// Responsive image configuration
const imageConfig = {
  mobile: {
    width: 400,
    height: 300,
    quality: 75
  },
  tablet: {
    width: 600,
    height: 450,
    quality: 80
  },
  desktop: {
    width: 800,
    height: 600,
    quality: 85
  }
};
```

### 3. Lazy Loading

Implement lazy loading for images below the fold.

```typescript
// Lazy load images
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`image-container ${className}`}>
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'loaded' : 'loading'}
      />
    </div>
  );
};
```

## Caching Strategies

### 1. Browser Caching

Implement effective browser caching strategies.

```typescript
// Cache configuration
const cacheConfig = {
  static: {
    maxAge: 31536000, // 1 year
    immutable: true
  },
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60
  },
  images: {
    maxAge: 86400, // 1 day
    staleWhileRevalidate: 3600
  }
};
```

### 2. Service Worker Caching

Implement service worker for offline functionality and caching.

```typescript
// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
```

### 3. API Response Caching

Cache API responses to reduce server load and improve performance.

```typescript
// API response caching
const cache = new Map();

const cachedFetch = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
      return cached.data;
    }
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```

## Monitoring and Metrics

### 1. Performance Monitoring

Implement comprehensive performance monitoring.

```typescript
// Performance monitoring
const performanceMonitor = {
  measureLCP: () => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  },
  
  measureFID: () => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
  },
  
  measureCLS: () => {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};
```

### 2. Real User Monitoring (RUM)

Collect real user performance data.

```typescript
// RUM data collection
const collectRUMData = () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  const rumData = {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
  };
  
  // Send to analytics
  sendToAnalytics('performance', rumData);
};
```

### 3. Error Monitoring

Monitor and track performance errors.

```typescript
// Error monitoring
window.addEventListener('error', (event) => {
  const errorData = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  };
  
  sendToAnalytics('error', errorData);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorData = {
    message: event.reason,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  };
  
  sendToAnalytics('unhandled-rejection', errorData);
});
```

## Performance Best Practices

### 1. Critical Rendering Path

Optimize the critical rendering path for faster initial load.

```typescript
// Critical CSS inlining
const criticalCSS = `
  .hero-section { /* Critical styles */ }
  .navigation { /* Critical styles */ }
  .hotel-card { /* Critical styles */ }
`;

// Inline critical CSS
<Head>
  <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
</Head>
```

### 2. Resource Hints

Use resource hints to optimize loading.

```typescript
// Preload critical resources
<Head>
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  <link rel="preload" href="/api/hotels" as="fetch" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="//api.example.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
</Head>
```

### 3. Progressive Enhancement

Implement progressive enhancement for better user experience.

```typescript
// Progressive enhancement
const ProgressiveComponent = () => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  
  useEffect(() => {
    // Check if enhanced features are supported
    if ('serviceWorker' in navigator && 'caches' in window) {
      setIsEnhanced(true);
    }
  }, []);
  
  return (
    <div>
      {/* Basic functionality always works */}
      <BasicComponent />
      
      {/* Enhanced functionality */}
      {isEnhanced && <EnhancedComponent />}
    </div>
  );
};
```

## Performance Testing

### 1. Lighthouse Testing

Regular Lighthouse testing to monitor performance.

```json
// package.json scripts
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html",
    "lighthouse:ci": "lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json"
  }
}
```

### 2. Bundle Analysis

Regular bundle analysis to identify optimization opportunities.

```bash
# Analyze bundle size
npm run build:analyze

# Check bundle size
npm run build && npx @next/bundle-analyzer
```

### 3. Performance Budgets

Set and monitor performance budgets.

```json
// .lighthouserc
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["warn", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["warn", {"maxNumericValue": 0.1}],
        "first-input-delay": ["warn", {"maxNumericValue": 100}]
      }
    }
  }
}
``` 