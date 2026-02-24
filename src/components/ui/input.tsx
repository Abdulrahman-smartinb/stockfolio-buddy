import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-sm border border-input",
          "bg-background px-4  text-base ",
          "file:text-sm file:font-medium",
          "placeholder:text-jadwa-muted focus-visible:outline-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50md:text-sm",
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
