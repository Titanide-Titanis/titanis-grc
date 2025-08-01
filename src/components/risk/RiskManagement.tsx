import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewRiskDialog } from "@/components/dialogs/NewRiskDialog";
import { RiskWizard } from "@/components/risk/RiskWizard";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  User,
} from "lucide-react";
import { useRisks } from "@/hooks/useRisks";

// Reuse helper functions from the original file for colors
const getRiskColor = (score: number) => {
  if (score >= 8) return "text-danger";
  if (score >= 6) return "text-warning";
  return "text-success";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-danger-light text-danger";
    case "in_progress":
      return "bg-warning-light text-warning";
    case "completed":
    case "mitigated":
      return "bg-success-light text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
};

/**
 * This component replaces the original RiskManagement component and
 * dynamically loads risks from Supabase via the `useRisks` hook. It
 * provides search functionality and displays each risk in a card. If
 * there are no risks or data is loading, it shows appropriate messages.
 */
export function RiskManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRiskDialog, setShowNewRiskDialog] = useState(false);
  const [showRiskWizard, setShowRiskWizard] = useState(false);

  const { risks, isLoading } = useRisks();

  // Convert numeric likelihood/impact into descriptive labels
  const formatRiskLevelText = (value: number) => {
    switch (value) {
      case 1:
        return "Very Low";
      case 2:
        return "Low";
      case 3:
        return "Medium";
      case 4:
        return "High";
      case 5:
        return "Very High";
      default:
        return String(value);
    }
  };

  // Format risk UUID into a short ID for display
  const formatRiskId = (id: string) => {
    return `RISK-${id.substring(0, 4).toUpperCase()}`;
  };

  // Filter risks based on search term across title and description
  const filteredRisks = risks.filter((risk) => {
    const search = searchTerm.toLowerCase();
    return (
      risk.title.toLowerCase().includes(search) ||
      (risk.description ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
          <p className="text-muted-foreground">
            Identify, assess, and mitigate organizational risks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNewRiskDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Quick Add
          </Button>
          <Button onClick={() => setShowRiskWizard(true)}>
            <Plus className="h-4 w-4 mr-2" /> Risk Assessment Wizard
          </Button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>
      {/* Tabs for sections */}
      <Tabs defaultValue="register" className="space-y-6">
        <TabsList>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        {/* Risk Register Content */}
        <TabsContent value="register" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading risks...</p>
          ) : filteredRisks.length === 0 ? (
            <p className="text-center text-muted-foreground">No risks found.</p>
          ) : (
            filteredRisks.map((risk) => (
              <Card key={risk.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle
                        className={`h-5 w-5 ${getRiskColor(risk.risk_score)}`}
                      />
                      <div>
                        <CardTitle className="text-lg">{risk.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatRiskId(risk.id)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(risk.status)}>
                      {risk.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {risk.description || "No description provided."}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Risk Score</p>
                      <p
                        className={`text-lg font-bold ${getRiskColor(
                          risk.risk_score
                        )}`}
                      >
                        {risk.risk_score.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Likelihood</p>
                      <p className="text-sm">
                        {formatRiskLevelText(risk.likelihood)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Impact</p>
                      <p className="text-sm">
                        {formatRiskLevelText(risk.impact)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Owner</p>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <p className="text-sm">
                          {risk.owner_id
                            ? risk.owner_id.substring(0, 8)
                            : "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        {/* Other tabs keep existing components */}
        <TabsContent value="assessment">
          {/* Reuse RiskWizard for the assessment tab */}
          <RiskWizard open={showRiskWizard} onOpenChange={setShowRiskWizard} />
        </TabsContent>
        <TabsContent value="heatmap">
          {/* Placeholder for heatmap functionality */}
          <p>Heat map functionality coming soon.</p>
        </TabsContent>
        <TabsContent value="analytics">
          {/* Placeholder for analytics functionality */}
          <p>Risk analytics coming soon.</p>
        </TabsContent>
      </Tabs>
      {/* Dialog Components */}
      <NewRiskDialog
        open={showNewRiskDialog}
        onOpenChange={setShowNewRiskDialog}
        onRiskCreated={() => {
          // Optionally refetch risks or show a message
        }}
      />
      {/* RiskWizard is rendered in a tab above */}
    </div>
  );
}
