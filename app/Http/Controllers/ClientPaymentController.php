<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ClientPaymentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $payments = Payment::where('user_id', $user->id)
            ->with('invoice')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('ClientPayments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $invoiceId = $request->query('invoice_id');

        $invoice = null;
        if ($invoiceId) {
            $invoice = Invoice::where('id', $invoiceId)
                ->where('client_email', $user->email)
                ->first();
        }

        $invoices = Invoice::where('client_email', $user->email)
            ->where('status', '!=', 'paid')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('ClientPayments/Create', [
            'invoice' => $invoice,
            'invoices' => $invoices,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:bank_transfer,check,cash,credit_card,other',
            'reference_number' => 'nullable|string|max:255',
            'receipt_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'client_notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        // Verify invoice belongs to user
        $invoice = Invoice::where('id', $validated['invoice_id'])
            ->where('client_email', $user->email)
            ->firstOrFail();

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('receipt_file')) {
            $receiptPath = $request->file('receipt_file')->store('payment_receipts', 'public');
        }

        $payment = Payment::create([
            'invoice_id' => $validated['invoice_id'],
            'user_id' => $user->id,
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'],
            'status' => 'pending',
            'receipt_file' => $receiptPath,
            'client_notes' => $validated['client_notes'],
        ]);

        return redirect()->route('client.payments.index')
            ->with('success', 'Payment submitted successfully and is pending review.');
    }

    public function show(Payment $payment)
    {
        $user = Auth::user();

        // Ensure client can only view their own payments
        if ($payment->user_id !== $user->id) {
            abort(403);
        }

        return inertia('ClientPayments/Show', [
            'payment' => $payment->load('invoice'),
        ]);
    }
}
