import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineVideoEmbed } from './InlineVideoEmbed';
import { 
  Building2, 
  Heart, 
  Code, 
  Factory, 
  RefreshCw, 
  Play, 
  Eye,
  ArrowRight,
  Star,
  Video
} from "lucide-react";

// Import video thumbnails
import bankingRiskThumb from '@/assets/video-thumbnails/banking-risk.jpg';
import healthcareHipaaThumb from '@/assets/video-thumbnails/healthcare-hipaa.jpg';
import techIso27001Thumb from '@/assets/video-thumbnails/tech-iso27001.jpg';
import platformOverviewThumb from '@/assets/video-thumbnails/platform-overview.jpg';

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: React.ReactNode;
  employeeCount: string;
  focusAreas: string[];
}

const demoScenarios: DemoScenario[] = [
  {
    id: "financial",
    name: "Regional Bank",
    description: "Multi-branch financial institution with comprehensive compliance requirements",
    industry: "Financial Services",
    icon: <Building2 className="h-5 w-5" />,
    employeeCount: "500 employees",
    focusAreas: ["SOX Compliance", "Operational Risk", "Vendor Management", "Regulatory Reporting"]
  },
  {
    id: "healthcare",
    name: "Healthcare System",
    description: "Multi-location healthcare provider with patient safety focus",
    industry: "Healthcare",
    icon: <Heart className="h-5 w-5" />,
    employeeCount: "1,200 employees",
    focusAreas: ["HIPAA Compliance", "Patient Safety", "Incident Management", "Joint Commission"]
  },
  {
    id: "technology",
    name: "SaaS Company",
    description: "Global software-as-a-service provider with data privacy emphasis",
    industry: "Technology",
    icon: <Code className="h-5 w-5" />,
    employeeCount: "300 employees",
    focusAreas: ["ISO 27001", "Data Privacy", "Security Incidents", "Third-party Risk"]
  },
  {
    id: "manufacturing",
    name: "Manufacturing Enterprise",
    description: "Global manufacturing with environmental and operational safety focus",
    industry: "Manufacturing",
    icon: <Factory className="h-5 w-5" />,
    employeeCount: "2,500 employees",
    focusAreas: ["Environmental Compliance", "Operational Safety", "Supply Chain Risk", "Quality Management"]
  }
];

interface DemoModeSelectorProps {
  onSelectScenario: (scenario: DemoScenario) => void;
  onStartTrial: () => void;
  onResetDemo: () => void;
}

export const DemoModeSelector: React.FC<DemoModeSelectorProps> = ({
  onSelectScenario,
  onStartTrial,
  onResetDemo
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenarioId);
      onSelectScenario(scenario);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
            <Star className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              TITANIS™ Demo
            </h1>
            <p className="text-sm text-muted-foreground">Interactive Platform Demonstration</p>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience TITANIS™ through realistic industry scenarios. Choose a demo scenario below to explore
          our comprehensive GRC platform with sample data and workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoScenarios.map((scenario) => (
          <Card 
            key={scenario.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedScenario === scenario.id 
                ? 'ring-2 ring-accent border-accent' 
                : 'hover:border-accent/50'
            }`}
            onClick={() => handleScenarioSelect(scenario.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {scenario.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <CardDescription>{scenario.industry}</CardDescription>
                  </div>
                </div>
                {selectedScenario === scenario.id && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Selected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{scenario.employeeCount}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Focus Areas:</h4>
                <div className="flex flex-wrap gap-1">
                  {scenario.focusAreas.map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Video Showcase */}
      <div className="border-t pt-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Watch TITANIS™ in Action</h2>
          <p className="text-muted-foreground">
            See how our platform transforms GRC processes with these demo videos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InlineVideoEmbed
            videoId="platform-intro"
            title="TITANIS™ Platform Introduction"
            description="Get an overview of the complete TITANIS™ GRC platform and its key capabilities."
            duration="5:32"
            thumbnail={platformOverviewThumb}
            category="Platform Overview"
            onPlay={() => console.log('Playing platform intro')}
            onViewFull={() => console.log('View full demo video library')}
          />

          {selectedScenario && (
            <InlineVideoEmbed
              videoId={`${selectedScenario}-demo`}
              title={`${demoScenarios.find(s => s.id === selectedScenario)?.name} Demo`}
              description={`See TITANIS™ in action for ${demoScenarios.find(s => s.id === selectedScenario)?.industry} scenarios.`}
              duration="8:45"
              thumbnail={
                selectedScenario === 'financial' ? bankingRiskThumb :
                selectedScenario === 'healthcare' ? healthcareHipaaThumb :
                selectedScenario === 'technology' ? techIso27001Thumb :
                platformOverviewThumb
              }
              category="Industry Demo"
              onPlay={() => console.log(`Playing ${selectedScenario} demo`)}
              onViewFull={() => console.log('View full demo video library')}
            />
          )}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => console.log('Navigate to video library')}
          >
            <Video className="h-4 w-4" />
            View All Demo Videos
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
        <Button
          onClick={() => {
            const scenario = demoScenarios.find(s => s.id === selectedScenario);
            if (scenario) onSelectScenario(scenario);
          }}
          disabled={!selectedScenario}
          className="gap-2 bg-gradient-to-r from-accent to-accent/80"
          size="lg"
        >
          <Play className="h-4 w-4" />
          Start Demo Experience
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>or</span>
        </div>

        <Button
          onClick={onStartTrial}
          variant="outline"
          className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
          size="lg"
        >
          <ArrowRight className="h-4 w-4" />
          Start 14-Day Trial
        </Button>
      </div>

      <div className="text-center pt-4">
        <Button
          onClick={onResetDemo}
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
};