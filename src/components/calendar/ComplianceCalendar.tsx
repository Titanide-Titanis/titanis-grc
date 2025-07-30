import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Plus, Filter, Bell, AlertTriangle } from "lucide-react";
import { TaskList } from "./TaskList";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { SurgeAlerts } from "./SurgeAlerts";
import { TaskMetrics } from "./TaskMetrics";
import { CalendarIntegrations } from "./CalendarIntegrations";
import { useComplianceTasks } from "@/hooks/useComplianceTasks";
import { cn } from "@/lib/utils";

export function ComplianceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeView, setActiveView] = useState<"calendar" | "list" | "metrics">("calendar");
  
  const { 
    tasks, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask,
    getTasksForDate,
    getUpcomingTasks,
    getOverdueTasks
  } = useComplianceTasks();

  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  const upcomingTasks = getUpcomingTasks(7); // Next 7 days
  const overdueTasks = getOverdueTasks();

  const modifiers = {
    hasTask: tasks
      .filter(task => task.due_date)
      .map(task => new Date(task.due_date!))
  };

  const modifiersStyles = {
    hasTask: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "50%"
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Compliance Calendar & Task Engine
          </h1>
          <p className="text-muted-foreground">
            AI-enhanced unified calendar for tracking compliance deadlines, audits, and recurring events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button 
            onClick={() => setShowCreateTask(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Surge Alerts */}
      <SurgeAlerts />

      {/* Task Metrics Overview */}
      <TaskMetrics 
        totalTasks={tasks.length}
        completedTasks={tasks.filter(t => t.status === 'completed').length}
        overdueTasks={overdueTasks.length}
        upcomingTasks={upcomingTasks.length}
      />

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <Filter className="h-4 w-4" />
            Task List
          </TabsTrigger>
          <TabsTrigger value="metrics" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Compliance Calendar
                </CardTitle>
                <CardDescription>
                  Track all compliance deadlines, audits, and recurring events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Tasks for Selected Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
                </CardTitle>
                <CardDescription>
                  {tasksForSelectedDate.length} task(s) scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasksForSelectedDate.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tasks scheduled for this date
                    </p>
                  ) : (
                    tasksForSelectedDate.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'overdue' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming & Overdue Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5" />
                  Upcoming Tasks
                  <Badge variant="secondary">{upcomingTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                  ))}
                  {upcomingTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming tasks
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Overdue Tasks
                  <Badge variant="destructive">{overdueTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 border border-destructive/20 rounded">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-destructive">
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                  ))}
                  {overdueTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No overdue tasks
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <TaskList 
            tasks={tasks}
            isLoading={isLoading}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskMetrics 
              totalTasks={tasks.length}
              completedTasks={tasks.filter(t => t.status === 'completed').length}
              overdueTasks={overdueTasks.length}
              upcomingTasks={upcomingTasks.length}
              detailed={true}
            />
            <CalendarIntegrations />
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        onCreateTask={createTask}
      />
    </div>
  );
}