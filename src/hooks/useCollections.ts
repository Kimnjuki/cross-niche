import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import type { Collection, CollectionWithArticles } from '@/types/collections';
import { mockArticles } from '@/data/mockData';
import { Article } from '@/types';

export function useCollections() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [collections, setCollections] = useLocalStorage<Collection[]>(
    `collections-${user?.id || 'anonymous'}`,
    []
  );

  const collectionsQuery = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: () => collections,
    enabled: !!user,
  });

  const createCollection = useMutation({
    mutationFn: async (data: { name: string; description?: string; isPublic?: boolean; tags?: string[] }) => {
      if (!user) throw new Error('Must be logged in to create collections');
      
      const newCollection: Collection = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        userId: user.id,
        articleIds: [],
        isPublic: data.isPublic ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: data.tags,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      };

      const updated = [...collections, newCollection];
      setCollections(updated);
      return newCollection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  const updateCollection = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Collection> & { id: string }) => {
      if (!user) throw new Error('Must be logged in to update collections');
      
      const updated = collections.map(c => 
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      setCollections(updated);
      return updated.find(c => c.id === id)!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Must be logged in to delete collections');
      
      const updated = collections.filter(c => c.id !== id);
      setCollections(updated);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  const addArticleToCollection = useMutation({
    mutationFn: async ({ collectionId, articleId }: { collectionId: string; articleId: string }) => {
      if (!user) throw new Error('Must be logged in to add articles');
      
      const updated = collections.map(c => {
        if (c.id === collectionId && !c.articleIds.includes(articleId)) {
          return {
            ...c,
            articleIds: [...c.articleIds, articleId],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      setCollections(updated);
      return updated.find(c => c.id === collectionId)!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  const removeArticleFromCollection = useMutation({
    mutationFn: async ({ collectionId, articleId }: { collectionId: string; articleId: string }) => {
      if (!user) throw new Error('Must be logged in to remove articles');
      
      const updated = collections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            articleIds: c.articleIds.filter(id => id !== articleId),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      setCollections(updated);
      return updated.find(c => c.id === collectionId)!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.id] });
    },
  });

  const getCollectionWithArticles = (collectionId: string): CollectionWithArticles | null => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return null;

    const articles = collection.articleIds
      .map(id => mockArticles.find(a => a.id === id))
      .filter((a): a is Article => a !== undefined);

    return {
      ...collection,
      articles,
    };
  };

  return {
    collections: collectionsQuery.data || [],
    isLoading: collectionsQuery.isLoading,
    createCollection: createCollection.mutateAsync,
    updateCollection: updateCollection.mutateAsync,
    deleteCollection: deleteCollection.mutateAsync,
    addArticleToCollection: addArticleToCollection.mutateAsync,
    removeArticleFromCollection: removeArticleFromCollection.mutateAsync,
    getCollectionWithArticles,
  };
}



