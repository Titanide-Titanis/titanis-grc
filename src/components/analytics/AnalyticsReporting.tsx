import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

export function AnalyticsReporting() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Comprehensive GRC analytics and executive reporting
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">92%</div>
              <div className="ml-auto">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Overall GRC Score</p>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+3% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">23</div>
              <div className="ml-auto">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Active Risk Issues</p>
            <div className="flex items-center space-x-1 text-xs text-warning">
              <TrendingDown className="h-3 w-3" />
              <span>-2 from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="ml-auto">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Compliance Rate</p>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+1% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold">15</div>
              <div className="ml-auto">
                <Clock className="h-4 w-4 text-danger" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Overdue Actions</p>
            <div className="flex items-center space-x-1 text-xs text-danger">
              <TrendingUp className="h-3 w-3" />
              <span>+3 from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="executive" className="space-y-6">
        <TabsList>
          <TabsTrigger value="executive">Executive Dashboard</TabsTrigger>
          <TabsTrigger value="risk">Risk Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Metrics</TabsTrigger>
          <TabsTrigger value="operational">Operational Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  GRC Maturity Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: "Risk Management", score: 92, target: 95, trend: "up" },
                    { area: "Compliance Monitoring", score: 88, target: 90, trend: "up" },
                    { area: "Policy Management", score: 85, target: 88, trend: "stable" },
                    { area: "Incident Response", score: 78, target: 85, trend: "down" },
                    { area: "Audit Readiness", score: 94, target: 95, trend: "up" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.area}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.score}%</span>
                          <div className={`w-3 h-3 rounded-full ${
                            item.trend === 'up' ? 'bg-success' : 
                            item.trend === 'down' ? 'bg-danger' : 'bg-warning'
                          }`}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={item.score} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current: {item.score}%</span>
                          <span>Target: {item.target}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { framework: "GDPR", jurisdiction: "EU", compliance: 95, status: "Compliant", lastAudit: "Jan 2024" },
                    { framework: "HIPAA", jurisdiction: "US", compliance: 88, status: "Minor Issues", lastAudit: "Jan 2024" },
                    { framework: "ISO 27001", jurisdiction: "Global", compliance: 92, status: "Certified", lastAudit: "Dec 2023" },
                    { framework: "SOC 2", jurisdiction: "US", compliance: 85, status: "In Progress", lastAudit: "Nov 2023" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.framework}</span>
                          <Badge variant="outline" className="text-xs">{item.jurisdiction}</Badge>
                        </div>
                        <Badge variant={
                          item.status === 'Compliant' || item.status === 'Certified' ? 'default' : 'secondary'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Progress value={item.compliance} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.compliance}% compliant</span>
                          <span>Last audit: {item.lastAudit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Risk Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Risk Issues</span>
                      <span className="font-bold text-danger">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Mitigation Rate</span>
                      <span className="font-bold text-success">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Risk Score</span>
                      <span className="font-bold">7.2/10</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Compliance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Frameworks</span>
                      <span className="font-bold">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Control Effectiveness</span>
                      <span className="font-bold text-success">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overdue Reviews</span>
                      <span className="font-bold text-warning">12</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Operational Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Policies</span>
                      <span className="font-bold">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Attestation Rate</span>
                      <span className="font-bold text-success">91%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Incident Response Time</span>
                      <span className="font-bold">2.4h</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analytics Deep Dive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Risk Distribution by Category</h3>
                    <div className="space-y-3">
                      {[
                        { category: "Cyber Security", count: 15, percentage: 35, trend: "+2" },
                        { category: "Operational", count: 12, percentage: 28, trend: "-1" },
                        { category: "Compliance", count: 8, percentage: 19, trend: "0" },
                        { category: "Financial", count: 5, percentage: 12, trend: "+1" },
                        { category: "Strategic", count: 3, percentage: 7, trend: "0" }
                      ].map(item => (
                        <div key={item.category} className="flex items-center justify-between">
                          <span className="text-sm">{item.category}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{width: `${item.percentage}%`}}></div>
                            </div>
                            <span className="text-sm font-medium w-6">{item.count}</span>
                            <span className={`text-xs w-8 ${
                              item.trend.startsWith('+') ? 'text-danger' : 
                              item.trend.startsWith('-') ? 'text-success' : 'text-muted-foreground'
                            }`}>
                              {item.trend !== "0" ? item.trend : "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Risk Score Trends</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">This Month</span>
                          <span className="text-lg font-bold">7.2</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Average risk score</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Last Month</span>
                          <span className="text-lg font-bold">7.5</span>
                        </div>
                        <div className="text-sm text-success">-0.3 improvement</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Target Score</span>
                          <span className="text-lg font-bold">6.0</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Year-end goal</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Risk Mitigation Effectiveness</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-success">89%</div>
                        <p className="text-xs text-muted-foreground">Mitigation Success Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">34</div>
                        <p className="text-xs text-muted-foreground">Risks Mitigated (YTD)</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-warning">15</div>
                        <p className="text-xs text-muted-foreground">Overdue Mitigations</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Framework Compliance Scores</h3>
                    <div className="space-y-4">
                      {[
                        { framework: "GDPR", score: 95, controls: 42, gaps: 2 },
                        { framework: "HIPAA", score: 88, controls: 38, gaps: 5 },
                        { framework: "ISO 27001", score: 92, controls: 114, gaps: 9 },
                        { framework: "SOC 2", score: 85, controls: 67, gaps: 10 }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.framework}</span>
                            <span className="text-sm">{item.score}%</span>
                          </div>
                          <Progress value={item.score} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.controls} controls</span>
                            <span>{item.gaps} gaps identified</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Control Testing Results</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Effective Controls</span>
                          <Badge className="bg-success-light text-success">194</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Operating as designed</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Deficient Controls</span>
                          <Badge className="bg-warning-light text-warning">26</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Require remediation</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Not Tested</span>
                          <Badge variant="outline">41</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Pending assessment</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Compliance Timeline</h3>
                  <div className="space-y-3">
                    {[
                      { milestone: "Q1 GDPR Assessment", date: "Mar 31, 2024", status: "upcoming", progress: 75 },
                      { milestone: "SOC 2 Type II Audit", date: "Apr 15, 2024", status: "in-progress", progress: 60 },
                      { milestone: "ISO 27001 Surveillance", date: "Jul 20, 2024", status: "planned", progress: 0 },
                      { milestone: "Annual Privacy Review", date: "Dec 31, 2024", status: "planned", progress: 0 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'in-progress' ? 'bg-primary' :
                          item.status === 'upcoming' ? 'bg-warning' : 'bg-muted'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{item.milestone}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="w-32">
                          <Progress value={item.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{item.progress}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Operational Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Team Performance</h3>
                    <div className="space-y-3">
                      {[
                        { team: "Risk Management", utilization: 92, tasks: 34, overdue: 2 },
                        { team: "Compliance", utilization: 88, tasks: 28, overdue: 5 },
                        { team: "Audit", utilization: 95, tasks: 22, overdue: 1 },
                        { team: "Policy Team", utilization: 85, tasks: 18, overdue: 3 }
                      ].map((team, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{team.team}</span>
                            <span className="text-sm">{team.utilization}%</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {team.tasks} active tasks • {team.overdue} overdue
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Policy Metrics</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Active Policies</span>
                          <span className="text-lg font-bold">28</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Across all departments</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Attestation Rate</span>
                          <span className="text-lg font-bold text-success">91%</span>
                        </div>
                        <div className="text-sm text-muted-foreground">342 of 375 completed</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Overdue Reviews</span>
                          <span className="text-lg font-bold text-warning">5</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Require immediate attention</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Incident Metrics</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Incidents (YTD)</span>
                          <span className="text-lg font-bold">23</span>
                        </div>
                        <div className="text-sm text-muted-foreground">4 currently active</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Avg Response Time</span>
                          <span className="text-lg font-bold">2.4h</span>
                        </div>
                        <div className="text-sm text-success">Within SLA targets</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Resolution Rate</span>
                          <span className="text-lg font-bold text-success">96%</span>
                        </div>
                        <div className="text-sm text-muted-foreground">22 of 23 resolved</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Monthly Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Risk Management Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>New Risks Identified</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risks Mitigated</span>
                          <span className="font-medium text-success">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risk Assessments</span>
                          <span className="font-medium">15</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Compliance Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Controls Tested</span>
                          <span className="font-medium">45</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gaps Remediated</span>
                          <span className="font-medium text-success">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Audits Completed</span>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}