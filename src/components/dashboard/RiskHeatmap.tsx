import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const riskData = [
  { category: "Data Security", likelihood: "High", impact: "Critical", score: 9.2, trend: "stable" },
  { category: "Regulatory Compliance", likelihood: "Medium", impact: "High", score: 7.5, trend: "improving" },
  { category: "Third-Party Risk", likelihood: "Medium", impact: "Medium", score: 6.8, trend: "worsening" },
  { category: "Business Continuity", likelihood: "Low", impact: "Critical", score: 6.2, trend: "stable" },
  { category: "Financial Risk", likelihood: "Low", impact: "High", score: 4.5, trend: "improving" },
  { category: "Operational Risk", likelihood: "Medium", impact: "Low", score: 3.8, trend: "stable" }
];

const getRiskColor = (score: number) => {
  if (score >= 8) return "bg-danger text-danger-foreground";
  if (score >= 6) return "bg-warning text-warning-foreground";
  if (score >= 4) return "bg-warning/60 text-warning-foreground";
  return "bg-success text-success-foreground";
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'improving': return 'text-success';
    case 'worsening': return 'text-danger';
    default: return 'text-muted-foreground';
  }
};

export function RiskHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Risk Heatmap
          <Badge variant="outline">6 Categories</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskData.map((risk) => (
            <div key={risk.category} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex-1">
                <div className="font-medium">{risk.category}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Likelihood: {risk.likelihood} • Impact: {risk.impact}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium">Risk Score</div>
                  <div className="text-lg font-bold">{risk.score}</div>
                </div>
                <Badge className={getRiskColor(risk.score)}>
                  {risk.score >= 8 ? 'Critical' : 
                   risk.score >= 6 ? 'High' : 
                   risk.score >= 4 ? 'Medium' : 'Low'}
                </Badge>
                <div className={`text-sm ${getTrendColor(risk.trend)}`}>
                  {risk.trend === 'improving' ? '↗' : 
                   risk.trend === 'worsening' ? '↘' : '→'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}