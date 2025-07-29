import { useState } from "react";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { Dashboard } from "./dashboard/Dashboard";
import { RiskManagement } from "./risk/RiskManagement";
import { ComplianceTracking } from "./compliance/ComplianceTracking";
import { PolicyManagement } from "./policies/PolicyManagement";
import { AuditManagement } from "./audits/AuditManagement";
import { IncidentManagement } from "./incidents/IncidentManagement";
import { AnalyticsReporting } from "./analytics/AnalyticsReporting";
import { VendorManagement } from "./vendor/VendorManagement";
import { KnowledgeBase } from "./knowledge/KnowledgeBase";
import { TeamManagement } from "./team/TeamManagement";

// TITANIS™ Placeholder components for upcoming modules
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-muted-foreground">
        This advanced module is coming soon as part of TITANIS™ - Titanide's Leading Enterprise GRC Platform.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="h-32 bg-gradient-to-br from-muted/30 to-muted/70 rounded-lg animate-shimmer relative overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </div>
      ))}
    </div>
  </div>
);

export function GRCPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "risk":
        return <RiskManagement />;
      case "compliance":
        return <ComplianceTracking />;
      case "policies":
        return <PolicyManagement />;
      case "audits":
        return <AuditManagement />;
      case "incidents":
        return <IncidentManagement />;
      case "analytics":
        return <AnalyticsReporting />;
      case "vendors":
        return <VendorManagement />;
      case "knowledge":
        return <KnowledgeBase />;
      case "team":
        return <TeamManagement />;
      case "settings":
        return <PlaceholderComponent title="Settings" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/95">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 animate-fade-in">
            <div className="transition-all duration-300 ease-in-out">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}