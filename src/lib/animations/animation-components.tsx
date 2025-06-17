// TDD Green Step: Animation components implementation

import React, { type ReactNode } from 'react';
import { motion, AnimatePresence, useAnimation, useInView, type Variants } from 'framer-motion';
import { createMotionConfig, detectReducedMotion } from './motion-config';

export interface TransitionConfig {
  duration?: number;
  ease?: string | number[];
  delay?: number;
  type?: 'spring' | 'tween' | 'keyframes' | 'inertia';
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

interface BaseAnimationProps {
  children: ReactNode;
  className?: string;
  respectReducedMotion?: boolean;
  optimizeForMobile?: boolean;
}

// Page Transition Component
interface PageTransitionProps extends BaseAnimationProps {
  config?: TransitionConfig;
}

export function PageTransition({
  children,
  className,
  config,
  respectReducedMotion = true,
  optimizeForMobile = true,
}: PageTransitionProps) {
  const motionConfig = createMotionConfig();
  const reducedMotion = detectReducedMotion();

  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;
  const isMobile = motionConfig.deviceCapabilities.isMobile;

  const transitionConfig: TransitionConfig = {
    duration: isMobile && optimizeForMobile ? 0.3 : 0.5,
    ease: 'easeInOut',
    ...config,
  };

  const variants: Variants = {
    initial: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldAnimate ? -20 : 0 },
  };

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transitionConfig}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Scroll Reveal Component
interface ScrollRevealProps extends BaseAnimationProps {
  threshold?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.3,
  once = true,
  direction = 'up',
  distance = 30,
  respectReducedMotion = true,
}: ScrollRevealProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const reducedMotion = detectReducedMotion();

  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;

  const getInitialPosition = () => {
    if (!shouldAnimate) return {};

    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const variants: Variants = {
    initial: getInitialPosition(),
    animate: { x: 0, y: 0, opacity: 1 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Micro Interaction Component
interface MicroInteractionProps extends BaseAnimationProps {
  type: 'button' | 'hover' | 'tap';
  scale?: number;
  hoverScale?: number;
  tapScale?: number;
  rotation?: number;
}

export function MicroInteraction({
  children,
  className,
  type,
  scale = 1,
  hoverScale,
  tapScale,
  rotation = 0,
  respectReducedMotion = true,
}: MicroInteractionProps) {
  const reducedMotion = detectReducedMotion();
  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  const getAnimationProps = () => {
    const baseProps = {
      scale,
      rotate: rotation,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    };

    switch (type) {
      case 'button':
        return {
          ...baseProps,
          whileHover: { scale: hoverScale || 1.05 },
          whileTap: { scale: tapScale || 0.95 },
        };
      case 'hover':
        return {
          ...baseProps,
          whileHover: { scale: hoverScale || scale * 1.05 },
        };
      case 'tap':
        return {
          ...baseProps,
          whileTap: { scale: tapScale || scale * 0.95 },
        };
      default:
        return baseProps;
    }
  };

  return (
    <motion.div className={className} {...getAnimationProps()}>
      {children}
    </motion.div>
  );
}

// FadeIn Component
interface FadeInProps extends BaseAnimationProps {
  duration?: number;
  delay?: number;
}

export function FadeIn({
  children,
  className,
  duration = 0.6,
  delay = 0,
  respectReducedMotion = true,
}: FadeInProps) {
  const reducedMotion = detectReducedMotion();
  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;

  const variants: Variants = {
    initial: { opacity: shouldAnimate ? 0 : 1 },
    animate: { opacity: 1 },
  };

  const transition: TransitionConfig = {
    duration: shouldAnimate ? duration : 0,
    delay: shouldAnimate ? delay : 0,
    ease: 'easeOut',
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// SlideUp Component
interface SlideUpProps extends BaseAnimationProps {
  distance?: number;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SlideUp({
  children,
  className,
  distance = 30,
  duration = 0.6,
  delay = 0,
  direction = 'up',
  respectReducedMotion = true,
}: SlideUpProps) {
  const reducedMotion = detectReducedMotion();
  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;

  const getTransform = () => {
    if (!shouldAnimate) return { x: 0, y: 0 };

    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const variants: Variants = {
    initial: { ...getTransform(), opacity: shouldAnimate ? 0 : 1 },
    animate: { x: 0, y: 0, opacity: 1 },
  };

  const transition: TransitionConfig = {
    duration: shouldAnimate ? duration : 0,
    delay: shouldAnimate ? delay : 0,
    ease: 'easeOut',
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// ScaleIn Component
interface ScaleInProps extends BaseAnimationProps {
  initialScale?: number;
  duration?: number;
  delay?: number;
  elastic?: boolean;
}

export function ScaleIn({
  children,
  className,
  initialScale = 0.8,
  duration = 0.6,
  delay = 0,
  elastic = false,
  respectReducedMotion = true,
}: ScaleInProps) {
  const reducedMotion = detectReducedMotion();
  const shouldAnimate = respectReducedMotion ? !reducedMotion : true;

  const variants: Variants = {
    initial: {
      scale: shouldAnimate ? initialScale : 1,
      opacity: shouldAnimate ? 0 : 1,
    },
    animate: { scale: 1, opacity: 1 },
  };

  const transition: TransitionConfig = elastic
    ? {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: shouldAnimate ? delay : 0,
      }
    : {
        duration: shouldAnimate ? duration : 0,
        delay: shouldAnimate ? delay : 0,
        ease: 'easeOut',
      };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
