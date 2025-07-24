import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Settings,
  Home,
  BookOpen,
  Search,
  Bell,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'risk', name: 'Risk Management', icon: AlertTriangle },
  { id: 'compliance', name: 'Compliance', icon: CheckCircle },
  { id: 'policies', name: 'Policies', icon: FileText },
  { id: 'audits', name: 'Audits', icon: Search },
  { id: 'incidents', name: 'Incidents', icon: Shield },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'knowledge', name: 'Knowledge Base', icon: BookOpen },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'settings', name: 'Settings', icon: Settings }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">NexusGRC</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "px-2"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.name}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                GRC Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}