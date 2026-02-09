/**
 * Interactive Kanban Board for Roadmap
 * Trello/Linear-style board with columns for different statuses
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapVoting } from './RoadmapVoting';
import { CheckCircle2, Circle, Clock, Zap, Users, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Feature } from '@/pages/Roadmap';

interface RoadmapKanbanProps {
  features: Feature[];
}

const statusColumns = [
  { id: 'planned', label: 'Planned', color: 'border-gray-300 bg-gray-50' },
  { id: 'in-progress', label: 'In Progress', color: 'border-blue-300 bg-blue-50' },
  { id: 'completed', label: 'Shipped', color: 'border-green-300 bg-green-50' },
] as const;

export function RoadmapKanban({ features }: RoadmapKanbanProps) {
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);

  const featuresByStatus = useMemo(() => {
    const grouped: Record<string, Feature[]> = {
      planned: [],
      'in-progress': [],
      completed: [],
    };

    features.forEach((feature) => {
      if (feature.status in grouped) {
        grouped[feature.status].push(feature);
      }
    });

    // Sort by priority within each column
    Object.keys(grouped).forEach((status) => {
      grouped[status].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    });

    return grouped;
  }, [features]);

  const getStatusIcon = (status: Feature['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTierIcon = (tier: Feature['tier']) => {
    switch (tier) {
      case 1:
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Users className="h-4 w-4 text-blue-500" />;
      case 3:
        return <Globe className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => {
        const columnFeatures = featuresByStatus[column.id] || [];
        
        return (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{column.label}</h3>
              <Badge variant="outline">{columnFeatures.length}</Badge>
            </div>
            
            <div className="space-y-3 min-h-[400px]">
              {columnFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={cn(
                    'hover:shadow-md transition-all cursor-move',
                    draggedFeature === feature.id && 'opacity-50'
                  )}
                  draggable
                  onDragStart={() => setDraggedFeature(feature.id)}
                  onDragEnd={() => setDraggedFeature(null)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(feature.status)}
                          {getTierIcon(feature.tier)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Tier {feature.tier}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-tight">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {feature.estimatedEffort}
                        </Badge>
                        <RoadmapVoting featureId={feature.id} />
                      </div>

                      {feature.liveUrl && (
                        <a
                          href={feature.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Try it live <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {columnFeatures.length === 0 && (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                  <p className="text-sm">No features in this column</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
