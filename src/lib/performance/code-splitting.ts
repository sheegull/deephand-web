/**
 * Code Splitting Utilities
 * Phase 4: Performance optimization - Dynamic imports and lazy loading
 */

import { lazy } from 'react';

// Lazy loading for heavy background components
export const DitherBackgroundLazy = lazy(() => 
  import('../components/ui/DitherBackgroundUnified').then(module => ({
    default: module.default
  }))
);

export const MetaBallsLazy = lazy(() =>
  import('../components/ui/MetaBalls').then(module => ({
    default: module.default
  }))
);

// Lazy loading for page sections
export const AboutSectionLazy = lazy(() =>
  import('../components/sections/AboutSection').then(module => ({
    default: module.default
  }))
);

export const PricingSectionLazy = lazy(() =>
  import('../components/sections/PricingSection').then(module => ({
    default: module.default
  }))
);

export const SolutionsSectionLazy = lazy(() =>
  import('../components/sections/SolutionsSection').then(module => ({
    default: module.default
  }))
);

export const ResourcesSectionLazy = lazy(() =>
  import('../components/sections/ResourcesSection').then(module => ({
    default: module.default
  }))
);

// Lazy loading for complex forms
export const RequestDataSectionLazy = lazy(() =>
  import('../components/sections/RequestDataSection').then(module => ({
    default: module.default
  }))
);

// Performance monitoring utilities
export const measureComponentLoad = (componentName: string) => {
  return {
    start: () => {
      if (typeof window !== 'undefined' && window.performance) {
        performance.mark(`${componentName}-start`);
      }
    },
    end: () => {
      if (typeof window !== 'undefined' && window.performance) {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-load`,
          `${componentName}-start`,
          `${componentName}-end`
        );
        
        const measure = performance.getEntriesByName(`${componentName}-load`)[0];
        console.log(`${componentName} load time: ${measure.duration.toFixed(2)}ms`);
      }
    }
  };
};

// Bundle size optimization helpers
export const loadComponentWithFallback = async <T>(
  loader: () => Promise<{ default: T }>,
  fallback: T,
  timeout = 5000
): Promise<T> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Component load timeout')), timeout)
    );
    
    const loadPromise = loader();
    const result = await Promise.race([loadPromise, timeoutPromise]);
    return result.default;
  } catch (error) {
    console.warn('Failed to load component, using fallback:', error);
    return fallback;
  }
};

// Preload critical components
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload on idle
    requestIdleCallback(() => {
      // Preload background components for faster page transitions
      import('../components/ui/DitherBackgroundUnified');
      
      // Preload common page sections
      import('../components/sections/AboutSection');
      import('../components/sections/PricingSection');
    });
  }
};

// Resource hints for performance
export const addResourceHints = () => {
  if (typeof document !== 'undefined') {
    // Preload critical resources
    const preloadLinks = [
      { href: '/fonts/AllianceNo1-Regular.ttf', as: 'font', type: 'font/ttf' },
      { href: '/fonts/AllianceNo1-Light.ttf', as: 'font', type: 'font/ttf' },
      { href: '/logo.png', as: 'image' }
    ];

    preloadLinks.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};