import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#234ad9] focus-visible:ring-2 focus-visible:ring-[#234ad9]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-alliance font-light",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };