import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Download, 
  Save, 
  BarChart3, 
  PieChart, 
  LineChart,
  Calendar,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  Settings
} from "lucide-react";

interface ReportWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'trend';
  title: string;
  dataSource: string;
  config: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'operational' | 'compliance' | 'risk';
  widgets: ReportWidget[];
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

const availableDataSources = [
  { id: 'risks', name: 'Risk Management', icon: AlertTriangle },
  { id: 'compliance', name: 'Compliance Tracking', icon: Shield },
  { id: 'audits', name: 'Audit Management', icon: FileText },
  { id: 'incidents', name: 'Incident Management', icon: AlertTriangle },
  { id: 'policies', name: 'Policy Management', icon: FileText },
  { id: 'vendors', name: 'Vendor Management', icon: Users }
];

const widgetTypes = [
  { id: 'chart', name: 'Chart Widget', icon: BarChart3, description: 'Bar, line, or pie charts' },
  { id: 'metric', name: 'Metric Widget', icon: BarChart3, description: 'KPI displays with trends' },
  { id: 'table', name: 'Table Widget', icon: FileText, description: 'Data tables and lists' },
  { id: 'trend', name: 'Trend Widget', icon: LineChart, description: 'Time-series analysis' }
];

const predefinedTemplates: ReportTemplate[] = [
  {
    id: 'executive-dashboard',
    name: 'Executive Dashboard',
    description: 'High-level KPIs and trends for C-suite',
    category: 'executive',
    widgets: [
      { id: '1', type: 'metric', title: 'Overall GRC Score', dataSource: 'compliance', config: {} },
      { id: '2', type: 'chart', title: 'Risk Trend Analysis', dataSource: 'risks', config: {} },
      { id: '3', type: 'table', title: 'Critical Issues', dataSource: 'incidents', config: {} }
    ]
  },
  {
    id: 'board-report',
    name: 'Board-Ready Report',
    description: 'Comprehensive quarterly board presentation',
    category: 'executive',
    widgets: [
      { id: '1', type: 'metric', title: 'Compliance Overview', dataSource: 'compliance', config: {} },
      { id: '2', type: 'chart', title: 'Risk Heatmap', dataSource: 'risks', config: {} },
      { id: '3', type: 'trend', title: 'Maturity Progress', dataSource: 'audits', config: {} }
    ]
  },
  {
    id: 'compliance-scorecard',
    name: 'Compliance Scorecard',
    description: 'Framework compliance status and gaps',
    category: 'compliance',
    widgets: [
      { id: '1', type: 'chart', title: 'Framework Scores', dataSource: 'compliance', config: {} },
      { id: '2', type: 'table', title: 'Control Gaps', dataSource: 'compliance', config: {} }
    ]
  },
  {
    id: 'risk-summary',
    name: 'Risk Management Summary',
    description: 'Risk portfolio and mitigation status',
    category: 'risk',
    widgets: [
      { id: '1', type: 'chart', title: 'Risk Distribution', dataSource: 'risks', config: {} },
      { id: '2', type: 'metric', title: 'Mitigation Progress', dataSource: 'risks', config: {} }
    ]
  }
];

export function ReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [widgets, setWidgets] = useState<ReportWidget[]>([]);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportName(template.name);
    setReportDescription(template.description);
    setWidgets(template.widgets);
  };

  const addWidget = (type: string) => {
    const newWidget: ReportWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `New ${type} Widget`,
      dataSource: 'risks',
      config: {}
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Builder Studio</h1>
          <p className="text-muted-foreground">
            Create custom reports and dashboards for board presentations
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Library */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Templates</CardTitle>
              <CardDescription>Start with predefined templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {predefinedTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3 mr-1" />
                      {template.widgets.length} widgets
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Widget Library */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Widgets</CardTitle>
              <CardDescription>Drag or click to add components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {widgetTypes.map(widget => (
                <Button
                  key={widget.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addWidget(widget.id)}
                >
                  <widget.icon className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm">{widget.name}</div>
                    <div className="text-xs text-muted-foreground">{widget.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Report Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportCategory">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportDescription">Description</Label>
                <Textarea
                  id="reportDescription"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the purpose and audience of this report"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoSchedule"
                  checked={autoSchedule}
                  onCheckedChange={setAutoSchedule}
                />
                <Label htmlFor="autoSchedule">Enable automated scheduling</Label>
              </div>

              {autoSchedule && (
                <div className="space-y-2">
                  <Label htmlFor="scheduleFrequency">Schedule Frequency</Label>
                  <Select value={scheduleFrequency} onValueChange={(value: any) => setScheduleFrequency(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Widget Canvas */}
          <Card>
            <CardHeader>
              <CardTitle>Report Layout</CardTitle>
              <CardDescription>Configure your widgets and data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {widgets.length === 0 ? (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Select a template or add widgets to start building your report
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {widgets.map((widget, index) => (
                      <Card key={widget.id} className="border-2 border-dashed">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{widget.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeWidget(widget.id)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Data Source:</span>
                              <Badge variant="outline">{widget.dataSource}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Widget Type:</span>
                              <Badge variant="secondary">{widget.type}</Badge>
                            </div>
                            {/* Widget Preview */}
                            <div className="h-20 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">Widget Preview</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}