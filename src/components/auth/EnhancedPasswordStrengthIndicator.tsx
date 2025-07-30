import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface EnhancedPasswordStrengthIndicatorProps {
  password: string;
  onValidationChange?: (isValid: boolean, issues: string[]) => void;
  showLeakedCheck?: boolean;
}

export function EnhancedPasswordStrengthIndicator({
  password,
  onValidationChange,
  showLeakedCheck = true
}: EnhancedPasswordStrengthIndicatorProps) {
  const { validatePasswordStrength, checkLeakedPassword } = useEnhancedAuth();
  const [validation, setValidation] = useState<{
    valid: boolean;
    score: number;
    issues: string[];
    strength: 'very_weak' | 'weak' | 'medium' | 'strong';
  } | null>(null);
  const [isLeaked, setIsLeaked] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidation(null);
      setIsLeaked(null);
      onValidationChange?.(false, []);
      return;
    }

    const checkPassword = async () => {
      setIsChecking(true);
      
      try {
        // Check password strength
        const strengthResult = await validatePasswordStrength(password);
        setValidation(strengthResult);

        let allIssues = strengthResult?.issues || [];

        // Check for leaked password if enabled
        if (showLeakedCheck && password.length >= 8) {
          const leaked = await checkLeakedPassword(password);
          setIsLeaked(leaked);
          
          if (leaked) {
            allIssues = [...allIssues, 'Password found in known data breaches'];
          }
        }

        const isValid = strengthResult?.valid && !isLeaked;
        onValidationChange?.(isValid, allIssues);
      } catch (error) {
        console.error('Password validation error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkPassword, 300);
    return () => clearTimeout(timeoutId);
  }, [password, validatePasswordStrength, checkLeakedPassword, showLeakedCheck, onValidationChange, isLeaked]);

  if (!password) {
    return null;
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very_weak':
        return 'hsl(var(--destructive))';
      case 'weak':
        return 'hsl(var(--warning))';
      case 'medium':
        return 'hsl(var(--warning))';
      case 'strong':
        return 'hsl(var(--success))';
      default:
        return 'hsl(var(--muted))';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'very_weak':
        return 'Very Weak';
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      default:
        return 'Unknown';
    }
  };

  const getBadgeVariant = (strength: string) => {
    switch (strength) {
      case 'very_weak':
      case 'weak':
        return 'destructive' as const;
      case 'medium':
        return 'secondary' as const;
      case 'strong':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        {validation && (
          <Badge variant={getBadgeVariant(validation.strength)}>
            {getStrengthText(validation.strength)}
          </Badge>
        )}
      </div>

      {validation && (
        <div className="space-y-2">
          <Progress 
            value={validation.score} 
            className="h-2"
            style={{
              '--progress-background': getStrengthColor(validation.strength)
            } as React.CSSProperties}
          />
          
          <div className="text-xs text-muted-foreground">
            Score: {validation.score}/100
          </div>
        </div>
      )}

      {isChecking && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Checking password security...
        </div>
      )}

      {showLeakedCheck && isLeaked !== null && !isChecking && (
        <div className={`flex items-center gap-2 text-sm ${
          isLeaked ? 'text-destructive' : 'text-success'
        }`}>
          {isLeaked ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Password found in data breaches
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Password not found in known breaches
            </>
          )}
        </div>
      )}

      {validation && validation.issues.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-destructive">Issues to fix:</div>
          <ul className="space-y-1">
            {validation.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation && validation.valid && !isLeaked && (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          Password meets all security requirements
        </div>
      )}
    </div>
  );
}