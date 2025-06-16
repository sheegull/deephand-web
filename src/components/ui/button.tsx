import * as React from "react";

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses = {
      default: "bg-[#234ad9] text-white hover:bg-[#1e3eb8] active:bg-[#183099]",
      outline: "border-2 border-white bg-transparent hover:bg-white/20 text-white",
      secondary: "bg-white text-[#1e1e1e] border-2 border-white hover:bg-[#1e1e1e] hover:text-white active:bg-[#1e1e1e] active:text-white"
    };
    
    const sizeClasses = {
      default: "h-12 px-6 text-base",
      sm: "h-9 px-4 text-sm",
      lg: "h-[52px] px-8 text-base"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "font-alliance",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };