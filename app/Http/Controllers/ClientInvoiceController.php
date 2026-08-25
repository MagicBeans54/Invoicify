<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientInvoiceController extends Controller
{
    public function index()
    {
        $client = Auth::guard('client')->user();
        $invoices = Invoice::where('client_email', $client->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('ClientInvoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show(Invoice $invoice)
    {
        $client = Auth::guard('client')->user();

        // Ensure client can only view their own invoices
        if ($invoice->client_email !== $client->email) {
            abort(403);
        }

        return inertia('ClientInvoices/Show', [
            'invoice' => $invoice->load('items'),
        ]);
    }

    public function downloadPDF(Invoice $invoice)
    {
        $client = Auth::guard('client')->user();

        // Ensure client can only download their own invoices
        if ($invoice->client_email !== $client->email) {
            abort(403);
        }

        // Reuse the existing PDF generation logic
        $controller = new InvoiceController();
        return $controller->downloadPDF($invoice);
    }
}
