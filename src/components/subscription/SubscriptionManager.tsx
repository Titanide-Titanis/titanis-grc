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
  const [currentTier, setCurrentTier] = useState<string>("Free");
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSubscriptionTiers();
      fetchCurrentSubscription();
    }
  }, [open]);

  const fetchSubscriptionTiers = async () => {
    try {
      const { data } = await (supabase as any).from("subscription_tiers").select("*").eq("is_active", true);
      if (data) {
        setTiers(data.map((tier: any) => ({
          ...tier,
          is_popular: tier.name === "Professional"
        })));
      }
    } catch (error) {
      console.error("Error fetching tiers:", error);
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
    if (tierName === "Free") {
      toast({
        title: "Free Tier",
        description: "You're already on the free tier! Explore our paid options for more features.",
      });
      return;
    }

    if (tierName === "Enterprise Plus") {
      toast({
        title: "Enterprise Plus",
        description: "Please contact sales@titanideconsulting.com for a custom Enterprise Plus quote.",
      });
      // Open email client
      window.open("mailto:sales@titanideconsulting.com?subject=Enterprise Plus Inquiry&body=Hi, I'm interested in learning more about the Enterprise Plus plan for TITANIS™ platform.");
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
      case "Free": return <Star className="h-5 w-5" />;
      case "Starter": return <Zap className="h-5 w-5" />;
      case "Professional": return <Crown className="h-5 w-5" />;
      case "Enterprise": return <Infinity className="h-5 w-5" />;
      case "Enterprise Plus": return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const formatPrice = (cents: number, tierName?: string) => {
    if (tierName === "Enterprise Plus") return "Contact Sales";
    if (cents === 0) return "Free";
    return `$${(cents / 100).toLocaleString()}`;
  };

  const getFeatureList = (features: any, limits: any) => {
    const featureList = [];
    
    if (features.basic_assessment) featureList.push("Basic compliance assessment");
    if (features.full_assessment) featureList.push("Full compliance assessment");
    if (features.risk_calculator) featureList.push("Risk calculator");
    if (features.risk_management) featureList.push("Advanced risk management");
    if (features.policy_library) featureList.push("Policy template library");
    if (features.multiple_frameworks) featureList.push("Multiple frameworks support");
    if (features.advanced_analytics) featureList.push("Advanced analytics & reporting");
    if (features.custom_reports) featureList.push("Custom report builder");
    if (features.workflow_automation) featureList.push("Workflow automation");
    if (features.unlimited_frameworks) featureList.push("Unlimited frameworks");
    if (features.ai_analytics) featureList.push("AI-powered analytics");
    if (features.custom_integrations) featureList.push("Custom integrations");
    if (features.white_label) featureList.push("White-label reports");
    if (features.dedicated_csm) featureList.push("Dedicated customer success manager");
    if (features.everything) featureList.push("Everything included");
    if (features.custom_deployment) featureList.push("Custom deployment options");
    if (features["24_7_support"]) featureList.push("24/7 premium support");

    // Add limits
    if (limits.users && limits.users > 0) featureList.push(`Up to ${limits.users} users`);
    if (limits.users === -1) featureList.push("Unlimited users");
    if (limits.frameworks && limits.frameworks > 0) featureList.push(`${limits.frameworks} framework${limits.frameworks > 1 ? 's' : ''}`);
    if (limits.frameworks === -1) featureList.push("Unlimited frameworks");
    if (limits.storage_gb && limits.storage_gb > 0) featureList.push(`${limits.storage_gb}GB storage`);
    if (limits.storage_gb === -1) featureList.push("Unlimited storage");

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
          {tiers.map((tier) => {
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
                    {tier.name !== "Free" && tier.name !== "Enterprise Plus" && (
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
                     tier.name === "Free" ? "Get Started" :
                     tier.name === "Enterprise Plus" ? "Contact Sales" : 
                     "Upgrade Now"}
                    {!isCurrentTier && tier.name !== "Free" && tier.name !== "Enterprise Plus" && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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