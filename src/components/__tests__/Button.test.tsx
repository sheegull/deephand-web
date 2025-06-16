/**
 * Button Component Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button Component', () => {
  it('renders button with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('applies primary variant class by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r', 'from-primary', 'to-primary-dark');
  });

  it('applies secondary variant class when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'border-gray-300');
  });

  it('applies outline variant class when specified', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-primary');
  });

  it('applies ghost variant class when specified', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-gray-100');
  });

  it('applies link variant class when specified', () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('underline-offset-4');
  });

  it('applies size small when specified', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-3');
  });

  it('applies size large when specified', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-14', 'px-8');
  });

  it('applies icon size when specified', () => {
    render(<Button size="icon">Icon</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('applies custom className alongside variant classes', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-gradient-to-r'); // Still has variant class
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('spreads additional props to button element', () => {
    render(<Button data-testid="test-button" aria-label="Test">Props Button</Button>);
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('works as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link as Button</a>
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-gradient-to-r'); // Button styles applied to link
  });
});