/**
 * UI Components Barrel Export
 * Centralized exports for all UI components
 * Created during Phase 2 refactoring for better import management
 */

// Core UI Components
export { Button } from './button';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
export { Input } from './input';
export { Textarea } from './textarea';
export { Label } from './label';
export { Checkbox } from './checkbox';

// Specialized UI Components
export { LanguageToggle } from './language-toggle';

// Animation and Motion Components
export {
  MotionDiv,
  useInView,
  useScroll,
  useTransform,
  optimizedTransition,
  optimizedHoverAnimation,
  optimizedTapAnimation,
} from './motion-optimized';

// Background Components
export { default as DitherBackgroundUnified } from './DitherBackgroundUnified';
export { default as MetaBalls } from './MetaBalls';

// Background Component Variants (Legacy support)
export { 
  DitherBackgroundMinimal,
  DitherBackgroundStandard,
  DitherBackgroundEnhanced 
} from './DitherBackgroundUnified';