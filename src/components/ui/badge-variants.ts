import { cva, type VariantProps } from "class-variance-authority";

export const tagVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-120ms ease-out",
  {
    variants: {
      variant: {
        "category-tech": "...",
        "category-security": "...",
        "category-gaming": "...",
        "topic": "...",
        "breaking": "...",
        "live": "...",
        /* Standard shadcn variants used across the codebase */
        "default": "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-default)]",
        "outline": "bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]",
        "destructive": "bg-[var(--accent-red)] text-[#fff] hover:bg-[#DC2626]",
        "secondary": "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]",
        "link": "text-[var(--text-secondary)] underline-offset-4 hover:underline"
      },
    },
    defaultVariants: {
      variant: "topic",
    },
  },
);

export type TagVariants = VariantProps<typeof tagVariants>;
