import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, RotateCw, Settings, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarIntegration {
  id: string;
  provider: string;
  name: string;
  status: 'connected' | 'error' | 'disconnected';
  lastSync?: string;
  syncEnabled: boolean;
}

export function CalendarIntegrations() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([
    {
      id: '1',
      provider: 'outlook',
      name: 'Microsoft Outlook',
      status: 'disconnected',
      syncEnabled: false,
    },
    {
      id: '2',
      provider: 'google',
      name: 'Google Calendar',
      status: 'disconnected',
      syncEnabled: false,
    },
    {
      id: '3',
      provider: 'teams',
      name: 'Microsoft Teams',
      status: 'disconnected',
      syncEnabled: false,
    },
  ]);

  const { toast } = useToast();

  const handleConnect = (provider: string) => {
    // Simulate connection process
    toast({
      title: "Integration Setup",
      description: `${provider} integration is not yet available in this demo. This feature will sync compliance tasks with your external calendar.`,
    });
  };

  const handleSyncToggle = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, syncEnabled: enabled }
        : integration
    ));

    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: `Calendar sync has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integrations
        </CardTitle>
        <CardDescription>
          Sync compliance tasks with external calendar systems for unified scheduling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Integration Status Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'connected').length}
            </p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {integrations.filter(i => i.syncEnabled).length}
            </p>
            <p className="text-sm text-muted-foreground">Syncing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'error').length}
            </p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </div>
        </div>

        <Separator />

        {/* Available Integrations */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Available Integrations</h4>
          
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(integration.status)}
                    <Badge variant={getStatusColor(integration.status) as any} className="text-xs">
                      {integration.status}
                    </Badge>
                    {integration.lastSync && (
                      <span className="text-xs text-muted-foreground">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {integration.status === 'connected' && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`sync-${integration.id}`} className="text-sm">
                      Sync
                    </Label>
                    <Switch
                      id={`sync-${integration.id}`}
                      checked={integration.syncEnabled}
                      onCheckedChange={(checked) => handleSyncToggle(integration.id, checked)}
                    />
                  </div>
                )}

                {integration.status === 'connected' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <RotateCw className="h-3 w-3" />
                      Sync Now
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Settings
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleConnect(integration.name)}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Settings */}
        <div className="space-y-4">
          <Separator />
          <h4 className="text-sm font-medium">Sync Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Auto-create reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Bidirectional sync</span>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Include task descriptions</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Sync completed tasks</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Calendar integrations allow you to sync compliance tasks with your external calendar systems. 
            This helps ensure all team members stay informed about important deadlines and can manage their time effectively.
            Tasks will appear as calendar events with appropriate reminders and details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}