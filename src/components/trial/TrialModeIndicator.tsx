import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const TrialModeIndicator: React.FC = () => {
  const { isTrialMode, isDemoMode, trialDaysRemaining } = useAuth();

  if (!isTrialMode && !isDemoMode) return null;

  if (isDemoMode) {
    return (
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 px-4 py-2 border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">Demo Mode</span>
            </div>
            <div className="h-4 border-l border-accent/30"></div>
            <span className="text-sm text-muted-foreground">
              Exploring TITANIS™ with realistic scenarios
            </span>
          </div>
          <Badge variant="outline" className="border-accent/30 text-accent">
            Read-Only Experience
          </Badge>
        </div>
      </div>
    );
  }

  if (isTrialMode && trialDaysRemaining !== null) {
    const progressPercentage = ((14 - trialDaysRemaining) / 14) * 100;
    const isExpiringSoon = trialDaysRemaining <= 3;

    return (
      <div className={`px-4 py-2 border-b ${isExpiringSoon 
        ? 'bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20' 
        : 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`} />
              <span className={`font-medium ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
                Trial Mode
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'} remaining
              </span>
              <div className="w-24 hidden sm:block">
                <Progress 
                  value={progressPercentage} 
                  className={`h-2 ${isExpiringSoon ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpiringSoon && (
              <Badge variant="destructive" className="animate-pulse">
                Expires Soon
              </Badge>
            )}
            <Button size="sm" variant="outline" className="gap-2">
              <Crown className="h-3 w-3" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};