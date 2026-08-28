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
        if (! $payment->isPending()) {
            return redirect()->route('admin.payments.index')
                ->with('error', 'Only pending payments can be approved.');
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $payment->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'admin_reviewed_at' => now(),
        ]);

        // Update invoice status based on approved payments
        $this->updateInvoiceStatus($payment->invoice);

        return redirect()->route('admin.payments.index')
            ->with('success', 'Payment approved successfully.');
    }

    public function reject(Request $request, Payment $payment)
    {
        if (! $payment->isPending()) {
            return redirect()->route('admin.payments.index')
                ->with('error', 'Only pending payments can be rejected.');
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $payment->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'admin_reviewed_at' => now(),
        ]);

        // A rejection frees up the client's balance, so recompute the
        // invoice status in case it was previously marked paid.
        $this->updateInvoiceStatus($payment->invoice);

        return redirect()->route('admin.payments.index')
            ->with('success', 'Payment rejected successfully.');
    }

    private function updateInvoiceStatus($invoice)
    {
        $totalPaid = (float) $invoice->payments()
            ->where('status', 'approved')
            ->sum('amount');

        if ($totalPaid >= (float) $invoice->total) {
            $invoice->update(['status' => 'paid']);
        } elseif ($invoice->status === 'paid') {
            // Approved payments no longer cover the total — reopen it.
            $invoice->update(['status' => 'sent']);
        }
    }
}
