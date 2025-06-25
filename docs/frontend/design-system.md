# UI/UX Design System

## Overview
This document outlines the design system used across the Marriott Hotels platform. It provides guidelines for consistent visual design, component usage, and user experience patterns.

## Design Principles

### Core Values
1. Elegance & Luxury
2. Clarity & Simplicity
3. Accessibility & Inclusivity
4. Consistency & Reliability
5. Responsiveness & Performance

## Color System

### Primary Colors
```css
:root {
  --marriott-navy: #002D72;
  --marriott-gold: #BA8B00;
  --marriott-red: #B60041;
  --marriott-gray: #333333;
  --marriott-white: #FFFFFF;
}
```

### Secondary Colors
```css
:root {
  --secondary-blue: #004990;
  --secondary-gold: #D4AF37;
  --secondary-red: #D4002A;
  --secondary-gray: #666666;
}
```

### Semantic Colors
```css
:root {
  --success: #28A745;
  --warning: #FFC107;
  --error: #DC3545;
  --info: #17A2B8;
}
```

## Typography

### Font Families
```css
:root {
  --primary-font: 'Marriott Sans', sans-serif;
  --secondary-font: 'Marriott Serif', serif;
  --monospace-font: 'Courier New', monospace;
}
```

### Font Sizes
```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
}
```

## Spacing System

### Base Units
```css
:root {
  --spacing-unit: 0.25rem;
  --spacing-xs: calc(var(--spacing-unit) * 1);
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 6);
  --spacing-xl: calc(var(--spacing-unit) * 8);
}
```

## Component Library

### Button System
```typescript
// components/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'text';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled,
  loading,
  children,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### Input System
```typescript
// components/Input/Input.tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="input-wrapper">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

## Layout System

### Grid System
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-md);
}

.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-12 { grid-column: span 12; }
```

### Container System
```css
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: var(--spacing-md);
  padding-left: var(--spacing-md);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}
```

## Animation System

### Transitions
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--transition-normal),
              transform var(--transition-normal);
}
```

### Loading States
```typescript
// components/Spinner/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
}) => {
  return (
    <svg
      className={`spinner spinner-${size}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
    >
      <circle
        className="spinner-circle"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
      />
    </svg>
  );
};
```

## Icons and Images

### Icon System
```typescript
// components/Icon/Icon.tsx
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
}) => {
  return (
    <span
      className={`icon icon-${name} icon-${size}`}
      style={{ color }}
    />
  );
};
```

### Image Handling
```typescript
// components/Image/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className="optimized-image"
    />
  );
};
```

## Form System

### Form Components
```typescript
// components/Form/Form.tsx
interface FormProps {
  onSubmit: (data: any) => void;
  validation?: Record<string, any>;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  validation,
  children,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="form"
    >
      {children}
    </form>
  );
};
```

## Responsive Design

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Media Queries
```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == "sm" {
    @media (min-width: 640px) { @content; }
  }
  @if $breakpoint == "md" {
    @media (min-width: 768px) { @content; }
  }
  @if $breakpoint == "lg" {
    @media (min-width: 1024px) { @content; }
  }
  @if $breakpoint == "xl" {
    @media (min-width: 1280px) { @content; }
  }
}
```

## Accessibility

### ARIA Attributes
```typescript
// components/Accordion/Accordion.tsx
interface AccordionProps {
  title: string;
  expanded: boolean;
  onChange: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  expanded,
  onChange,
  children,
}) => {
  return (
    <div
      role="region"
      aria-expanded={expanded}
    >
      <button
        onClick={onChange}
        aria-controls="content"
        aria-expanded={expanded}
      >
        {title}
      </button>
      <div id="content">
        {children}
      </div>
    </div>
  );
};
```

## Theme System

### Theme Configuration
```typescript
// theme/theme.ts
export const theme = {
  light: {
    background: 'var(--marriott-white)',
    text: 'var(--marriott-gray)',
    primary: 'var(--marriott-navy)',
    secondary: 'var(--marriott-gold)',
  },
  dark: {
    background: 'var(--marriott-gray)',
    text: 'var(--marriott-white)',
    primary: 'var(--marriott-gold)',
    secondary: 'var(--marriott-navy)',
  },
};
```

## Documentation

### 1. Usage Guidelines
- Component usage
- Theme customization
- Accessibility requirements
- Responsive design

### 2. Maintenance Guide
- Theme updates
- Component updates
- Design system versioning
- Breaking changes

## Future Improvements

### 1. Technical Roadmap
- Component library expansion
- Theme customization
- Animation system
- Accessibility improvements

### 2. Research Areas
- Design patterns
- Performance optimization
- Accessibility standards
- Mobile-first approach 