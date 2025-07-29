import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Mail, 
  Smartphone, 
  Shield, 
  GraduationCap,
  Download,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserPreferences {
  id?: string;
  user_id: string;
  theme_preferences: {
    mode: 'light' | 'dark' | 'system';
    sidebar_collapsed: boolean;
  };
  notification_preferences: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  tutorial_preferences: {
    auto_start: boolean;
    show_tutorials: boolean;
  };
}

export function AccountSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    user_id: user?.id || '',
    theme_preferences: {
      mode: 'system',
      sidebar_collapsed: false
    },
    notification_preferences: {
      email: true,
      push: true,
      in_app: true
    },
    tutorial_preferences: {
      auto_start: false,
      show_tutorials: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferences({
          ...data,
          theme_preferences: data.theme_preferences as UserPreferences['theme_preferences'],
          notification_preferences: data.notification_preferences as UserPreferences['notification_preferences'],
          tutorial_preferences: data.tutorial_preferences as UserPreferences['tutorial_preferences']
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences, { onConflict: 'user_id' });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async () => {
    try {
      // Fetch user data for export
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      const exportData = {
        profile,
        preferences,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `titanis-data-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how TITANIS™ looks for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={preferences.theme_preferences.mode} 
                onValueChange={(value: 'light' | 'dark' | 'system') => 
                  setPreferences({
                    ...preferences, 
                    theme_preferences: {
                      ...preferences.theme_preferences,
                      mode: value
                    }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Collapse Sidebar</Label>
                <p className="text-sm text-muted-foreground">Keep sidebar minimized by default</p>
              </div>
              <Switch
                checked={preferences.theme_preferences.sidebar_collapsed}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    theme_preferences: {
                      ...preferences.theme_preferences,
                      sidebar_collapsed: checked
                    }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={preferences.notification_preferences.email}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    notification_preferences: {
                      ...preferences.notification_preferences,
                      email: checked
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
              </div>
              <Switch
                checked={preferences.notification_preferences.push}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    notification_preferences: {
                      ...preferences.notification_preferences,
                      push: checked
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications in the app</p>
                </div>
              </div>
              <Switch
                checked={preferences.notification_preferences.in_app}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    notification_preferences: {
                      ...preferences.notification_preferences,
                      in_app: checked
                    }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Tutorial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Learning & Tutorials
            </CardTitle>
            <CardDescription>Manage tutorial and help preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start Tutorials</Label>
                <p className="text-sm text-muted-foreground">Automatically start tutorials for new features</p>
              </div>
              <Switch
                checked={preferences.tutorial_preferences.auto_start}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    tutorial_preferences: {
                      ...preferences.tutorial_preferences,
                      auto_start: checked
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Tutorial Tips</Label>
                <p className="text-sm text-muted-foreground">Display helpful tips and guidance</p>
              </div>
              <Switch
                checked={preferences.tutorial_preferences.show_tutorials}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    tutorial_preferences: {
                      ...preferences.tutorial_preferences,
                      show_tutorials: checked
                    }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data Export</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Export your personal data in compliance with GDPR
              </p>
              <Button onClick={handleDataExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-destructive">Danger Zone</Label>
              <p className="text-sm text-muted-foreground mb-2">
                These actions cannot be undone
              </p>
              <Button variant="destructive" size="sm" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground">
                Contact your administrator to delete your account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}