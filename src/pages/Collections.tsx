import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Collections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { collections, createCollection, deleteCollection, isLoading } = useCollections();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: '',
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view and manage your collections.
          </p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Collection name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createCollection({
        name: formData.name,
        description: formData.description || undefined,
        isPublic: formData.isPublic,
        tags: tags.length > 0 ? tags : undefined,
      });

      toast({
        title: 'Success',
        description: 'Collection created successfully',
      });

      setIsDialogOpen(false);
      setFormData({ name: '', description: '', isPublic: false, tags: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await deleteCollection(id);
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete collection',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Collections</h1>
            <p className="text-muted-foreground">
              Organize and save articles into collections
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Organize articles into collections for easy access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Collection"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tech, security, gaming"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <Label htmlFor="public">Make this collection public</Label>
                </div>
                <Button onClick={handleCreateCollection} className="w-full">
                  Create Collection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No collections found matching your search.' : 'No collections yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Collection
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}



