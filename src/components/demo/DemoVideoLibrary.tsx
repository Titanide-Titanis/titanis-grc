import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DemoVideoPlayer, DemoVideo } from './DemoVideoPlayer';
import { Search, Play, Clock, Filter, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import video thumbnails
import platformOverviewThumb from '@/assets/video-thumbnails/platform-overview.jpg';
import bankingRiskThumb from '@/assets/video-thumbnails/banking-risk.jpg';
import healthcareHipaaThumb from '@/assets/video-thumbnails/healthcare-hipaa.jpg';
import techIso27001Thumb from '@/assets/video-thumbnails/tech-iso27001.jpg';
import vendorRiskThumb from '@/assets/video-thumbnails/vendor-risk.jpg';

const demoVideos: DemoVideo[] = [
  // Platform Overview Videos
  {
    id: 'platform-intro',
    title: 'TITANIS™ Platform Introduction',
    description: 'Get an overview of the complete TITANIS™ GRC platform and its key capabilities for enterprise risk management.',
    duration: '5:32',
    category: 'Platform Overview',
    thumbnail: platformOverviewThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    ctaText: 'Start Free Trial',
    ctaAction: () => console.log('Start trial'),
    transcript: 'Welcome to TITANIS™, the comprehensive governance, risk, and compliance platform designed for modern enterprises. In this demonstration, you\'ll discover how our integrated platform transforms complex GRC processes into streamlined, automated workflows. From risk identification to compliance reporting, TITANIS™ provides the tools you need to maintain oversight and control across your organization.',
    relatedArticles: ['getting-started-guide', 'platform-overview']
  },
  {
    id: 'dashboard-navigation',
    title: 'Dashboard Navigation and Key Features',
    description: 'Learn how to navigate the TITANIS™ dashboard and discover key features that will streamline your GRC processes.',
    duration: '8:15',
    category: 'Platform Overview',
    thumbnail: platformOverviewThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['dashboard-basics', 'navigation-guide'],
    ctaText: 'Explore Dashboard',
    ctaAction: () => console.log('Navigate to dashboard')
  },

  // Financial Services Videos
  {
    id: 'banking-risk-management',
    title: 'Risk Management for Financial Institutions',
    description: 'Comprehensive guide to implementing risk management frameworks specifically designed for banking and financial services.',
    duration: '8:45',
    category: 'Feature Demo',
    industry: 'Financial Services',
    thumbnail: bankingRiskThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    ctaText: 'Explore Risk Module',
    ctaAction: () => console.log('Navigate to risk management'),
    relatedArticles: ['risk-management-banking', 'financial-compliance']
  },
  {
    id: 'sox-compliance-demo',
    title: 'SOX Compliance Workflow Demo',
    description: 'Step-by-step demonstration of managing Sarbanes-Oxley compliance requirements using TITANIS™ automated workflows.',
    duration: '12:30',
    category: 'Feature Demo',
    industry: 'Financial Services',
    thumbnail: bankingRiskThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['sox-compliance-guide', 'automated-workflows']
  },

  // Healthcare Videos
  {
    id: 'hipaa-compliance',
    title: 'HIPAA Compliance Management',
    description: 'Complete guide to managing HIPAA compliance requirements, patient data protection, and regulatory reporting.',
    duration: '10:20',
    category: 'Feature Demo',
    industry: 'Healthcare',
    thumbnail: healthcareHipaaThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['hipaa-compliance-guide', 'patient-data-protection']
  },
  {
    id: 'patient-safety-incidents',
    title: 'Patient Safety Incident Tracking',
    description: 'Learn how to effectively track, investigate, and resolve patient safety incidents while maintaining compliance.',
    duration: '8:55',
    category: 'Feature Demo',
    industry: 'Healthcare',
    thumbnail: healthcareHipaaThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['incident-management-healthcare', 'patient-safety-protocols']
  },

  // Technology Videos
  {
    id: 'iso27001-implementation',
    title: 'ISO 27001 Implementation Guide',
    description: 'Comprehensive walkthrough of implementing ISO 27001 information security management systems using TITANIS™.',
    duration: '11:45',
    category: 'Feature Demo',
    industry: 'Technology',
    thumbnail: techIso27001Thumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['iso27001-implementation', 'information-security-management']
  },
  {
    id: 'data-privacy-security',
    title: 'Data Privacy and Security Controls',
    description: 'Advanced techniques for implementing data privacy controls and security measures for technology companies.',
    duration: '9:15',
    category: 'Feature Demo',
    industry: 'Technology',
    thumbnail: techIso27001Thumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['data-privacy-guide', 'security-controls']
  },

  // Module-Specific Videos
  {
    id: 'risk-assessment-process',
    title: 'Advanced Risk Assessment Process',
    description: 'Deep dive into conducting comprehensive risk assessments with automated scoring and heat map visualization.',
    duration: '15:10',
    category: 'Risk Management',
    thumbnail: platformOverviewThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['risk-assessment-guide', 'risk-scoring-methodology']
  },
  {
    id: 'policy-lifecycle',
    title: 'Policy Lifecycle Management',
    description: 'Complete workflow for creating, reviewing, approving, and maintaining organizational policies and procedures.',
    duration: '9:30',
    category: 'Policy Management',
    thumbnail: platformOverviewThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['policy-management-guide', 'policy-approval-workflow']
  },
  {
    id: 'vendor-risk-assessment',
    title: 'Third-Party Vendor Risk Assessment',
    description: 'Systematic approach to evaluating and monitoring third-party vendor risks throughout the relationship lifecycle.',
    duration: '13:20',
    category: 'Vendor Management',
    thumbnail: vendorRiskThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['vendor-risk-guide', 'third-party-assessments']
  },
  {
    id: 'audit-preparation',
    title: 'Audit Preparation and Management',
    description: 'Streamline your audit processes with automated evidence collection and collaborative audit management tools.',
    duration: '11:40',
    category: 'Audit Management',
    thumbnail: platformOverviewThumb,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedArticles: ['audit-management-guide', 'evidence-collection']
  }
];

const categories = ['All', 'Platform Overview', 'Feature Demo', 'Risk Management', 'Compliance', 'Policy Management', 'Vendor Management'];
const industries = ['All', 'Financial Services', 'Healthcare', 'Technology', 'Manufacturing'];

interface DemoVideoLibraryProps {
  selectedCategory?: string;
  selectedIndustry?: string;
  onVideoSelect?: (video: DemoVideo) => void;
  embedded?: boolean;
}

export const DemoVideoLibrary: React.FC<DemoVideoLibraryProps> = ({
  selectedCategory = 'All',
  selectedIndustry = 'All',
  onVideoSelect,
  embedded = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [activeIndustry, setActiveIndustry] = useState(selectedIndustry);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingVideo, setPlayingVideo] = useState<DemoVideo | null>(null);

  const filteredVideos = useMemo(() => {
    return demoVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
      const matchesIndustry = activeIndustry === 'All' || video.industry === activeIndustry;

      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [searchTerm, activeCategory, activeIndustry]);

  const handleVideoPlay = (video: DemoVideo) => {
    setPlayingVideo(video);
    onVideoSelect?.(video);
  };

  const VideoCard: React.FC<{ video: DemoVideo; isCompact?: boolean }> = ({ video, isCompact = false }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Button
            onClick={() => handleVideoPlay(video)}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-12 w-12"
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {video.duration}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
        {!isCompact && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
        )}
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{video.category}</Badge>
          {video.industry && (
            <Badge variant="secondary" className="text-xs">{video.industry}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (embedded && playingVideo) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setPlayingVideo(null)}
          className="mb-4"
        >
          ← Back to Library
        </Button>
        <DemoVideoPlayer
          video={playingVideo}
          showTranscript={true}
          onEngagement={(action, timestamp) => {
            console.log('Video engagement:', action, timestamp);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Demo Video Library</h2>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of TITANIS™ platform demos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Industry</label>
            <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="w-auto">
              <TabsList className="grid grid-cols-3 lg:grid-cols-5">
                {industries.map(industry => (
                  <TabsTrigger key={industry} value={industry} className="text-xs">
                    {industry}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Video Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}>
        {filteredVideos.map(video => (
          <VideoCard 
            key={video.id} 
            video={video} 
            isCompact={viewMode === 'list'}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};