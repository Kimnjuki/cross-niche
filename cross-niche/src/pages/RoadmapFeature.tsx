import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useConvexDisabled } from "@/components/SafeConvexProvider";

function renderRoadmapBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={`h2-${index}`} className="text-xl font-semibold mt-6">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      return (
        <p key={`p-${index}`} className="text-muted-foreground leading-7 whitespace-pre-wrap">
          {block}
        </p>
      );
    });
}

export default function RoadmapFeature() {
  const { featureId } = useParams<{ featureId: string }>();
  const slug = (featureId ?? "").trim();

  const isConvexDisabled = useConvexDisabled();
  const { user } = useAuth();
  const userId = user?.id || `session-${localStorage.getItem("sessionId") || "anonymous"}`;

  const feature = useQuery(
    api.roadmap.getRoadmapFeatureBySlug,
    slug ? { slug } : "skip"
  );

  const contentId = (feature?._id ?? null) as any;

  const incrementViewCount = useMutation(api.content.incrementViewCount);
  const comments = useQuery(
    api.comments.getFeatureComments,
    contentId ? { contentId, limit: 50 } : "skip"
  );
  const postComment = useMutation(api.comments.postComment);

  const bookmarks = useQuery(api.bookmarks.getFeatureBookmarks, { userId });
  const bookmarkFeature = useMutation(api.bookmarks.bookmarkFeature);
  const removeBookmark = useMutation(api.bookmarks.removeBookmark);

  const gamification = useQuery(api.gamification.getByUser, { userId });

  const preferences = useQuery(api.users.getUserPreferences, { userId });
  const updateNotificationPreference = useMutation(api.users.updateNotificationPreference);

  const isBookmarked = !!contentId && (bookmarks ?? []).some((id: any) => id === contentId);
  const isFollowing = (preferences?.savedSearches ?? []).includes(slug);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem(
        "sessionId",
        `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      );
    }
  }, []);

  useEffect(() => {
    if (isConvexDisabled) return;
    if (!contentId) return;
    void incrementViewCount({ contentId }).catch(() => {
      // ignore
    });
  }, [contentId, incrementViewCount, isConvexDisabled]);

  const handleToggleBookmark = async () => {
    if (isConvexDisabled) return;
    if (!contentId) return;

    try {
      if (isBookmarked) {
        await removeBookmark({ contentId, userId });
        return;
      }
      await bookmarkFeature({ contentId, userId });
      toast({ title: "+5 XP", description: "Bookmarked" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFollow = async () => {
    if (isConvexDisabled) return;
    if (!slug) return;

    try {
      await updateNotificationPreference({
        userId,
        featureId: slug,
        action: isFollowing ? "unfollow" : "follow",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async () => {
    if (isConvexDisabled) return;
    if (!contentId) return;

    const body = newComment.trim();
    if (!body) return;

    setIsSubmitting(true);
    try {
      await postComment({ contentId, userId, body });
      setNewComment("");
      toast({ title: "+25 XP", description: "Comment posted" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!slug) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Feature not found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/roadmap">Back to roadmap</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (feature === undefined) {
    return (
      <Layout>
        <div className="bg-background text-foreground">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-muted-foreground">Loading roadmap…</p>
              <Button asChild variant="outline">
                <Link to="/roadmap">Back</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (feature === null) {
    return (
      <Layout>
        <div className="bg-background text-foreground">
          <div className="container mx-auto px-4 py-12">
            <Card>
              <CardHeader>
                <CardTitle>Feature not found</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="/roadmap">Back to roadmap</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const title = (feature.title ?? slug) as string;
  const description = (feature?.seoDescription ?? feature?.summary ?? "") as string;

  return (
    <Layout>
      <SEOHead
        title={(feature?.metaTitle ?? `${title} | Product Roadmap | The Grid Nexus`) as string}
        description={description}
        keywords={feature?.focusKeyword ? [feature.focusKeyword] : undefined}
        url={window.location.href}
        type="website"
      />

      <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              {feature?.subtitle && <p className="text-muted-foreground mt-2">{feature.subtitle}</p>}
            </div>
            <Button asChild variant="outline">
              <Link to="/roadmap">Back</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(feature?.niches ?? []).map((n: any) => (
              <Badge key={n?.idNum ?? n?.name} variant="secondary">
                {n?.name}
              </Badge>
            ))}
            {(feature?.tags ?? []).map((t: any) => (
              <Badge key={t?._id ?? t?.slug} variant="outline">
                {t?.name ?? t?.slug}
              </Badge>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feature?.body ? (
                <div className="space-y-4">{renderRoadmapBody(feature.body)}</div>
              ) : (
                <p className="text-muted-foreground">No detailed content available for this feature yet.</p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant={isBookmarked ? "default" : "outline"} onClick={handleToggleBookmark}>
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant={isFollowing ? "default" : "outline"} onClick={handleToggleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                {gamification && (
                  <div className="text-sm text-muted-foreground">
                    XP: <span className="font-semibold text-foreground">{gamification.xp ?? 0}</span> · Level:{" "}
                    <span className="font-semibold text-foreground">{gamification.level ?? 1}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isConvexDisabled ? "Comments unavailable" : "Write a comment..."}
                  disabled={isConvexDisabled}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitComment} disabled={isSubmitting || isConvexDisabled}>
                    Post
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {(comments?.items ?? []).map((c: any) => (
                  <div key={c._id} className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      {(c.user?.displayName ?? c.userId) as string}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap">{c.body}</div>
                  </div>
                ))}

                {(comments?.items ?? []).length === 0 && (
                  <div className="text-sm text-muted-foreground">No comments yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
}
