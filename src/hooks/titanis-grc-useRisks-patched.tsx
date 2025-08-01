import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/**
 * Represents a risk record in the Supabase `risks` table. This
 * interface matches the database schema, including computed
 * columns such as `risk_score` and `risk_level`.
 */
export interface Risk {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  category_id: string;
  likelihood: number;
  impact: number;
  risk_score: number;
  risk_level: string;
  mitigation_plan: string | null;
  owner_id: string | null;
  created_by: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook for fetching and managing risks for the current user’s organization.
 * It retrieves all risks from the `risks` table the user has access to,
 * leveraging the database’s row-level security policies. Returns the
 * collection of risks, a loading state, and a function to refetch the
 * list. Any errors encountered will trigger a toast notification.
 */
export function useRisks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRisks = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRisks((data || []) as Risk[]);
    } catch (error: any) {
      console.error('Error fetching risks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch risks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRisks();
    }
  }, [user]);

  return { risks, isLoading, fetchRisks };
}