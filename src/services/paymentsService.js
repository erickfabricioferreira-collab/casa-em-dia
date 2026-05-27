import { getSupabaseClient } from './supabaseClient.js';

export async function payBillRemote({ bill, familyId, paidBy }) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      bill_id: bill.id,
      family_id: familyId,
      paid_by: paidBy,
      amount: Number(bill.amount),
      snapshot_title: bill.title
    })
    .select()
    .single();

  if (paymentError) throw paymentError;

  const { data: updatedBill, error: billError } = await supabase
    .from('bills')
    .update({ status: 'paid' })
    .eq('id', bill.id)
    .select()
    .single();

  if (billError) throw billError;
  return { payment, bill: updatedBill };
}
