import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  highlight?: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: string;
  estimated_duration: number;
}

interface TutorialOverlayProps {
  tutorial: Tutorial | null;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function TutorialOverlay({ 
  tutorial, 
  isActive, 
  onComplete, 
  onSkip, 
  onClose 
}: TutorialOverlayProps) {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = tutorial?.steps[currentStepIndex];
  const progress = tutorial ? ((currentStepIndex + 1) / tutorial.steps.length) * 100 : 0;

  useEffect(() => {
    if (tutorial && user) {
      loadProgress();
    }
  }, [tutorial, user]);

  const loadProgress = async () => {
    if (!tutorial || !user) return;

    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('tutorial_id', tutorial.id)
        .single();

      if (data && !error) {
        setCompletedSteps(data.completed_steps || []);
        const lastStepIndex = tutorial.steps.findIndex(s => s.id === data.current_step);
        if (lastStepIndex >= 0) {
          setCurrentStepIndex(lastStepIndex);
        }
      }
    } catch (error) {
      console.error('Error loading tutorial progress:', error);
    }
  };

  const saveProgress = async () => {
    if (!tutorial || !user || !currentStep) return;

    try {
      const progressData = {
        user_id: user.id,
        tutorial_id: tutorial.id,
        current_step: currentStep.id,
        completed_steps: completedSteps,
        completed_at: currentStepIndex === tutorial.steps.length - 1 ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('tutorial_progress')
        .upsert(progressData);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
    }
  };

  const handleNext = () => {
    if (!tutorial || !currentStep) return;

    const newCompletedSteps = [...completedSteps];
    if (!newCompletedSteps.includes(currentStep.id)) {
      newCompletedSteps.push(currentStep.id);
      setCompletedSteps(newCompletedSteps);
    }

    if (currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }

    saveProgress();
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      saveProgress();
    }
  };

  const handleComplete = () => {
    setIsPlaying(false);
    onComplete();
    saveProgress();
  };

  const handleSkip = () => {
    setIsPlaying(false);
    onSkip();
  };

  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('tutorial-highlight');
      setTimeout(() => {
        element.classList.remove('tutorial-highlight');
      }, 3000);
    }
  };

  useEffect(() => {
    if (isActive && currentStep?.target) {
      highlightElement(currentStep.target);
    }
  }, [isActive, currentStep]);

  if (!isActive || !tutorial || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
      
      {/* Tutorial card */}
      <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] z-50 animate-scale-in">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{tutorial.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  Step {currentStepIndex + 1} of {tutorial.steps.length}
                </Badge>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h4 className="font-medium text-primary">{currentStep.title}</h4>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
            
            {currentStep.action && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-primary mb-1">Action Required:</p>
                <p className="text-xs text-muted-foreground">{currentStep.action}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
              >
                Skip Tutorial
              </Button>
              {!isPlaying ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(false)}
                >
                  <Square className="h-3 w-3 mr-1" />
                  Pause
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Previous
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
              >
                {currentStepIndex === tutorial.steps.length - 1 ? 'Complete' : 'Next'}
                {currentStepIndex < tutorial.steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Step indicator tooltip */}
      {currentStep.target && (
        <style>{`
          .tutorial-highlight {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3);
            border-radius: 4px;
            animation: pulse 2s infinite;
          }
          
          .tutorial-highlight::after {
            content: '';
            position: absolute;
            inset: -8px;
            border: 2px solid hsl(var(--primary));
            border-radius: 8px;
            pointer-events: none;
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      )}
    </>
  );
}