import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineVideoEmbedProps {
  videoId: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  category?: string;
  autoExpand?: boolean;
  onPlay?: () => void;
  onViewFull?: () => void;
  className?: string;
}

export const InlineVideoEmbed: React.FC<InlineVideoEmbedProps> = ({
  videoId,
  title,
  description,
  duration,
  thumbnail,
  category,
  autoExpand = false,
  onPlay,
  onViewFull,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsExpanded(true);
    onPlay?.();
  };

  const handleViewFull = () => {
    onViewFull?.();
  };

  return (
    <Card className={cn("overflow-hidden border-primary/20", className)}>
      <CardContent className="p-0">
        {/* Compact View */}
        {!isExpanded && (
          <div className="flex items-center gap-4 p-4">
            <div className="relative flex-shrink-0">
              <img
                src={thumbnail}
                alt={title}
                className="w-24 h-16 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  size="sm"
                  onClick={handlePlay}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <Play className="h-3 w-3 ml-0.5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-1 mb-1">{title}</h4>
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {description}
                </p>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  {duration}
                </Badge>
                {category && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {category}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(true)}
              >
                Watch
              </Button>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-0">
            <div className="relative">
              {isPlaying ? (
                <video
                  className="w-full h-64 bg-black"
                  controls
                  autoPlay
                  poster={thumbnail}
                >
                  <source src={`https://www.w3schools.com/html/mov_bbb.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={handlePlay}
                      className="rounded-full h-16 w-16"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{title}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {duration}
                    </Badge>
                    {category && (
                      <Badge variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Minimize
                </Button>
                
                {onViewFull && (
                  <Button
                    size="sm"
                    onClick={handleViewFull}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Player
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};