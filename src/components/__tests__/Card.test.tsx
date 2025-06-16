/**
 * Card Component Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../ui/card';

describe('Card Component', () => {
  it('renders card with default styles', () => {
    render(<Card data-testid="card">Card Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-xl', 'border', 'border-gray-200', 'bg-white');
  });

  it('applies custom className alongside default classes', () => {
    render(<Card className="custom-card" data-testid="card">Card Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveClass('rounded-xl'); // Still has default class
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Card with Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads additional props to div element', () => {
    render(<Card data-testid="card" role="region">Card with Props</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'region');
  });

  it('handles hover effects with transition classes', () => {
    render(<Card data-testid="card">Hoverable Card</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('transition-all', 'duration-300', 'hover:shadow-md');
  });
});

describe('CardHeader Component', () => {
  it('renders with correct header styles', () => {
    render(<CardHeader data-testid="header">Header Content</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'pb-4');
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-header', 'flex');
  });
});

describe('CardContent Component', () => {
  it('renders with correct content styles', () => {
    render(<CardContent data-testid="content">Content Text</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('pt-0');
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-content', 'pt-0');
  });
});

describe('CardFooter Component', () => {
  it('renders with correct footer styles', () => {
    render(<CardFooter data-testid="footer">Footer Content</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('flex', 'items-center', 'pt-4');
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('custom-footer', 'flex');
  });
});

describe('CardTitle Component', () => {
  it('renders with correct title styles', () => {
    render(<CardTitle data-testid="title">Card Title</CardTitle>);
    const title = screen.getByTestId('title');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'leading-none', 'tracking-tight', 'text-gray-900');
  });
});

describe('CardDescription Component', () => {
  it('renders with correct description styles', () => {
    render(<CardDescription data-testid="description">Card Description</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toHaveClass('text-sm', 'text-gray-600', 'leading-relaxed');
  });
});

describe('Card Composition', () => {
  it('renders complete card with all components', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Test content paragraph</p>
        </CardContent>
        <CardFooter>
          <button>Test Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId('complete-card')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test content paragraph')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
  });
});