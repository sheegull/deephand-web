import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#234ad9] focus-visible:ring-2 focus-visible:ring-[#234ad9]/20 disabled:cursor-not-allowed disabled:opacity-50 font-alliance font-light",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };