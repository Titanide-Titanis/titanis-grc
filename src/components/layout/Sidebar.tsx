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
  X,
  Building2
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
  { id: 'vendors', name: 'Vendor Management', icon: Building2 },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'reports', name: 'Report Builder', icon: FileText },
  { id: 'automated-reports', name: 'Automated Reports', icon: BarChart3 },
  { id: 'board-reports', name: 'Board Reports', icon: BarChart3 },
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
      {/* TITANIS™ Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 bg-clip-text text-transparent">
                TITANIS™
              </span>
              <p className="text-xs text-sidebar-foreground/70 -mt-1">Enterprise GRC</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent transition-all hover:scale-105"
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
                  "w-full justify-start text-left transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-lg" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                  isCollapsed && "px-2"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform", 
                  !isCollapsed && "mr-3",
                  isActive && "animate-bounce-in"
                )} />
                {!isCollapsed && (
                  <span className={cn(
                    "transition-all",
                    isActive && "font-medium"
                  )}>
                    {item.name}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 group cursor-pointer hover:bg-sidebar-accent/50 rounded-lg p-2 -m-2 transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 rounded-full flex items-center justify-center ring-2 ring-sidebar-primary/30">
            <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate group-hover:text-sidebar-accent-foreground transition-colors">
                John Doe
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                GRC Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}