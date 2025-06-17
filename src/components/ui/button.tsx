import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234ad9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[#234ad9] text-white shadow-md hover:bg-[#1e3eb8] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:bg-[#183099]',
        secondary:
          'border-2 border-gray-300 bg-transparent text-gray-900 hover:border-[#234ad9] hover:text-[#234ad9]',
        outline:
          'border border-[#234ad9] text-[#234ad9] bg-transparent hover:bg-[#234ad9] hover:text-white',
        ghost: 'text-gray-900 hover:bg-gray-100',
        link: 'text-[#234ad9] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-12 px-6 py-3',
        lg: 'h-14 px-8 py-4 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };