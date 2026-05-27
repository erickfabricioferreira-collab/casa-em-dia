export function validateBillForm(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Informe o nome da conta.';
  if (!Number.isFinite(Number(values.amount)) || Number(values.amount) <= 0) errors.amount = 'Informe um valor maior que zero.';
  if (!values.dueDate) errors.dueDate = 'Informe o vencimento.';
  if (!values.assignedTo) errors.assignedTo = 'Escolha um responsável.';
  if (!values.category?.trim()) errors.category = 'Informe uma categoria.';
  return errors;
}
