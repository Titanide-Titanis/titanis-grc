import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Clock, X, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SurgeAlert {
  id: string;
  alert_name: string;
  alert_type: string;
  threshold_value: number;
  threshold_period_hours: number;
  is_active: boolean;
  last_triggered?: string;
  trigger_count: number;
}

export function SurgeAlerts() {
  const [alerts, setAlerts] = useState<SurgeAlert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchSurgeAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('surge_alert_configs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setAlerts(data || []);

      // Simulate checking for active alerts
      const mockActiveAlerts = [
        {
          id: '1',
          type: 'incident_spike',
          message: '5 new incidents reported in the last 2 hours (threshold: 3)',
          severity: 'high',
          triggered_at: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'overdue_tasks',
          message: '12 tasks are now overdue (threshold: 10)',
          severity: 'medium',
          triggered_at: new Date().toISOString(),
        }
      ];
      setActiveAlerts(mockActiveAlerts);
    } catch (error) {
      console.error('Error fetching surge alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  useEffect(() => {
    fetchSurgeAlerts();
  }, [user]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {activeAlerts.map((alert) => (
        <Alert 
          key={alert.id} 
          className={`border-l-4 ${
            alert.severity === 'high' 
              ? 'border-l-destructive bg-destructive/5' 
              : 'border-l-warning bg-warning/5'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                alert.severity === 'high' ? 'text-destructive' : 'text-warning'
              }`} />
              <div className="space-y-1">
                <AlertTitle className="flex items-center gap-2">
                  Surge Alert: {alert.type.replace('_', ' ').toUpperCase()}
                  <Badge 
                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {alert.message}
                </AlertDescription>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.triggered_at).toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Threshold exceeded
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
              >
                <Settings className="h-3 w-3" />
                Configure
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
}