import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ThreatAlert } from '@/components/threats/ThreatAlertSidebar';

export function useThreatAlerts(limit: number = 5) {
  return useQuery({
    queryKey: ['threat-alerts', limit],
    queryFn: async () => {
      // Query security_alerts table
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Map to ThreatAlert format
      const alerts: ThreatAlert[] = (data || []).map((alert: any) => ({
        id: alert.id,
        title: alert.title,
        severity: mapSeverity(alert.severity),
        affectedHardware: parseAffectedHardware(alert.affected_systems),
        description: alert.description,
        publishedAt: alert.published_at || alert.created_at,
        nexusScore: alert.security_score ? Math.ceil(alert.security_score / 20) : undefined,
        cvssScore: alert.security_score,
        guideUrl: alert.content_id ? `/article/${alert.content_id}` : undefined,
        isActive: alert.is_active ?? true,
      }));

      return alerts;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

function mapSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' | 'info' {
  const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low' | 'info'> = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
    info: 'info',
  };
  return severityMap[severity.toLowerCase()] || 'info';
}

function parseAffectedHardware(systems: string[] | null): ('cpu' | 'gpu' | 'network' | 'storage')[] {
  if (!systems) return [];
  
  const hardwareMap: Record<string, ('cpu' | 'gpu' | 'network' | 'storage')[]> = {
    cpu: ['cpu'],
    gpu: ['gpu'],
    network: ['network'],
    router: ['network'],
    storage: ['storage'],
    vram: ['gpu'],
    memory: ['cpu'],
  };

  const result: Set<'cpu' | 'gpu' | 'network' | 'storage'> = new Set();
  
  systems.forEach(system => {
    const lower = system.toLowerCase();
    Object.entries(hardwareMap).forEach(([key, value]) => {
      if (lower.includes(key)) {
        value.forEach(hw => result.add(hw));
      }
    });
  });

  return Array.from(result);
}



