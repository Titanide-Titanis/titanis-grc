import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ComplianceTask {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  category: 'audit_due' | 'policy_review' | 'incident_followup' | 'training_deadline' | 'compliance_deadline' | 'vendor_assessment' | 'risk_review' | 'regulatory_filing' | 'credentialing' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  due_date?: string;
  start_date?: string;
  completed_at?: string;
  recurrence_pattern: 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  recurrence_interval: number;
  recurrence_end_date?: string;
  parent_task_id?: string;
  assigned_to?: string;
  created_by?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage: number;
  linked_entity_type?: string;
  linked_entity_id?: string;
  attachments?: any;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export function useComplianceTasks() {
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('compliance_tasks')
        .select('*')
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks((data || []) as ComplianceTask[]);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Partial<ComplianceTask>) => {
    if (!user) return false;

    try {
      // Get user's organization_id first
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      const insertData = {
        title: taskData.title || "",
        organization_id: profile?.organization_id,
        created_by: user.id,
        ...taskData,
      };

      const { data, error } = await supabase
        .from('compliance_tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data as ComplianceTask]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<ComplianceTask>) => {
    try {
      const { data, error } = await supabase
        .from('compliance_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...data } as ComplianceTask : task
      ));
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      return false;
    }
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.due_date && task.due_date.startsWith(dateString)
    );
  };

  const getUpcomingTasks = (days: number) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate > now && taskDate <= futureDate && task.status !== 'completed';
    });
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate < now && task.status !== 'completed';
    });
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    getTasksForDate,
    getUpcomingTasks,
    getOverdueTasks,
    refetch: fetchTasks
  };
}