import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsGrid } from "./MetricsGrid";
import { RiskHeatmap } from "./RiskHeatmap";
import { ComplianceOverview } from "./ComplianceOverview";
import { RecentActivity } from "./RecentActivity";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* TITANIS™ Dashboard Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          TITANIS™ Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Titanide's Leading Enterprise Governance, Risk & Compliance Platform
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
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
    </div>
  );
}