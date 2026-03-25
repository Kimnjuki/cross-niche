import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  className?: string;
  children: React.ReactNode;
  technical?: boolean;
  onClick?: () => void;
}

export function ContentCard({ className, children, technical = false, onClick }: ContentCardProps) {
  return (
    <motion.article
      whileHover={{ rotateZ: 0.5, y: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.8 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#0F0F12] transition-colors duration-300",
        className
      )}
    >
      {technical && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.article>
  );
}

