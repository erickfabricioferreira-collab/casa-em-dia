import { addDays, todayISO } from '../utils/date.js';

export const seedData = {
  user: { id: 'local-erick', name: 'Erick', email: 'erick@casa.com', color: '#4DA3FF', avatar: 'E' },
  theme: 'light',
  family: { id: 'local-family', name: 'Casa em Dia' },
  people: [
    { id: 'local-erick', name: 'Erick', avatar: 'E', color: '#4DA3FF', email: 'erick@casa.com' },
    { id: 'local-karine', name: 'Karine', avatar: 'K', color: '#9B7BFF', email: 'karine@casa.com' }
  ],
  bills: [
    { id: '1', title: 'Energia', amount: 320, dueDate: addDays(-1), category: 'Casa', assignedTo: 'Erick', status: 'pending', createdAt: todayISO() },
    { id: '2', title: 'Internet', amount: 120, dueDate: todayISO(), category: 'Serviços', assignedTo: 'Karine', status: 'pending', createdAt: todayISO() },
    { id: '3', title: 'Água', amount: 86.9, dueDate: addDays(2), category: 'Casa', assignedTo: 'Erick', status: 'pending', createdAt: todayISO() },
    { id: '4', title: 'Aluguel', amount: 900, dueDate: addDays(8), category: 'Moradia', assignedTo: 'Erick', status: 'pending', createdAt: todayISO() },
    { id: '5', title: 'Telefone', amount: 59.9, dueDate: addDays(-4), category: 'Serviços', assignedTo: 'Karine', status: 'paid', paidBy: 'Karine', paidAt: addDays(-3), createdAt: todayISO() }
  ],
  payments: [
    { id: 'p1', billId: '5', snapshotTitle: 'Telefone', amount: 59.9, paidBy: 'Karine', paidAt: addDays(-3), notes: '' }
  ]
};
