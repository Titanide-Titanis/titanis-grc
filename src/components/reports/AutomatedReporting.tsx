import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Download, 
  Mail, 
  Calendar, 
  FileText, 
  BarChart3,
  Users,
  Settings,
  Play,
  Pause,
  Edit
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  lastGenerated: string | null;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
  template: string;
  format: 'pdf' | 'excel' | 'powerpoint';
}

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Executive Dashboard',
    description: 'Weekly executive summary with key GRC metrics',
    frequency: 'weekly',
    recipients: ['ceo@company.com', 'cto@company.com'],
    lastGenerated: '2024-01-22T09:00:00Z',
    nextRun: '2024-01-29T09:00:00Z',
    status: 'active',
    template: 'executive-dashboard',
    format: 'pdf'
  },
  {
    id: '2',
    name: 'Board Report - Quarterly',
    description: 'Comprehensive quarterly board presentation',
    frequency: 'quarterly',
    recipients: ['board@company.com'],
    lastGenerated: '2024-01-01T08:00:00Z',
    nextRun: '2024-04-01T08:00:00Z',
    status: 'active',
    template: 'board-report',
    format: 'powerpoint'
  },
  {
    id: '3',
    name: 'Compliance Scorecard',
    description: 'Monthly compliance framework status',
    frequency: 'monthly',
    recipients: ['compliance@company.com', 'legal@company.com'],
    lastGenerated: '2024-01-01T10:00:00Z',
    nextRun: '2024-02-01T10:00:00Z',
    status: 'active',
    template: 'compliance-scorecard',
    format: 'excel'
  },
  {
    id: '4',
    name: 'Risk Management Summary',
    description: 'Monthly risk portfolio and mitigation updates',
    frequency: 'monthly',
    recipients: ['risk@company.com'],
    lastGenerated: null,
    nextRun: '2024-02-01T11:00:00Z',
    status: 'paused',
    template: 'risk-summary',
    format: 'pdf'
  }
];

export function AutomatedReporting() {
  const [reports, setReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleReportStatus = async (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: report.status === 'active' ? 'paused' : 'active' }
        : report
    ));
    
    toast({
      title: "Report Status Updated",
      description: "The scheduled report status has been changed.",
    });
  };

  const generateReportNow = async (reportId: string) => {
    setIsLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, lastGenerated: new Date().toISOString() }
          : report
      ));
      setIsLoading(false);
      toast({
        title: "Report Generated",
        description: "The report has been generated and sent to recipients.",
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'paused': return 'bg-warning';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextRunCountdown = (nextRun: string) => {
    const now = new Date();
    const next = new Date(nextRun);
    const diff = next.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automated Reporting</h1>
          <p className="text-muted-foreground">
            Manage scheduled reports and automated distribution
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Active Schedules</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Reports This Month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Recipients</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Manage your automated report generation and distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{report.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {report.frequency}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.format.toUpperCase()}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Last Generated:</span>
                          <br />
                          <span className="text-muted-foreground">{formatDate(report.lastGenerated)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Next Run:</span>
                          <br />
                          <span className="text-muted-foreground">
                            {formatDate(report.nextRun)} ({getNextRunCountdown(report.nextRun)})
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Recipients:</span>
                          <br />
                          <span className="text-muted-foreground">{report.recipients.length} recipients</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Recipients:</span>
                        {report.recipients.slice(0, 2).map(email => (
                          <Badge key={email} variant="secondary" className="text-xs">
                            {email.split('@')[0]}
                          </Badge>
                        ))}
                        {report.recipients.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{report.recipients.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        checked={report.status === 'active'}
                        onCheckedChange={() => toggleReportStatus(report.id)}
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateReportNow(report.id)}
                        disabled={isLoading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reports</CardTitle>
          <CardDescription>Next scheduled report generations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports
              .filter(r => r.status === 'active')
              .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())
              .slice(0, 5)
              .map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{report.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(report.nextRun)} • {report.recipients.length} recipients
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getNextRunCountdown(report.nextRun)}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}