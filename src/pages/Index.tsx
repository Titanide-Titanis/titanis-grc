import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GRCPlatform } from "@/components/GRCPlatform";
import { TrialModeIndicator } from "@/components/trial/TrialModeIndicator";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading, isTrialMode, isDemoMode, enableTrialMode, enableDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for trial/demo mode in localStorage
    const demoMode = localStorage.getItem('titanis_demo_mode');
    const trialStart = localStorage.getItem('titanis_trial_start');
    
    if (demoMode === 'true') {
      enableDemoMode();
    } else if (trialStart) {
      enableTrialMode();
    } else if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate, enableTrialMode, enableDemoMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading TITANIS™...</p>
        </div>
      </div>
    );
  }

  if (!user && !isTrialMode && !isDemoMode) {
    return null; // Will redirect to auth
  }

  return (
    <>
      <TrialModeIndicator />
      <GRCPlatform />
    </>
  );
};

export default Index;
