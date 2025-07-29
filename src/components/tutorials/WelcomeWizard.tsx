import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Play, BookOpen, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TutorialOverlay } from "./TutorialOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tutorial?: any;
  completed: boolean;
}

interface WelcomeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function WelcomeWizard({ isOpen, onClose, onComplete }: WelcomeWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTutorial, setActiveTutorial] = useState<any>(null);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  
  const [steps, setSteps] = useState<WelcomeStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to TITANIS™',
      description: 'Your comprehensive Governance, Risk & Compliance platform. Let\'s get you started with a quick tour.',
      icon: <Shield className="h-6 w-6" />,
      completed: false
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Learn how to navigate your GRC dashboard and understand key metrics.',
      icon: <CheckCircle className="h-6 w-6" />,
      tutorial: {
        id: 'dashboard-tour',
        title: 'Dashboard Tour',
        description: 'Get familiar with your GRC dashboard',
        category: 'getting-started',
        estimated_duration: 5,
        steps: [
          {
            id: 'dash-1',
            title: 'Welcome to Your Dashboard',
            description: 'This is your central command center for all GRC activities.',
            target: '[data-testid="metrics-grid"]',
            position: 'bottom'
          },
          {
            id: 'dash-2', 
            title: 'Key Metrics',
            description: 'Monitor your compliance status, risk levels, and recent activities at a glance.',
            target: '[data-testid="compliance-overview"]',
            position: 'bottom'
          },
          {
            id: 'dash-3',
            title: 'Risk Heatmap',
            description: 'Visualize your organization\'s risk landscape with this interactive heatmap.',
            target: '[data-testid="risk-heatmap"]',
            position: 'left'
          }
        ]
      },
      completed: false
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Discover how to identify, assess, and mitigate risks using our Risk Wizard.',
      icon: <Shield className="h-6 w-6" />,
      tutorial: {
        id: 'risk-tour',
        title: 'Risk Management Tour',
        description: 'Learn the risk management workflow',
        category: 'risk',
        estimated_duration: 7,
        steps: [
          {
            id: 'risk-1',
            title: 'Risk Management Hub',
            description: 'This is where you manage all organizational risks.',
            action: 'Navigate to Risk Management from the sidebar'
          },
          {
            id: 'risk-2',
            title: 'Create New Risk',
            description: 'Use the Risk Wizard to systematically identify and assess new risks.',
            action: 'Click the "Create Risk Assessment" button to start'
          }
        ]
      },
      completed: false
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      description: 'Access compliance frameworks, best practices, and support resources.',
      icon: <BookOpen className="h-6 w-6" />,
      tutorial: {
        id: 'knowledge-tour',
        title: 'Knowledge Base Tour',
        description: 'Explore available resources and documentation',
        category: 'knowledge',
        estimated_duration: 4,
        steps: [
          {
            id: 'kb-1',
            title: 'Knowledge Resources',
            description: 'Access frameworks, guides, and best practices for GRC.',
            action: 'Navigate to Knowledge Base from the sidebar'
          },
          {
            id: 'kb-2',
            title: 'Search and Filter',
            description: 'Find specific content using search and category filters.',
            action: 'Try searching for "ISO 27001" or browse by category'
          }
        ]
      },
      completed: false
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Learn how to invite team members and manage roles and permissions.',
      icon: <Users className="h-6 w-6" />,
      tutorial: {
        id: 'team-tour',
        title: 'Team Management Tour',
        description: 'Set up your team for collaborative GRC management',
        category: 'team',
        estimated_duration: 6,
        steps: [
          {
            id: 'team-1',
            title: 'Team Management',
            description: 'Manage your GRC team members and their roles.',
            action: 'Navigate to Team Management from the sidebar'
          },
          {
            id: 'team-2',
            title: 'Invite Members',
            description: 'Add new team members with appropriate roles and permissions.',
            action: 'Click "Invite Member" to add someone to your team'
          }
        ]
      },
      completed: false
    }
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const allCompleted = steps.every(step => step.completed);

  useEffect(() => {
    if (user) {
      loadWelcomeProgress();
    }
  }, [user]);

  const loadWelcomeProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('tutorial_id', 'welcome-wizard');

      if (data && data.length > 0 && !error) {
        const completedStepIds = data[0].completed_steps || [];
        setSteps(prev => prev.map(step => ({
          ...step,
          completed: completedStepIds.includes(step.id)
        })));
        
        const lastIncompleteIndex = steps.findIndex(step => !completedStepIds.includes(step.id));
        if (lastIncompleteIndex >= 0) {
          setCurrentStep(lastIncompleteIndex);
        }
      }
    } catch (error) {
      console.error('Error loading welcome progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const completedStepIds = steps.filter(step => step.completed).map(step => step.id);
      
      const progressData = {
        user_id: user?.id,
        tutorial_id: 'welcome-wizard',
        current_step: steps[currentStep]?.id,
        completed_steps: completedStepIds,
        completed_at: allCompleted ? new Date().toISOString() : null
      };

      await supabase
        .from('tutorial_progress')
        .upsert(progressData);
    } catch (error) {
      console.error('Error saving welcome progress:', error);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
    saveProgress();
  };

  const startTutorial = (tutorial: any) => {
    setActiveTutorial(tutorial);
    setIsTutorialActive(true);
  };

  const handleTutorialComplete = () => {
    setIsTutorialActive(false);
    setActiveTutorial(null);
    markStepCompleted(currentStep);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleTutorialSkip = () => {
    setIsTutorialActive(false);
    setActiveTutorial(null);
    markStepCompleted(currentStep);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.tutorial) {
      startTutorial(step.tutorial);
    } else {
      markStepCompleted(currentStep);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }
  };

  const handleSkipAll = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Main welcome wizard */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] z-40">
          <Card className="animate-scale-in">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {steps[currentStep]?.icon}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {steps[currentStep]?.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {steps[currentStep]?.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{currentStep + 1} of {steps.length}</span>
                  </div>
                  <Progress value={progress} className="w-full h-2" />
                </div>
              </div>

              <Separator />

              {/* Step overview */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Getting Started Steps</h3>
                <div className="grid gap-2">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        index === currentStep ? 'bg-primary/10 border border-primary/20' :
                        step.completed ? 'bg-success/10' : 'bg-muted/30'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-success text-success-foreground' :
                        index === currentStep ? 'bg-primary text-primary-foreground' :
                        'bg-muted'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.title}</p>
                      </div>
                      {step.tutorial && (
                        <Badge variant="secondary" className="text-xs">
                          Interactive
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleSkipAll}
                >
                  Skip Welcome
                </Button>
                
                <div className="flex items-center gap-2">
                  {allCompleted ? (
                    <Button onClick={onComplete} className="px-6">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="px-6">
                      {steps[currentStep]?.tutorial ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Tutorial
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tutorial overlay */}
      <TutorialOverlay
        tutorial={activeTutorial}
        isActive={isTutorialActive}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
        onClose={() => setIsTutorialActive(false)}
      />
    </>
  );
}