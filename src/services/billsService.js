import { getSupabaseClient } from './supabaseClient.js';

function toRemoteBill(bill, familyId, userId, people = []) {
  const assigned = people.find(person => person.name === bill.assignedTo || person.id === bill.assignedTo);
  return {
    family_id: familyId,
    title: bill.title,
    amount: Number(bill.amount),
    due_date: bill.dueDate,
    category: bill.category || 'Casa',
    status: bill.status === 'paid' ? 'paid' : 'pending',
    assigned_to: assigned?.id?.startsWith('local-') ? null : assigned?.id || null,
    is_recurring: Boolean(bill.isRecurring),
    recurrence_day: bill.recurrenceDay || null,
    installment_current: bill.installmentCurrent || null,
    installment_total: bill.installmentTotal || null,
    notes: bill.notes || null,
    created_by: userId
  };
}

function fromRemoteBill(row) {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    dueDate: row.due_date,
    category: row.category,
    status: row.status,
    assignedTo: row.assigned_profile?.name || row.assigned_to || '',
    paidBy: row.status === 'paid' ? row.last_payment?.[0]?.paid_profile?.name : undefined,
    paidAt: row.last_payment?.[0]?.paid_at?.slice(0, 10),
    createdAt: row.created_at?.slice(0, 10),
    isRecurring: row.is_recurring,
    recurrenceDay: row.recurrence_day,
    installmentCurrent: row.installment_current,
    installmentTotal: row.installment_total,
    notes: row.notes || ''
  };
}

export async function fetchBills(familyId) {
  const supabase = await getSupabaseClient();
  if (!supabase || !familyId) return [];

  const { data, error } = await supabase
    .from('bills')
    .select(`
      *,
      assigned_profile:assigned_to(id, name, color, avatar_url),
      last_payment:payments(id, paid_at, paid_by, paid_profile:paid_by(id, name, color))
    `)
    .eq('family_id', familyId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return (data || []).map(fromRemoteBill);
}

export async function createBill({ bill, familyId, userId, people }) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('bills')
    .insert(toRemoteBill(bill, familyId, userId, people))
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBill({ id, bill, familyId, userId, people }) {
  const supabase = await getSupabaseClient();
  const payload = toRemoteBill(bill, familyId, userId, people);
  delete payload.created_by;

  const { data, error } = await supabase
    .from('bills')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBill(id) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('bills').delete().eq('id', id);
  if (error) throw error;
}
