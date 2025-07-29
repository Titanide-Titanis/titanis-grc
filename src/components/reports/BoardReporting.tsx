import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  FileText,
  Presentation,
  Users,
  Target
} from "lucide-react";

interface BoardMetric {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}

const executiveMetrics: BoardMetric[] = [
  {
    title: "Overall GRC Maturity",
    value: "92%",
    trend: "up",
    trendValue: "+5% QoQ",
    status: "success"
  },
  {
    title: "Regulatory Compliance",
    value: "94%",
    trend: "up", 
    trendValue: "+2% QoQ",
    status: "success"
  },
  {
    title: "Critical Risk Exposure",
    value: "8",
    trend: "down",
    trendValue: "-3 QoQ",
    status: "warning"
  },
  {
    title: "Incident Response Time",
    value: "2.4h",
    trend: "down",
    trendValue: "-0.6h QoQ",
    status: "success"
  }
];

const riskMetrics = [
  { category: "Cyber Security", riskCount: 15, trend: "+2", severity: "high" },
  { category: "Operational", riskCount: 12, trend: "-1", severity: "medium" },
  { category: "Compliance", riskCount: 8, trend: "0", severity: "medium" },
  { category: "Financial", riskCount: 5, trend: "+1", severity: "low" },
  { category: "Strategic", riskCount: 3, trend: "0", severity: "low" }
];

const complianceFrameworks = [
  { name: "GDPR", score: 95, status: "Compliant", lastAudit: "Q4 2023", controls: 42 },
  { name: "HIPAA", score: 88, status: "Minor Issues", lastAudit: "Q4 2023", controls: 38 },
  { name: "ISO 27001", score: 92, status: "Certified", lastAudit: "Q3 2023", controls: 114 },
  { name: "SOC 2", score: 85, status: "In Progress", lastAudit: "Q3 2023", controls: 67 }
];

export function BoardReporting() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4 2023");

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-success" />;
    return <div className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board-Ready Reporting</h1>
          <p className="text-muted-foreground">
            Executive dashboards and board presentation materials
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedPeriod}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Board Package
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {executiveMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.title}</p>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-2">
                {getTrendIcon(metric.trend)}
                <span>{metric.trendValue}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="executive" className="space-y-6">
        <TabsList>
          <TabsTrigger value="executive">Executive Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Portfolio</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GRC Maturity Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  GRC Maturity Assessment
                </CardTitle>
                <CardDescription>Current state vs. target maturity levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: "Risk Management", current: 92, target: 95, improvement: "+8%" },
                    { area: "Compliance Monitoring", current: 88, target: 90, improvement: "+12%" },
                    { area: "Policy Management", current: 85, target: 88, improvement: "+5%" },
                    { area: "Incident Response", current: 78, target: 85, improvement: "+15%" },
                    { area: "Audit Readiness", current: 94, target: 95, improvement: "+3%" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.area}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.current}%</span>
                          <Badge variant="outline" className="text-xs text-success">
                            {item.improvement}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.current} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {item.current}%</span>
                        <span>Target: {item.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Quarter Achievements</CardTitle>
                <CardDescription>Major accomplishments and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">ISO 27001 Certification Renewed</p>
                      <p className="text-sm text-muted-foreground">
                        Successfully renewed certification with zero non-conformities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">GDPR Compliance Score: 95%</p>
                      <p className="text-sm text-muted-foreground">
                        Achieved target compliance score ahead of schedule
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Zero Critical Security Incidents</p>
                      <p className="text-sm text-muted-foreground">
                        Maintained excellent security posture throughout quarter
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Policy Training Completion: 98%</p>
                      <p className="text-sm text-muted-foreground">
                        Exceeded organizational training targets
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Priorities */}
          <Card>
            <CardHeader>
              <CardTitle>Strategic Priorities for Next Quarter</CardTitle>
              <CardDescription>Key focus areas and planned initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Risk Mitigation
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Reduce critical risks from 8 to 5</li>
                    <li>• Implement enhanced cyber security controls</li>
                    <li>• Complete vendor risk assessments</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Compliance Enhancement
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Achieve 90% HIPAA compliance</li>
                    <li>• Complete SOC 2 Type II audit</li>
                    <li>• Update privacy policies for new regulations</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Operational Excellence
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Reduce incident response time to &lt;2h</li>
                    <li>• Automate 80% of compliance monitoring</li>
                    <li>• Enhance GRC dashboard capabilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Portfolio Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Portfolio Overview</CardTitle>
                <CardDescription>Current risk landscape by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-4 w-4 ${
                          risk.severity === 'high' ? 'text-destructive' :
                          risk.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                        <div>
                          <span className="font-medium">{risk.category}</span>
                          <div className="text-sm text-muted-foreground">
                            {risk.riskCount} active risks
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={risk.severity === 'high' ? 'destructive' : 'outline'}>
                          {risk.severity}
                        </Badge>
                        <div className={`text-sm ${
                          risk.trend.startsWith('+') ? 'text-destructive' :
                          risk.trend.startsWith('-') ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {risk.trend !== "0" ? risk.trend : "—"} QoQ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Mitigation Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation Progress</CardTitle>
                <CardDescription>Quarterly mitigation effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">89%</div>
                    <p className="text-sm text-muted-foreground">Mitigation Success Rate</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">34</div>
                      <p className="text-xs text-muted-foreground">Risks Mitigated</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-warning">15</div>
                      <p className="text-xs text-muted-foreground">Overdue Actions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Critical Risks Addressed</span>
                      <span>8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Medium Risks Addressed</span>
                      <span>22/25</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Status</CardTitle>
              <CardDescription>Framework compliance scores and audit results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceFrameworks.map((framework, index) => (
                  <Card key={index} className="border">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{framework.name}</h3>
                          <Badge variant={
                            framework.status === 'Compliant' || framework.status === 'Certified' 
                              ? 'default' : 'secondary'
                          }>
                            {framework.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Score</span>
                            <span className="font-medium">{framework.score}%</span>
                          </div>
                          <Progress value={framework.score} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Controls:</span>
                            <div className="font-medium">{framework.controls}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Audit:</span>
                            <div className="font-medium">{framework.lastAudit}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational KPIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Policy Compliance Rate</span>
                  <span className="font-bold text-success">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Training Completion</span>
                  <span className="font-bold text-success">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Audit Readiness</span>
                  <span className="font-bold text-success">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Incident Response Time</span>
                  <span className="font-bold">2.4h</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost Avoidance</span>
                  <span className="font-bold text-success">$2.1M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compliance Costs</span>
                  <span className="font-bold">$850K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI on GRC Investment</span>
                  <span className="font-bold text-success">247%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Penalty Avoidance</span>
                  <span className="font-bold text-success">$0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Team Members</span>
                  <span className="font-bold">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Certification Rate</span>
                  <span className="font-bold text-success">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cross-training Level</span>
                  <span className="font-bold">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Utilization</span>
                  <span className="font-bold">85%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}