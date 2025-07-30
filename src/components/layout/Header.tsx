import { Search, Globe, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user?.id)
        .single();
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="h-16 bg-gradient-to-r from-card to-card/95 border-b border-border px-6 flex items-center justify-between backdrop-blur-sm">
      {/* TITANIS™ Brand & Search */}
      <div className="flex items-center space-x-6 flex-1 max-w-2xl">
        <div className="flex items-center space-x-3">
          <img 
            src="/src/assets/titanide-logo.png" 
            alt="Titanide Consulting Group Logo" 
            className="w-8 h-8 object-contain" 
          />
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-montserrat bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TITANIS™
              </h1>
              <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-xs font-medium font-montserrat rounded-md border border-secondary/30">
                BETA
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-montserrat -mt-1">Powered by Titanide</p>
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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={userProfile?.avatar_url || ""} />
                <AvatarFallback className="text-xs">
                  {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {userProfile?.first_name || user?.email?.split('@')[0] || 'User'}
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