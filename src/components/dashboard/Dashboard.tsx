import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsGrid } from "./MetricsGrid";
import { RiskHeatmap } from "./RiskHeatmap";
import { ComplianceOverview } from "./ComplianceOverview";
import { RecentActivity } from "./RecentActivity";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TITANIS™ Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your organization's governance, risk, and compliance posture
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsGrid />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskHeatmap />
            <ComplianceOverview />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <RiskHeatmap />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceOverview />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}