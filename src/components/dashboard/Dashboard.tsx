import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, ArrowRight } from "lucide-react";
import { MetricsGrid } from "./MetricsGrid";
import { RiskHeatmap } from "./RiskHeatmap";
import { ComplianceOverview } from "./ComplianceOverview";
import { RecentActivity } from "./RecentActivity";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";

export function Dashboard() {
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TITANIS™ Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Welcome to TITANIS™
          </h1>
          <p className="text-muted-foreground">
            Titanide's Proprietary Enterprise Governance, Risk & Compliance Platform
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setShowSubscriptionManager(true)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
          <Button size="lg" className="bg-gradient-primary text-white shadow-elegant">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics with Animations */}
      <div className="animate-scale-in">
        <MetricsGrid />
      </div>

      {/* Enhanced Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all">
            Overview
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-warning data-[state=active]:to-warning/80 data-[state=active]:text-white transition-all">
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-success/80 data-[state=active]:text-white transition-all">
            Compliance Status
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-white transition-all">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-in-left">
              <RiskHeatmap />
            </div>
            <div className="animate-slide-in-right">
              <ComplianceOverview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6 animate-fade-in">
          <div className="animate-scale-in">
            <RiskHeatmap />
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 animate-fade-in">
          <div className="animate-scale-in">
            <ComplianceOverview />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 animate-fade-in">
          <div className="animate-scale-in">
            <RecentActivity />
          </div>
        </TabsContent>
      </Tabs>

      <SubscriptionManager
        open={showSubscriptionManager}
        onOpenChange={setShowSubscriptionManager}
      />
    </div>
  );
}