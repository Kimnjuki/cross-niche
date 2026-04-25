import { cva, type VariantProps } from "class-variance-authority";

export const tagVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-120ms ease-out",
  {
    variants: {
      variant: {
        "category-tech": "bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,229,255,0.2)]",
        "category-security": "bg-[rgba(168,85,247,0.1)] text-[var(--accent-violet)] border border-[rgba(168,85,247,0.2)]",
        "category-gaming": "bg-[rgba(245,158,11,0.1)] text-[var(--accent-amber)] border border-[rgba(245,158,11,0.2)]",
        "topic": "bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--accent-cyan-glow)]",
        "breaking": "bg-[var(--accent-red)] text-[#fff] border-none animate-[breaking-pulse_1200ms_infinite]",
        "live": "bg-[rgba(239,68,68,0.15)] text-[var(--accent-red)] border border-[rgba(239,68,68,0.3)] animate-[breaking-pulse_1200ms_infinite]"
      },
    },
    defaultVariants: {
      variant: "topic",
    },
  },
);

export type TagVariants = VariantProps<typeof tagVariants>;
