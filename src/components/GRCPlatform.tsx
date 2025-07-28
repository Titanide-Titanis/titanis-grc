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

// Placeholder components for remaining modules
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">
        This module is coming soon as part of the comprehensive GRC platform.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
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
      case "knowledge":
        return <PlaceholderComponent title="Knowledge Base" />;
      case "team":
        return <PlaceholderComponent title="Team Management" />;
      case "settings":
        return <PlaceholderComponent title="Settings" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}