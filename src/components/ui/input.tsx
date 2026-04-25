import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-sm)] px-4 py-3 text-[var(--text-primary)] text-sm placeholder-[var(--text-tertiary)] transition-all duration-[180ms] outline-none",
          "focus:border-[var(--accent-cyan)] focus:shadow-[0_0_0_3px_var(--accent-cyan-glow)]",
          "aria-invalid:border-[var(--accent-red)] aria-invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };