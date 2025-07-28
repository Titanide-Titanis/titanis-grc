// TITANIS™ Password Strength Indicator Component
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  onValidationChange?: (isValid: boolean, isLeaked: boolean) => void;
  className?: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  onValidationChange, 
  className 
}: PasswordStrengthIndicatorProps) {
  const { validatePasswordStrength, checkLeakedPassword, settings } = useAuthSecurity();
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: [],
  });
  const [isLeaked, setIsLeaked] = useState(false);
  const [isCheckingLeak, setIsCheckingLeak] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidation({ isValid: false, errors: [] });
      setIsLeaked(false);
      onValidationChange?.(false, false);
      return;
    }

    // Validate password strength
    const strengthValidation = validatePasswordStrength(password);
    setValidation(strengthValidation);

    // Check for leaked passwords with debouncing
    if (settings?.enableLeakedPasswordCheck && password.length >= 8) {
      const timeoutId = setTimeout(async () => {
        setIsCheckingLeak(true);
        try {
          const leaked = await checkLeakedPassword(password);
          setIsLeaked(leaked);
          onValidationChange?.(strengthValidation.isValid, leaked);
        } catch (error) {
          console.error('Error checking password leak:', error);
          setIsLeaked(false);
        } finally {
          setIsCheckingLeak(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      onValidationChange?.(strengthValidation.isValid, false);
    }
  }, [password, settings, validatePasswordStrength, checkLeakedPassword, onValidationChange]);

  const getStrengthLevel = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) strength += 1;
    
    return Math.min(strength, 4);
  };

  const getStrengthColor = (level: number) => {
    switch (level) {
      case 0:
      case 1:
        return 'bg-danger';
      case 2:
        return 'bg-warning';
      case 3:
        return 'bg-success/70';
      case 4:
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  const getStrengthLabel = (level: number) => {
    switch (level) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  if (!password && !showDetails) return null;

  const strengthLevel = getStrengthLevel();

  return (
    <div className={cn("space-y-3 animate-fade-in", className)}>
      {/* Password Strength Bar */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Password Strength</span>
            <span className={cn(
              "text-sm font-medium",
              strengthLevel >= 3 ? "text-success" : strengthLevel === 2 ? "text-warning" : "text-danger"
            )}>
              {getStrengthLabel(strengthLevel)}
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all duration-300",
                  strengthLevel >= level ? getStrengthColor(strengthLevel) : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Leaked Password Warning */}
      {isLeaked && (
        <div className="flex items-center space-x-2 p-3 bg-danger-light text-danger border border-danger/20 rounded-lg animate-bounce-in">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            This password has been found in data breaches. Please choose a different password.
          </span>
        </div>
      )}

      {/* Checking Leak Status */}
      {isCheckingLeak && (
        <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
          <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
          <span className="text-xs text-muted-foreground">Checking password security...</span>
        </div>
      )}

      {/* Requirements Toggle */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        <span>{showDetails ? 'Hide' : 'Show'} requirements</span>
      </button>

      {/* Password Requirements */}
      {showDetails && (
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg animate-fade-in">
          <h4 className="text-sm font-medium text-foreground">Password Requirements</h4>
          <div className="space-y-1">
            {settings && (
              <>
                <RequirementItem
                  met={password.length >= settings.passwordMinLength}
                  text={`At least ${settings.passwordMinLength} characters`}
                />
                {settings.requireUppercase && (
                  <RequirementItem
                    met={/[A-Z]/.test(password)}
                    text="One uppercase letter"
                  />
                )}
                {settings.requireLowercase && (
                  <RequirementItem
                    met={/[a-z]/.test(password)}
                    text="One lowercase letter"
                  />
                )}
                {settings.requireNumbers && (
                  <RequirementItem
                    met={/\d/.test(password)}
                    text="One number"
                  />
                )}
                {settings.requireSymbols && (
                  <RequirementItem
                    met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)}
                    text="One symbol (!@#$%^&*)"
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-danger">
              <AlertCircle className="h-3 w-3" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircle className="h-3 w-3 text-success" />
      ) : (
        <div className="h-3 w-3 border border-muted-foreground rounded-full" />
      )}
      <span className={cn(
        "text-xs",
        met ? "text-success" : "text-muted-foreground"
      )}>
        {text}
      </span>
    </div>
  );
}