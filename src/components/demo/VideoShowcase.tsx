import React from 'react';
import { DemoVideoLibrary } from './DemoVideoLibrary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface VideoShowcaseProps {
  embedded?: boolean;
  selectedCategory?: string;
  selectedIndustry?: string;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  embedded = false,
  selectedCategory = 'All',
  selectedIndustry = 'All'
}) => {
  if (embedded) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <CardTitle>Demo Videos</CardTitle>
            <Badge variant="secondary">Featured</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DemoVideoLibrary
            embedded={true}
            selectedCategory={selectedCategory}
            selectedIndustry={selectedIndustry}
            onVideoSelect={(video) => console.log('Selected video:', video.title)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">TITANIS™ Demo Videos</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive library of demo videos showcasing TITANIS™ features,
          industry-specific scenarios, and step-by-step tutorials.
        </p>
      </div>
      
      <DemoVideoLibrary
        selectedCategory={selectedCategory}
        selectedIndustry={selectedIndustry}
        onVideoSelect={(video) => console.log('Selected video:', video.title)}
      />
    </div>
  );
};