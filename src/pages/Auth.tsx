import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Shield, Building2, Users, FileCheck, BarChart3, AlertTriangle, CheckCircle, Eye, EyeOff, Loader2, Lock, Clock } from "lucide-react";
import { useAuthSecurity } from "@/hooks/useAuthSecurity";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { CaptchaVerification } from "@/components/auth/CaptchaVerification";
import { DemoModeSelector } from "@/components/demo/DemoModeSelector";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    recordFailedAttempt, 
    isAccountLocked, 
    shouldShowCaptcha, 
    clearFailedAttempts, 
    logAuthEvent,
  } = useAuthSecurity();

  // Form state
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Security state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordIsLeaked, setPasswordIsLeaked] = useState(false);
  
  // Demo/Trial state
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleDemoModeStart = (scenario: any) => {
    // Enable demo mode and navigate to platform
    localStorage.setItem('titanis_demo_mode', 'true');
    localStorage.setItem('titanis_demo_scenario', JSON.stringify(scenario));
    navigate("/");
  };

  const handleTrialStart = () => {
    // Enable trial mode and navigate to platform
    localStorage.setItem('titanis_trial_start', new Date().toISOString());
    navigate("/");
  };

  const handleDemoReset = () => {
    localStorage.removeItem('titanis_demo_mode');
    localStorage.removeItem('titanis_demo_scenario');
    setShowDemoSelector(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isAccountLocked(email)) {
      setError("Account temporarily locked due to too many failed attempts. Please try again later.");
      return;
    }

    // Check CAPTCHA if required
    if (shouldShowCaptcha(email) && !captchaVerified) {
      setError("Please complete the security verification.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await logAuthEvent('login_attempt', undefined, { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Record failed attempt
        await recordFailedAttempt(email);
        await logAuthEvent('failed_login', undefined, { email, error: error.message });
        
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before signing in.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        // Clear failed attempts on successful login
        clearFailedAttempts(email);
        await logAuthEvent('login', data.user.id, { email });
        
        toast({
          title: "Welcome to TITANIS™",
          description: "Successfully signed in to your GRC platform",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    if (!passwordIsValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    // Check for leaked password
    if (passwordIsLeaked) {
      setError("This password has been found in data breaches. Please choose a different password.");
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await logAuthEvent('signup_attempt', undefined, { email });

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }
        }
      });

      if (error) {
        await logAuthEvent('failed_signup', undefined, { email, error: error.message });
        
        if (error.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes("Password should be")) {
          setError("Password does not meet requirements. Please check the password requirements.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        await logAuthEvent('signup', data.user.id, { email });
        
        toast({
          title: "Welcome to TITANIS™!",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
        
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showDemoSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-accent/5 flex items-center justify-center p-4">
        <DemoModeSelector
          onSelectScenario={handleDemoModeStart}
          onStartTrial={handleTrialStart}
          onResetDemo={handleDemoReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Enhanced TITANIS™ Branding */}
        <div className="space-y-8 animate-slide-in-left">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <img 
              src="/lovable-uploads/42c8c79b-3596-42d4-999f-0c7a32d30cd4.png" 
              alt="Titanide Logo" 
              className="w-12 h-12" 
            />
              <div>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  TITANIS™
                </h1>
                <p className="text-sm text-muted-foreground -mt-1">Powered by Titanide</p>
              </div>
            </div>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
              The Next Generation in Enterprise Governance, Risk & Compliance
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto lg:mx-0 rounded-full"></div>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-xl group-hover:shadow-lg transition-all">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enterprise-Grade Security</h3>
                <p className="text-muted-foreground">
                  Protect your organization with advanced security measures—military-grade encryption, proactive threat monitoring, and robust audit trails.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="bg-gradient-to-br from-success/20 to-success/10 p-4 rounded-xl group-hover:shadow-lg transition-all">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Driven Access Control</h3>
                <p className="text-muted-foreground">
                  Experience intelligent role management, adaptive permissions, and seamless compliance automation—powered by next-generation AI.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="bg-gradient-to-br from-warning/20 to-warning/10 p-4 rounded-xl group-hover:shadow-lg transition-all">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Predictive Insights & Analytics</h3>
                <p className="text-muted-foreground">
                  Stay ahead with real-time risk monitoring, actionable machine learning insights, and executive-ready dashboards for smarter decision-making.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-4 rounded-xl group-hover:shadow-lg transition-all">
                <FileCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Unified Multi-Framework Compliance</h3>
                <p className="text-muted-foreground">
                  Effortlessly manage and automate compliance with global standards—GDPR, HIPAA, ISO 27001, NIST, EU AI Act, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Trusted by Industry Leaders</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Organizations across the healthcare spectrum, from FQHCs to Fortune 500 companies, rely on TITANIS™ for secure, intelligent, and transformative GRC operations.
            </p>
          </div>
        </div>

        {/* Right side - Enhanced Authentication Form */}
        <div className="w-full max-w-md mx-auto animate-slide-in-right">
          <Card className="shadow-2xl border-primary/10">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Access TITANIS™
              </CardTitle>
              <CardDescription>
                Sign in to your enterprise GRC platform or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-muted/50 to-muted/30 p-1">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-success/80 data-[state=active]:text-white transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mt-4 animate-bounce-in">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin" className="space-y-4 animate-fade-in">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Enterprise Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="user@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-primary/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* CAPTCHA for failed attempts */}
                    {shouldShowCaptcha(email) && (
                      <CaptchaVerification 
                        onVerify={setCaptchaVerified}
                        className="animate-scale-in"
                      />
                    )}

                    {/* Account locked warning */}
                    {isAccountLocked(email) && (
                      <Alert variant="destructive" className="animate-bounce-in">
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          Account temporarily locked. Please try again later.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all" 
                      disabled={loading || (shouldShowCaptcha(email) && !captchaVerified) || isAccountLocked(email)}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Shield className="mr-2 h-4 w-4" />
                      Secure Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 animate-fade-in">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-success/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-success/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Enterprise Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="user@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus:ring-2 focus:ring-success/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Secure Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-success/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator
                      password={password}
                      onValidationChange={(isValid, isLeaked) => {
                        setPasswordIsValid(isValid);
                        setPasswordIsLeaked(isLeaked);
                      }}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-success/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Password match indicator */}
                    {confirmPassword && (
                      <div className="flex items-center space-x-2">
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-success">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span className="text-sm text-warning">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 transition-all" 
                      disabled={loading || !passwordIsValid || passwordIsLeaked || password !== confirmPassword}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Shield className="mr-2 h-4 w-4" />
                      Create Secure Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              
              {/* Trial and Demo Options */}
              <div className="space-y-3 w-full">
                <p className="text-sm font-medium text-center">Explore TITANIS™ Risk-Free</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => setShowDemoSelector(true)}
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Interactive Demo
                  </Button>
                  <Button
                    onClick={handleTrialStart}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    size="sm"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Start 14-Day Trial
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
                <p className="text-xs text-muted-foreground">
                  This platform implements enterprise-grade security measures including leaked password protection.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}