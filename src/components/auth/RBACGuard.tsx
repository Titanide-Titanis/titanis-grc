import { useEffect, useState, ReactNode } from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface RBACGuardProps {
  requiredRole: UserRole;
  resourceType?: string;
  action?: string;
  children: ReactNode;
  fallback?: ReactNode;
  showError?: boolean;
}

export function RBACGuard({
  requiredRole,
  resourceType,
  action,
  children,
  fallback,
  showError = true
}: RBACGuardProps) {
  const { user, profile } = useAuth();
  const { checkRBACPermission } = useEnhancedAuth();
  const [permission, setPermission] = useState<{
    allowed: boolean;
    reason: string;
    user_role: string;
    loading: boolean;
  }>({ allowed: false, reason: 'checking', user_role: 'unknown', loading: true });

  useEffect(() => {
    const checkPermission = async () => {
      if (!user || !profile) {
        setPermission({
          allowed: false,
          reason: 'user_not_authenticated',
          user_role: 'unknown',
          loading: false
        });
        return;
      }

      try {
        const result = await checkRBACPermission(requiredRole, resourceType, action);
        
        if (result) {
          setPermission({
            allowed: result.allowed,
            reason: result.reason,
            user_role: result.user_role,
            loading: false
          });
        } else {
          setPermission({
            allowed: false,
            reason: 'permission_check_failed',
            user_role: profile.role || 'unknown',
            loading: false
          });
        }
      } catch (error) {
        console.error('RBAC permission check failed:', error);
        setPermission({
          allowed: false,
          reason: 'permission_check_error',
          user_role: profile.role || 'unknown',
          loading: false
        });
      }
    };

    checkPermission();
  }, [user, profile, requiredRole, resourceType, action, checkRBACPermission]);

  // Show loading state
  if (permission.loading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Checking permissions...
        </div>
      </div>
    );
  }

  // User has permission
  if (permission.allowed) {
    return <>{children}</>;
  }

  // User doesn't have permission - show fallback or error
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showError) {
    return null;
  }

  const getErrorMessage = (reason: string, userRole: string) => {
    switch (reason) {
      case 'user_not_authenticated':
        return 'You must be signed in to access this feature.';
      case 'organization_mismatch':
        return 'You do not have access to this organization\'s resources.';
      case 'insufficient_role':
        return `This feature requires ${requiredRole} permissions. Your current role: ${userRole}.`;
      case 'permission_check_failed':
        return 'Unable to verify permissions. Please try again.';
      case 'permission_check_error':
        return 'An error occurred while checking permissions.';
      default:
        return 'You do not have permission to access this feature.';
    }
  };

  const getIcon = (reason: string) => {
    switch (reason) {
      case 'user_not_authenticated':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant="destructive" className="m-4">
      {getIcon(permission.reason)}
      <AlertDescription>
        {getErrorMessage(permission.reason, permission.user_role)}
        {resourceType && action && (
          <div className="mt-1 text-xs text-muted-foreground">
            Resource: {resourceType}, Action: {action}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Higher-order component version
export function withRBAC<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole,
  resourceType?: string,
  action?: string
) {
  return function RBACProtectedComponent(props: P) {
    return (
      <RBACGuard
        requiredRole={requiredRole}
        resourceType={resourceType}
        action={action}
      >
        <Component {...props} />
      </RBACGuard>
    );
  };
}