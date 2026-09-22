import { MapPin, Twitter, Linkedin, Globe, Check } from 'lucide-react';
import type { AuthorProfile } from '@/data/authorData';
import { cn } from '@/lib/utils';

interface AuthorCredentialCardProps {
  profile: AuthorProfile | null;
  className?: string;
}

export function AuthorCredentialCard({ profile, className }: AuthorCredentialCardProps) {
  if (!profile) return null;

  const socialLinks = profile.sameAs ?? [];
  const twitter = socialLinks.find((u) => u.includes('twitter.com') || u.includes('x.com'));
  const linkedin = socialLinks.find((u) => u.includes('linkedin.com'));
  const other = socialLinks.filter((u) => !u.includes('twitter.com') && !u.includes('x.com') && !u.includes('linkedin.com'));

  return (
    <aside
      className={cn(
        'border border-border rounded-xl bg-muted/20 p-6 my-8',
        className
      )}
      aria-label={`About the author: ${profile.name}`}
    >
      {/* Author header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        {profile.imageUrl && (
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border border-border flex-shrink-0"
            width={64}
            height={64}
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-lg text-foreground leading-tight">
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{profile.jobTitle}</p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {profile.bio}
        </p>
      )}

      {/* Expertise badges */}
      {profile.expertise && profile.expertise.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.expertise.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              <Check className="h-3 w-3" />
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${profile.name} on Twitter`}
            >
              <Twitter className="h-4 w-4" />
              <span className="hidden sm:inline">Twitter</span>
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${profile.name} on LinkedIn`}
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          )}
          {other.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${profile.name}'s profile`}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline truncate max-w-[120px]">
                {new URL(url).hostname.replace('www.', '')}
              </span>
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
