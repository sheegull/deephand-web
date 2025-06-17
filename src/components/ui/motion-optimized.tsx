/**
 * Motion Optimized Components
 * 
 * TDD Approach:
 * - framer-motionの条件付き読み込み
 * - 低性能デバイスでは通常のdiv要素を使用
 * - prefers-reduced-motion対応
 * - パフォーマンス最適化されたアニメーション設定
 */

import React, { forwardRef } from 'react';
import { motion, useInView as useInViewFramer, useScroll as useScrollFramer, useTransform as useTransformFramer } from 'framer-motion';

// Performance detection utility
const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';
  
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  let score = 0;
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;
  
  if (memory) {
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;
  } else {
    score += 2;
  }
  
  if (isMobile) score -= 2;
  
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
};

// Check if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized animation configurations
export const optimizedTransition = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut'
};

export const optimizedHoverAnimation = {
  scale: 1.05,
  transition: optimizedTransition
};

export const optimizedTapAnimation = {
  scale: 0.95,
  transition: { ...optimizedTransition, duration: 0.1 }
};

// Performance-aware motion component (React 19 Compatible)
interface MotionDivProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  // Motion related props
  initial?: any;
  animate?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
}

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, initial, animate, whileHover, whileTap, transition, ...props }, ref) => {
    const performanceLevel = getPerformanceLevel();
    const reducedMotion = prefersReducedMotion();
    
    // Use regular div for low performance devices or reduced motion preference
    if (performanceLevel === 'low' || reducedMotion) {
      return (
        <div ref={ref} {...props}>
          {children}
        </div>
      );
    }
    
    // Use framer-motion for medium and high performance devices
    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        whileHover={whileHover}
        whileTap={whileTap}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionDiv.displayName = 'MotionDiv';

// Performance-aware useInView hook
export const useInView = (
  ref: React.RefObject<Element>,
  options?: {
    once?: boolean;
    margin?: string;
    amount?: number | 'some' | 'all';
  }
) => {
  const performanceLevel = getPerformanceLevel();
  const reducedMotion = prefersReducedMotion();
  
  // For low performance devices, always return true to avoid animation delays
  if (performanceLevel === 'low' || reducedMotion) {
    return true;
  }
  
  // Use framer-motion's useInView for better performance devices
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useInViewFramer(ref, options);
};

// Performance-aware useScroll hook
export const useScroll = () => {
  const performanceLevel = getPerformanceLevel();
  const reducedMotion = prefersReducedMotion();
  
  // For low performance devices, return static values
  if (performanceLevel === 'low' || reducedMotion) {
    return {
      scrollY: { get: () => 0 },
      scrollYProgress: { get: () => 0 }
    };
  }
  
  // Use framer-motion's useScroll for better performance devices
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useScrollFramer();
};

// Performance-aware useTransform hook
export const useTransform = (
  value: any,
  inputRange: number[],
  outputRange: string[] | number[]
) => {
  const performanceLevel = getPerformanceLevel();
  const reducedMotion = prefersReducedMotion();
  
  // For low performance devices, return the first output value
  if (performanceLevel === 'low' || reducedMotion) {
    return { get: () => outputRange[0] };
  }
  
  // Use framer-motion's useTransform for better performance devices
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTransformFramer(value, inputRange, outputRange);
};

export default MotionDiv;