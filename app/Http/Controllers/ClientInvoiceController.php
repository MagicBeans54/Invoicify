<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientInvoiceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $invoices = Invoice::where('client_email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('ClientInvoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show(Invoice $invoice)
    {
        $user = Auth::user();

        // Ensure client can only view their own invoices
        if ($invoice->client_email !== $user->email) {
            abort(403);
        }

        return inertia('ClientInvoices/Show', [
            'invoice' => $invoice->load('items'),
        ]);
    }

    public function downloadPDF(Invoice $invoice)
    {
        $user = Auth::user();

        // Ensure client can only download their own invoices
        if ($invoice->client_email !== $user->email) {
            abort(403);
        }

        // Reuse the existing PDF generation logic
        $controller = new InvoiceController();
        return $controller->downloadPDF($invoice);
    }
}
