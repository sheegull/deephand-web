import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          {
            'max-w-3xl': size === 'sm',
            'max-w-4xl': size === 'md',
            'max-w-6xl': size === 'lg',
            'max-w-7xl': size === 'xl',
            'max-w-none': size === 'full',
          },
          padding && 'px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export { Container };