import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Crown, Zap, Infinity, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: any;
  limits: any;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  is_popular?: boolean;
}

interface SubscriptionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionManager({ open, onOpenChange }: SubscriptionManagerProps) {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [currentTier, setCurrentTier] = useState<string>("Demo");
  const [loading, setLoading] = useState(false);
  const [fetchingTiers, setFetchingTiers] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSubscriptionTiers();
      fetchCurrentSubscription();
    }
  }, [open]);

  const fetchSubscriptionTiers = async () => {
    setFetchingTiers(true);
    try {
      const { data, error } = await (supabase as any).from("subscription_tiers").select("*").eq("is_active", true);
      if (error) throw error;
      
      if (data) {
        setTiers(data.map((tier: any) => ({
          ...tier,
          is_popular: tier.name === "Advanced"
        })));
      }
    } catch (error: any) {
      console.error("Error fetching tiers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive"
      });
    } finally {
      setFetchingTiers(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.user.id)
        .single();

      if (profile?.organization_id) {
        const { data: subscription } = await (supabase as any)
          .from("user_subscriptions")
          .select(`
            *,
            tier:subscription_tiers(name)
          `)
          .eq("organization_id", profile.organization_id)
          .eq("status", "active")
          .single();

        if (subscription?.tier?.name) {
          setCurrentTier(subscription.tier.name);
        }
      }
    } catch (error) {
      console.error("Error fetching current subscription:", error);
    }
  };

  const handleUpgrade = async (tierId: string, tierName: string) => {
    if (tierName === "Demo") {
      toast({
        title: "Demo Mode",
        description: "You're in demo mode! Try our 14-day free trial or explore paid options for more features.",
      });
      return;
    }

    if (tierName === "Trial") {
      toast({
        title: "Free Trial",
        description: "Starting your 14-day free trial with full access to evaluate the platform!",
      });
      return;
    }

    if (tierName === "Enterprise") {
      toast({
        title: "Enterprise",
        description: "Please contact sales@titanideconsulting.com for Enterprise pricing and custom deployment.",
      });
      // Open email client
      window.open("mailto:sales@titanideconsulting.com?subject=Enterprise Inquiry&body=Hi, I'm interested in learning more about the Enterprise plan for TITANIS™ platform.");
      return;
    }

    // For paid tiers (Starter, Advanced), create lead in Zoho CRM
    if (tierName === "Starter" || tierName === "Advanced") {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        // Create lead in zoho_leads table
        const { error: leadError } = await supabase
          .from('zoho_leads')
          .insert({
            email: user.user?.email || '',
            selected_tier: tierName,
            billing_interval: billingInterval,
            metadata: { 
              tier_id: tierId,
              tier_price: billingInterval === 'yearly' ? tiers.find(t => t.id === tierId)?.price_yearly : tiers.find(t => t.id === tierId)?.price_monthly,
              source: 'pricing_page' 
            }
          });

        if (leadError) {
          console.error('Error creating lead:', leadError);
          toast({
            title: "Error",
            description: "Failed to process your request. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Request Received",
          description: `Thank you for your interest in ${tierName}! Our team will contact you within 24 hours to discuss pricing and onboarding.`,
        });
      } catch (error) {
        console.error('Error handling paid tier selection:', error);
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier_id: tierId,
          billing_interval: billingInterval,
          success_url: `${window.location.origin}/subscription-success`,
          cancel_url: `${window.location.origin}/subscription-cancel`
        }
      });

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case "Demo": return <Star className="h-5 w-5" />;
      case "Trial": return <Zap className="h-5 w-5" />;
      case "Starter": return <Check className="h-5 w-5" />;
      case "Advanced": return <Crown className="h-5 w-5" />;
      case "Enterprise": return <Infinity className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const formatPrice = (cents: number, tierName?: string) => {
    if (tierName === "Enterprise") return "Contact Sales";
    if (cents === 0) return "Free";
    return `$${(cents / 100).toLocaleString()}`;
  };

  const getFeatureList = (features: any, limits: any) => {
    const featureList = [];
    
    // Demo features
    if (features.core_modules) featureList.push("Core GRC modules");
    if (features.demo_mode) featureList.push("Demo mode access");
    if (features.limited_users) featureList.push("Limited user access");
    
    // Trial features
    if (features.trial_mode) featureList.push("14-day trial access");
    if (features.full_access) featureList.push("Full platform access");
    
    // Starter features
    if (features.core_grc_modules) featureList.push("Core GRC modules");
    if (features.compliance_management) featureList.push("Compliance management");
    if (features.policy_management) featureList.push("Policy management");
    if (features.audit_management) featureList.push("Audit management");
    if (features.email_support) featureList.push("Standard email support");
    if (features.multi_framework) featureList.push("Multi-framework compliance");
    
    // Advanced features
    if (features.all_starter_features) featureList.push("All Starter features");
    if (features.predictive_analytics) featureList.push("Predictive analytics");
    if (features.ai_role_management) featureList.push("AI role management");
    if (features.executive_dashboards) featureList.push("Executive dashboards");
    if (features.phone_email_support) featureList.push("Enhanced phone/email support");
    if (features.vendor_management) featureList.push("Vendor management module");
    
    // Enterprise features
    if (features.all_advanced_features) featureList.push("All Advanced features");
    if (features.unlimited_admin_users) featureList.push("Unlimited admin users");
    if (features.all_frameworks) featureList.push("All frameworks included");
    if (features.on_premises) featureList.push("On-premises deployment");
    if (features.dedicated_account_manager) featureList.push("Dedicated account manager");
    if (features.custom_integrations) featureList.push("Custom integrations");
    if (features.vip_onboarding) featureList.push("VIP onboarding");

    // Add limits
    if (limits.admin_users && limits.admin_users !== "unlimited") {
      featureList.push(`Up to ${limits.admin_users} admin users`);
    } else if (limits.admin_users === "unlimited") {
      featureList.push("Unlimited admin users");
    }
    
    if (limits.read_only_users && limits.read_only_users !== "unlimited") {
      featureList.push(`Up to ${limits.read_only_users} read-only users`);
    } else if (limits.read_only_users === "unlimited") {
      featureList.push("Unlimited read-only users");
    }
    
    if (limits.frameworks && limits.frameworks !== "unlimited") {
      featureList.push(`${limits.frameworks} framework${limits.frameworks > 1 ? 's' : ''}`);
    } else if (limits.frameworks === "unlimited") {
      featureList.push("Unlimited frameworks");
    }

    if (limits.trial_days) featureList.push(`${limits.trial_days}-day trial`);
    if (limits.support) featureList.push(`${limits.support} support`);

    return featureList.slice(0, 8); // Show max 8 features
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Choose Your TITANIS™ Plan
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Unlock the full power of enterprise GRC management
          </p>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-muted p-1 rounded-lg flex">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingInterval === "monthly"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-md transition-colors relative ${
                billingInterval === "yearly"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
              <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                Save 10%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fetchingTiers ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-24 mx-auto"></div>
                  <div className="h-8 bg-muted rounded w-16 mx-auto"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            tiers.map((tier) => {
            const isCurrentTier = tier.name === currentTier;
            const price = billingInterval === "monthly" ? tier.price_monthly : tier.price_yearly;
            const features = getFeatureList(tier.features || {}, tier.limits || {});

            return (
              <Card
                key={tier.id}
                className={`relative transition-all duration-200 ${
                  tier.is_popular
                    ? "border-primary shadow-lg scale-105"
                    : "hover:shadow-md"
                } ${isCurrentTier ? "bg-success-light border-success" : ""}`}
              >
                {tier.is_popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {isCurrentTier && (
                  <Badge className="absolute -top-2 right-2 bg-success">
                    Current Plan
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    {getTierIcon(tier.name)}
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    {formatPrice(price, tier.name)}
                    {tier.name !== "Demo" && tier.name !== "Trial" && tier.name !== "Enterprise" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingInterval === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-4"
                    variant={tier.is_popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(tier.id, tier.name)}
                    disabled={loading || isCurrentTier}
                  >
                    {isCurrentTier ? "Current Plan" : 
                     tier.name === "Demo" ? "Get Started" :
                     tier.name === "Trial" ? "Start Trial" :
                     tier.name === "Enterprise" ? "Contact Sales" : 
                     "Get Quote"}
                    {!isCurrentTier && tier.name !== "Demo" && tier.name !== "Enterprise" && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

        {/* Feature Comparison */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            All plans include 14-day free trial • Cancel anytime • 24/7 support
          </p>
          <p className="text-xs text-muted-foreground">
            Enterprise customers: Contact{" "}
            <a 
              href="mailto:sales@titanideconsulting.com?subject=Enterprise Inquiry&body=Hi, I'm interested in learning more about enterprise solutions for TITANIS™ platform."
              className="text-primary hover:underline"
            >
              sales@titanideconsulting.com
            </a>{" "}
            for volume discounts and custom deployment options
          </p>
          <p className="text-xs text-muted-foreground">
            Support:{" "}
            <a 
              href="mailto:support@titanideconsulting.com"
              className="text-primary hover:underline"
            >
              support@titanideconsulting.com
            </a>{" "}
            •{" "}
            <a 
              href="https://support.titanideholdings.com/portal/en/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Support Portal
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}