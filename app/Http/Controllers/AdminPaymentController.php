<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['invoice', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('AdminPayments/Index', [
            'payments' => $payments,
        ]);
    }

    public function show(Payment $payment)
    {
        return inertia('AdminPayments/Show', [
            'payment' => $payment->load(['invoice', 'invoice.items', 'user']),
        ]);
    }

    public function approve(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $payment->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'admin_reviewed_at' => now(),
        ]);

        // Update invoice status if fully paid
        $this->updateInvoiceStatus($payment->invoice);

        return redirect()->route('admin.payments.index')
            ->with('success', 'Payment approved successfully.');
    }

    public function reject(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $payment->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'admin_reviewed_at' => now(),
        ]);

        return redirect()->route('admin.payments.index')
            ->with('success', 'Payment rejected successfully.');
    }

    private function updateInvoiceStatus($invoice)
    {
        $totalPaid = $invoice->payments()
            ->where('status', 'approved')
            ->sum('amount');

        if ($totalPaid >= $invoice->total) {
            $invoice->update(['status' => 'paid']);
        }
    }
}
