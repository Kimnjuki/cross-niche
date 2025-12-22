import { Article } from './index';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  articleIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  color?: string;
}

export interface CollectionWithArticles extends Collection {
  articles: Article[];
}



