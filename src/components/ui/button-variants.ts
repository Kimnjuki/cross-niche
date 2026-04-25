import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center gap-2 font-[var(--font-label)] font-bold uppercase tracking-[0.06em] transition-all duration-[180ms] ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent-cyan)] text-[var(--bg-base)] shadow-[var(--shadow-button-primary)] hover:bg-[#19EEFF] hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(0,229,255,0.4)] active:translate-y-0 active:scale-[0.98] rounded-[var(--radius-sm)]",
        secondary: "bg-transparent border border-[var(--border-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-glow)] hover:border-[var(--accent-cyan)] rounded-[var(--radius-sm)]",
        ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)] rounded-[var(--radius-sm)]",
        danger: "bg-[var(--accent-red)] text-[#fff] hover:bg-[#DC2626] rounded-[var(--radius-sm)]"
      },
      size: {
        xs: "h-7 px-3 text-xs",
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
