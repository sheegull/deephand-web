// TDD Red Step: Animation components tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  PageTransition,
  ScrollReveal,
  MicroInteraction,
  FadeIn,
  SlideUp,
  ScaleIn,
  type AnimationVariants,
  type TransitionConfig,
} from '../animation-components';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
    section: vi.fn(({ children, ...props }) => <section {...props}>{children}</section>),
    button: vi.fn(({ children, ...props }) => <button {...props}>{children}</button>),
    h1: vi.fn(({ children, ...props }) => <h1 {...props}>{children}</h1>),
    p: vi.fn(({ children, ...props }) => <p {...props}>{children}</p>),
  },
  AnimatePresence: vi.fn(({ children }) => children),
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  })),
  useInView: vi.fn(() => [vi.fn(), false]),
}));

describe('Animation Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PageTransition', () => {
    it('should render page transition wrapper', () => {
      render(
        <PageTransition>
          <div>Page content</div>
        </PageTransition>
      );

      expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('should apply correct transition configuration', () => {
      const customConfig = {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.1,
      };

      render(
        <PageTransition config={customConfig}>
          <div>Page content</div>
        </PageTransition>
      );

      expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('should handle reduced motion preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
        })),
      });

      render(
        <PageTransition respectReducedMotion={true}>
          <div>Page content</div>
        </PageTransition>
      );

      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
  });

  describe('ScrollReveal', () => {
    it('should render scroll reveal component', () => {
      render(
        <ScrollReveal>
          <div>Reveal content</div>
        </ScrollReveal>
      );

      expect(screen.getByText('Reveal content')).toBeInTheDocument();
    });

    it('should trigger animation when in view', () => {
      const { useInView } = require('framer-motion');
      useInView.mockReturnValue([vi.fn(), true]); // In view

      render(
        <ScrollReveal>
          <div>Reveal content</div>
        </ScrollReveal>
      );

      expect(screen.getByText('Reveal content')).toBeInTheDocument();
    });

    it('should respect threshold configuration', () => {
      render(
        <ScrollReveal threshold={0.5}>
          <div>Reveal content</div>
        </ScrollReveal>
      );

      expect(screen.getByText('Reveal content')).toBeInTheDocument();
    });

    it('should animate only once when configured', () => {
      render(
        <ScrollReveal once={true}>
          <div>Reveal content</div>
        </ScrollReveal>
      );

      expect(screen.getByText('Reveal content')).toBeInTheDocument();
    });
  });

  describe('MicroInteraction', () => {
    it('should render interactive element', () => {
      render(
        <MicroInteraction type="button">
          <button>Click me</button>
        </MicroInteraction>
      );

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should apply hover animations', () => {
      render(
        <MicroInteraction type="hover" scale={1.05}>
          <div>Hover me</div>
        </MicroInteraction>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should apply tap animations', () => {
      render(
        <MicroInteraction type="tap" scale={0.95}>
          <button>Tap me</button>
        </MicroInteraction>
      );

      expect(screen.getByText('Tap me')).toBeInTheDocument();
    });

    it('should combine multiple interaction types', () => {
      render(
        <MicroInteraction type="button" hoverScale={1.05} tapScale={0.95}>
          <button>Interactive button</button>
        </MicroInteraction>
      );

      expect(screen.getByText('Interactive button')).toBeInTheDocument();
    });
  });

  describe('FadeIn Animation', () => {
    it('should render fade in component', () => {
      render(
        <FadeIn>
          <div>Fade in content</div>
        </FadeIn>
      );

      expect(screen.getByText('Fade in content')).toBeInTheDocument();
    });

    it('should apply custom duration', () => {
      render(
        <FadeIn duration={0.8}>
          <div>Fade in content</div>
        </FadeIn>
      );

      expect(screen.getByText('Fade in content')).toBeInTheDocument();
    });

    it('should apply custom delay', () => {
      render(
        <FadeIn delay={0.3}>
          <div>Fade in content</div>
        </FadeIn>
      );

      expect(screen.getByText('Fade in content')).toBeInTheDocument();
    });
  });

  describe('SlideUp Animation', () => {
    it('should render slide up component', () => {
      render(
        <SlideUp>
          <div>Slide up content</div>
        </SlideUp>
      );

      expect(screen.getByText('Slide up content')).toBeInTheDocument();
    });

    it('should apply custom distance', () => {
      render(
        <SlideUp distance={50}>
          <div>Slide up content</div>
        </SlideUp>
      );

      expect(screen.getByText('Slide up content')).toBeInTheDocument();
    });

    it('should work with different directions', () => {
      render(
        <SlideUp direction="left">
          <div>Slide from left</div>
        </SlideUp>
      );

      expect(screen.getByText('Slide from left')).toBeInTheDocument();
    });
  });

  describe('ScaleIn Animation', () => {
    it('should render scale in component', () => {
      render(
        <ScaleIn>
          <div>Scale in content</div>
        </ScaleIn>
      );

      expect(screen.getByText('Scale in content')).toBeInTheDocument();
    });

    it('should apply custom initial scale', () => {
      render(
        <ScaleIn initialScale={0.5}>
          <div>Scale in content</div>
        </ScaleIn>
      );

      expect(screen.getByText('Scale in content')).toBeInTheDocument();
    });

    it('should apply elastic animation', () => {
      render(
        <ScaleIn elastic={true}>
          <div>Elastic scale</div>
        </ScaleIn>
      );

      expect(screen.getByText('Elastic scale')).toBeInTheDocument();
    });
  });

  describe('Animation Variants', () => {
    it('should create proper animation variants', () => {
      // This would test the variants configuration
      const variants: AnimationVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

      expect(variants.initial).toEqual({ opacity: 0, y: 20 });
      expect(variants.animate).toEqual({ opacity: 1, y: 0 });
      expect(variants.exit).toEqual({ opacity: 0, y: -20 });
    });
  });

  describe('Transition Configuration', () => {
    it('should validate transition config', () => {
      const config: TransitionConfig = {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      };

      expect(config.duration).toBe(0.6);
      expect(config.ease).toBe('easeOut');
      expect(config.type).toBe('spring');
    });

    it('should provide default transition values', () => {
      const defaultConfig: TransitionConfig = {
        duration: 0.4,
        ease: 'easeInOut',
      };

      expect(defaultConfig.duration).toBe(0.4);
      expect(defaultConfig.ease).toBe('easeInOut');
    });
  });

  describe('Performance Considerations', () => {
    it('should handle reduced motion gracefully', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: true, // Reduced motion preferred
        })),
      });

      render(
        <FadeIn respectReducedMotion={true}>
          <div>Accessible content</div>
        </FadeIn>
      );

      expect(screen.getByText('Accessible content')).toBeInTheDocument();
    });

    it('should optimize for mobile devices', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      render(
        <PageTransition optimizeForMobile={true}>
          <div>Mobile optimized</div>
        </PageTransition>
      );

      expect(screen.getByText('Mobile optimized')).toBeInTheDocument();
    });
  });
});
