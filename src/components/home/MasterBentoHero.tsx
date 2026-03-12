/**
 * Grid Nexus 2026 – MasterBentoHero
 * 5-cell dynamic grid: main (video overlay), Security (LIVE), Gaming, two bottom cells.
 * Hover-lift animations via Framer Motion.
 */

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { Clock, User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import { authorSlug } from '@/lib/utils';
import type { Article } from '@/types';

const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.02 },
};

const cellTransition = { type: 'spring', stiffness: 300, damping: 24 };

interface BentoCell {
  article: Article;
  label: string;
  badgeClass: string;
}

interface MasterBentoHeroProps {
  /** Main story (cell 1: col-span-8 row-span-2, video/image overlay) */
  mainStory: Article;
  /** Security cell (cell 2: LIVE badge) */
  securityCell?: BentoCell;
  /** Gaming cell (cell 3) */
  gamingCell?: BentoCell;
  /** Bottom left cell (cell 4) */
  bottomLeft?: BentoCell;
  /** Bottom right cell (cell 5) */
  bottomRight?: BentoCell;
  /** Optional video URL for main cell background (falls back to image) */
  videoUrl?: string | null;
}

function articleLink(article: Article | null | undefined): string {
  if (!article) return '/';
  return `/article/${article.slug ?? article.id ?? ''}`;
}

export function MasterBentoHero({
  mainStory,
  securityCell,
  gamingCell,
  bottomLeft,
  bottomRight,
  videoUrl,
}: MasterBentoHeroProps) {
  const navigate = useNavigate();

  return (
    <section
      className="grid grid-cols-12 gap-3 md:gap-4 max-w-7xl mx-auto px-4"
      aria-label="Featured stories"
    >
      {/* Cell 1: Main – col-span-8 row-span-2, video/image overlay */}
      <motion.div
        className="col-span-12 md:col-span-8 row-span-2 min-h-[280px] md:min-h-[360px] rounded-xl overflow-hidden cursor-pointer"
        initial="rest"
        whileHover="hover"
        variants={hoverLift}
        transition={cellTransition}
        onClick={() => navigate(articleLink(mainStory))}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate(articleLink(mainStory))}
        aria-label={`Read article: ${mainStory.title}`}
      >
        <div className="block relative w-full h-full min-h-[280px] md:min-h-[360px]">
          <div className="absolute inset-0 bg-muted">
            {videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                aria-hidden
              />
            ) : (
              <LazyImage
                src={mainStory.imageUrl}
                priority
                alt={mainStory.title}
                className="w-full h-full object-cover"
                width={960}
                height={540}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" aria-hidden />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
            <h2 className="font-display font-bold text-xl md:text-3xl line-clamp-2 mb-2 drop-shadow-lg">
              {mainStory.title}
            </h2>
            <p className="text-sm md:text-base text-white/90 line-clamp-2 mb-3 drop-shadow-md">
              {mainStory.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
              <span className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <User className="h-3.5 w-3.5" />
                <Link to={`/author/${authorSlug(mainStory.author)}`} className="hover:underline">
                  {mainStory.author}
                </Link>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {mainStory.readTime} min · {formatRelativeTime(mainStory.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cell 2: Security – col-span-4 row-span-1, pulsing LIVE badge */}
      {securityCell && (
        <motion.div
          className="col-span-6 md:col-span-4 row-span-1 min-h-[140px] md:min-h-[176px] rounded-xl overflow-hidden"
          initial="rest"
          whileHover="hover"
          variants={hoverLift}
          transition={cellTransition}
        >
          <Link to={articleLink(securityCell.article)} className="block relative w-full h-full min-h-[140px] md:min-h-[176px] bg-card border border-border overflow-hidden animate-scanline">
            <LazyImage
              src={securityCell.article.imageUrl}
              alt={securityCell.article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              width={400}
              height={200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge className="bg-red-600 text-white animate-pulse border border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                LIVE
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <span className="text-xs font-medium text-white/90">{securityCell.label}</span>
              <p className="font-semibold text-sm line-clamp-2">{securityCell.article.title}</p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Cell 3: Gaming – col-span-4 row-span-1 */}
      {gamingCell && (
        <motion.div
          className="col-span-6 md:col-span-4 row-span-1 min-h-[140px] md:min-h-[176px] rounded-xl overflow-hidden"
          initial="rest"
          whileHover="hover"
          variants={hoverLift}
          transition={cellTransition}
        >
          <Link to={articleLink(gamingCell.article)} className="block relative w-full h-full min-h-[140px] md:min-h-[176px] bg-card border border-border overflow-hidden">
            <LazyImage
              src={gamingCell.article.imageUrl}
              alt={gamingCell.article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
              width={400}
              height={200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className={gamingCell.badgeClass}>{gamingCell.label}</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <p className="font-semibold text-sm line-clamp-2">{gamingCell.article.title}</p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Cell 4: Bottom left – col-span-6 */}
      {bottomLeft && (
        <motion.div
          className="col-span-12 md:col-span-6 min-h-[120px] rounded-xl overflow-hidden"
          initial="rest"
          whileHover="hover"
          variants={hoverLift}
          transition={cellTransition}
        >
          <Link to={articleLink(bottomLeft.article)} className="flex gap-3 w-full h-full min-h-[120px] bg-card border border-border rounded-xl overflow-hidden">
            <div className="w-32 md:w-40 shrink-0 relative">
              <LazyImage
                src={bottomLeft.article.imageUrl}
                alt={bottomLeft.article.title}
                className="w-full h-full object-cover"
                width={160}
                height={120}
              />
            </div>
            <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
              <Badge className={bottomLeft.badgeClass + ' w-fit mb-1'} variant="secondary">
                {bottomLeft.label}
              </Badge>
              <p className="font-semibold text-sm line-clamp-2 text-foreground">{bottomLeft.article.title}</p>
              <span className="text-xs text-muted-foreground mt-1">{formatRelativeTime(bottomLeft.article.publishedAt)}</span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Cell 5: Bottom right – col-span-6 */}
      {bottomRight && (
        <motion.div
          className="col-span-12 md:col-span-6 min-h-[120px] rounded-xl overflow-hidden"
          initial="rest"
          whileHover="hover"
          variants={hoverLift}
          transition={cellTransition}
        >
          <Link to={articleLink(bottomRight.article)} className="flex gap-3 w-full h-full min-h-[120px] bg-card border border-border rounded-xl overflow-hidden">
            <div className="w-32 md:w-40 shrink-0 relative">
              <LazyImage
                src={bottomRight.article.imageUrl}
                alt={bottomRight.article.title}
                className="w-full h-full object-cover"
                width={160}
                height={120}
              />
            </div>
            <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
              <Badge className={bottomRight.badgeClass + ' w-fit mb-1'} variant="secondary">
                {bottomRight.label}
              </Badge>
              <p className="font-semibold text-sm line-clamp-2 text-foreground">{bottomRight.article.title}</p>
              <span className="text-xs text-muted-foreground mt-1">{formatRelativeTime(bottomRight.article.publishedAt)}</span>
            </div>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
