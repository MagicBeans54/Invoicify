export const OUTSTANDING_STATUSES = ['sent', 'overdue'];

export function formatPeso(value) {
    const amount = Number(value || 0);
    return `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatInvoiceDate(value) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Urgency for a due date. Returns { daysOverdue, dueSoon } where daysOverdue
 * is > 0 when past due (excluding paid), dueSoon when due within 3 days.
 * Paid invoices are never urgent.
 */
export function dueInfo(invoice, now = new Date()) {
    if (!invoice?.due_date || invoice.status === 'paid') {
        return { daysOverdue: 0, dueSoon: false };
    }
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(invoice.due_date);
    if (Number.isNaN(due.getTime())) return { daysOverdue: 0, dueSoon: false };
    const diffDays = Math.floor((startOfToday - due) / (24 * 60 * 60 * 1000));
    return {
        daysOverdue: diffDays > 0 ? diffDays : 0,
        dueSoon: diffDays <= 0 && diffDays >= -3,
    };
}

export function dueLabel(daysOverdue) {
    if (daysOverdue <= 0) return '';
    return daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`;
}

/**
 * Status filter shared by admin + client invoice indexes.
 * 'all' | 'outstanding' | 'draft' | 'sent' | 'overdue' | 'paid'
 */
export function filterInvoices(invoices, filter) {
    const list = invoices || [];
    if (!filter || filter === 'all') return list;
    if (filter === 'outstanding') {
        return list.filter((inv) => OUTSTANDING_STATUSES.includes(inv.status));
    }
    return list.filter((inv) => inv.status === filter);
}

export const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'outstanding', label: 'Outstanding' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'paid', label: 'Paid' },
];
