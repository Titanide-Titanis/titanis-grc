import { Bell, Search, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies, risks, controls..."
            className="pl-10 bg-muted/50"
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

        {/* Notifications */}
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              John Doe
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}