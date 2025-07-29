import { Search, Globe, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="h-16 bg-gradient-to-r from-card to-card/95 border-b border-border px-6 flex items-center justify-between backdrop-blur-sm">
      {/* TITANIS™ Brand & Search */}
      <div className="flex items-center space-x-6 flex-1 max-w-2xl">
        <div className="flex items-center space-x-3">
          <img 
            src="/favicon.png" 
            alt="TITANIS™ Logo" 
            className="w-8 h-8 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TITANIS™
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Enterprise GRC Platform</p>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across TITANIS™ platform..."
            className="pl-10 bg-muted/30 border-muted/50 focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Jurisdiction Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              US/EU/UK
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Active Jurisdictions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>🇺🇸 United States</DropdownMenuItem>
            <DropdownMenuItem>🇪🇺 European Union</DropdownMenuItem>
            <DropdownMenuItem>🇬🇧 United Kingdom</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Real-time Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              {user?.email?.split('@')[0] || 'User'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.email || 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}