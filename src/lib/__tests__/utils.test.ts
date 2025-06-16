/**
 * Utility Functions Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles undefined and null values', () => {
    const result = cn('class1', undefined, 'class2', null, 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles empty string values', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional classes with boolean logic', () => {
    const isActive = true;
    const isDisabled = false;
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    );
    
    expect(result).toBe('base-class active-class');
  });

  it('handles array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('combines all provided classes', () => {
    // The cn function combines all classes without merging conflicts
    const result = cn('p-4', 'p-6');
    expect(result).toBe('p-4 p-6');
  });

  it('handles responsive classes correctly', () => {
    const result = cn('text-sm', 'md:text-lg', 'lg:text-xl');
    expect(result).toBe('text-sm md:text-lg lg:text-xl');
  });

  it('handles hover and state variants', () => {
    const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700');
    expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700');
  });

  it('handles duplicate classes', () => {
    const result = cn('text-center', 'font-bold', 'text-center');
    expect(result).toBe('text-center font-bold text-center');
  });

  it('handles complex conditional logic', () => {
    const variant = 'primary';
    const size = 'lg';
    const disabled = false;
    
    const result = cn(
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'btn-secondary',
      size === 'sm' && 'btn-sm',
      size === 'lg' && 'btn-lg',
      disabled && 'btn-disabled'
    );
    
    expect(result).toBe('btn btn-primary btn-lg');
  });

  it('handles object-style conditional classes', () => {
    const conditions = {
      'active-class': true,
      'inactive-class': false,
      'special-class': true
    };
    
    const result = cn(
      'base-class',
      conditions['active-class'] && 'active-class',
      conditions['inactive-class'] && 'inactive-class',
      conditions['special-class'] && 'special-class'
    );
    
    expect(result).toBe('base-class active-class special-class');
  });

  it('returns empty string when no valid classes provided', () => {
    const result = cn('', null, undefined, false);
    expect(result).toBe('');
  });

  it('handles single class name', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('handles whitespace in class names', () => {
    const result = cn(' class1 ', '  class2  ', 'class3');
    expect(result).toBe(' class1    class2   class3');
  });
});