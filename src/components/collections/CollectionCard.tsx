import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collection } from '@/types/collections';
import { Folder, MoreVertical, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface CollectionCardProps {
  collection: Collection;
  onEdit?: (collection: Collection) => void;
  onDelete?: (id: string) => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: collection.color || '#6366f1' }}
            >
              <Folder className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                <Link to={`/collections/${collection.id}`} className="hover:underline">
                  {collection.name}
                </Link>
              </CardTitle>
              <CardDescription>
                {collection.articleIds.length} {collection.articleIds.length === 1 ? 'article' : 'articles'}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(collection)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(collection.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-2">{collection.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {collection.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {collection.isPublic && (
            <Badge variant="outline">Public</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Updated {format(new Date(collection.updatedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}



