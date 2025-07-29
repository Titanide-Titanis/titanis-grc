import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Crown,
  Shield,
  User,
  Eye,
  Settings,
  Calendar,
  Activity,
  MoreHorizontal
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "super_admin" | "admin" | "compliance_officer" | "risk_manager" | "auditor" | "user" | "viewer";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "user" as TeamMember["role"],
    message: ""
  });
  const { toast } = useToast();

  const roleLabels = {
    super_admin: { label: "Super Admin", icon: Crown, color: "bg-purple-100 text-purple-800" },
    admin: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-800" },
    compliance_officer: { label: "Compliance Officer", icon: Shield, color: "bg-blue-100 text-blue-800" },
    risk_manager: { label: "Risk Manager", icon: Shield, color: "bg-orange-100 text-orange-800" },
    auditor: { label: "Auditor", icon: Eye, color: "bg-green-100 text-green-800" },
    user: { label: "User", icon: User, color: "bg-gray-100 text-gray-800" }
  };

  const filterOptions = [
    { value: "all", label: "All Members" },
    { value: "super_admin", label: "Super Admins" },
    { value: "admin", label: "Admins" },
    { value: "compliance_officer", label: "Compliance Officers" },
    { value: "risk_manager", label: "Risk Managers" },
    { value: "auditor", label: "Auditors" },
    { value: "user", label: "Users" }
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSubmit = async () => {
    try {
      // Here you would typically send an invitation email
      // For now, we'll just show a success message
      toast({
        title: "Invitation Sent",
        description: `Invitation has been sent to ${inviteForm.email}`,
      });
      
      setShowInviteDialog(false);
      setInviteForm({ email: "", role: "user", message: "" });
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never";
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const roleStats = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's team members, roles, and permissions
          </p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="member@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteForm.role} onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as TeamMember["role"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Welcome Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Welcome to our team! We're excited to have you join us."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteSubmit} disabled={!inviteForm.email}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.filter(m => m.is_active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(roleStats.super_admin || 0) + (roleStats.admin || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => {
                if (!m.last_login) return false;
                const daysSinceLogin = Math.floor((Date.now() - new Date(m.last_login).getTime()) / (1000 * 60 * 60 * 24));
                return daysSinceLogin <= 7;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => {
                const roleInfo = roleLabels[member.role];
                const RoleIcon = roleInfo.icon;
                
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar_url || ""} />
                          <AvatarFallback>{getInitials(member.first_name, member.last_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate">
                              {member.first_name} {member.last_name}
                            </h3>
                            {!member.is_active && (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${roleInfo.color}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleInfo.label}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {member.title && (
                        <div className="text-sm">
                          <span className="font-medium">Title:</span> {member.title}
                        </div>
                      )}
                      
                      {member.department && (
                        <div className="text-sm">
                          <span className="font-medium">Department:</span> {member.department}
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Last seen:</span> {formatLastLogin(member.last_login)}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        {member.phone && (
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredMembers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No team members found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(roleLabels).map(([roleKey, roleInfo]) => {
              const RoleIcon = roleInfo.icon;
              const count = roleStats[roleKey] || 0;
              
              return (
                <Card key={roleKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <RoleIcon className="h-5 w-5" />
                      {roleInfo.label}
                    </CardTitle>
                    <CardDescription>{count} member{count !== 1 ? 's' : ''}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Permissions:</p>
                      <ul className="text-muted-foreground space-y-1">
                        {roleKey === 'super_admin' && (
                          <>
                            <li>• Full system access</li>
                            <li>• Manage all users and settings</li>
                            <li>• System administration</li>
                          </>
                        )}
                        {roleKey === 'admin' && (
                          <>
                            <li>• Organization management</li>
                            <li>• User management</li>
                            <li>• Configuration settings</li>
                          </>
                        )}
                        {roleKey === 'compliance_officer' && (
                          <>
                            <li>• Compliance management</li>
                            <li>• Framework configuration</li>
                            <li>• Audit oversight</li>
                          </>
                        )}
                        {roleKey === 'risk_manager' && (
                          <>
                            <li>• Risk assessment</li>
                            <li>• Risk reporting</li>
                            <li>• Mitigation planning</li>
                          </>
                        )}
                        {roleKey === 'auditor' && (
                          <>
                            <li>• Audit execution</li>
                            <li>• Evidence collection</li>
                            <li>• Audit reporting</li>
                          </>
                        )}
                        {roleKey === 'user' && (
                          <>
                            <li>• View assigned items</li>
                            <li>• Submit reports</li>
                            <li>• Basic collaboration</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Team member activity and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Activity logging will be displayed here once implemented.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};