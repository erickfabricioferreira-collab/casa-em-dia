import { useEffect } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient.js';

export function useRealtimeSync({ familyId, onSync }) {
  useEffect(() => {
    let activeChannel = null;
    let disposed = false;

    async function connect() {
      if (!isSupabaseConfigured || !familyId) return;
      const supabase = await getSupabaseClient();
      if (!supabase || disposed) return;

      activeChannel = supabase
        .channel(`family-${familyId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bills', filter: `family_id=eq.${familyId}` }, () => onSync?.('bills'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `family_id=eq.${familyId}` }, () => onSync?.('payments'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'family_members', filter: `family_id=eq.${familyId}` }, () => onSync?.('family_members'))
        .subscribe();
    }

    connect();

    return () => {
      disposed = true;
      if (activeChannel) getSupabaseClient().then(supabase => supabase?.removeChannel(activeChannel));
    };
  }, [familyId, onSync]);
}
