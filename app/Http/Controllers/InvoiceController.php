<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\CompanySettings;
use App\Models\Client;
use App\Mail\InvoiceMail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('items')->latest()->get();
        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(Request $request, $client_id = null)
    {
        $companySettings = CompanySettings::getSettings();
        $client = null;
        
        if ($client_id) {
            $client = Client::find($client_id);
        }
        
        return Inertia::render('Invoices/Create', [
            'companySettings' => $companySettings,
            'client' => $client,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_number' => 'nullable|string',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'required|in:draft,sent,paid,overdue',
            'payment_terms' => 'nullable|string',
            'company_name' => 'required|string',
            'company_email' => 'nullable|email',
            'company_phone' => 'nullable|string',
            'company_address' => 'nullable|string',
            'client_name' => 'required|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'tax_rate' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Generate invoice number automatically and create the invoice.
        // Under concurrent requests, two generations can collide on the
        // unique invoice_number column, so retry with a freshly generated
        // number when that happens.
        $invoice = null;
        $attempts = 0;

        while ($attempts < 5) {
            $attempts++;

            try {
                $invoice = Invoice::create([
                    'invoice_number' => Invoice::generateInvoiceNumber($validated['client_name'], $validated['invoice_date']),
                    'contract_number' => $validated['contract_number'] ?? null,
                    'invoice_date' => $validated['invoice_date'],
                    'due_date' => $validated['due_date'],
                    'status' => $validated['status'],
                    'payment_terms' => $validated['payment_terms'] ?? null,
                    'company_name' => $validated['company_name'],
                    'company_email' => $validated['company_email'] ?? null,
                    'company_phone' => $validated['company_phone'] ?? null,
                    'company_address' => $validated['company_address'] ?? null,
                    'client_name' => $validated['client_name'],
                    'client_email' => $validated['client_email'] ?? null,
                    'client_phone' => $validated['client_phone'] ?? null,
                    'client_address' => $validated['client_address'] ?? null,
                    'tax_rate' => $validated['tax_rate'],
                    'notes' => $validated['notes'] ?? null,
                    'terms' => $validated['terms'] ?? null,
                ]);
                break;
            } catch (\Illuminate\Database\QueryException $e) {
                $isDuplicateKey = str_contains($e->getMessage(), 'Duplicate entry')
                    || str_contains($e->getMessage(), 'UNIQUE constraint failed');

                if ($attempts >= 5 || ! $isDuplicateKey) {
                    throw $e;
                }
            }
        }

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
            ]);
        }

        $invoice->calculateTotals();
        $invoice->save();

        $this->syncClientRecord($validated);

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load('items');
        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load('items');
        $companySettings = CompanySettings::getSettings();
        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'companySettings' => $companySettings,
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'invoice_number' => 'required|unique:invoices,invoice_number,' . $invoice->id,
            'contract_number' => 'nullable|string',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'required|in:draft,sent,paid,overdue',
            'payment_terms' => 'nullable|string',
            'company_name' => 'required|string',
            'company_email' => 'nullable|email',
            'company_phone' => 'nullable|string',
            'company_address' => 'nullable|string',
            'client_name' => 'required|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'tax_rate' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $invoice->update([
            'invoice_number' => $validated['invoice_number'],
            'contract_number' => $validated['contract_number'] ?? null,
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'payment_terms' => $validated['payment_terms'] ?? null,
            'company_name' => $validated['company_name'],
            'company_email' => $validated['company_email'] ?? null,
            'company_phone' => $validated['company_phone'] ?? null,
            'company_address' => $validated['company_address'] ?? null,
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'tax_rate' => $validated['tax_rate'],
            'notes' => $validated['notes'] ?? null,
            'terms' => $validated['terms'] ?? null,
        ]);

        $invoice->items()->delete();
        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
            ]);
        }

        $invoice->calculateTotals();
        $invoice->save();

        $this->syncClientRecord($validated);

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully');
    }

    /**
     * Keep the Clients directory in sync with invoice data: ensure a Client
     * record exists for the invoice's client email, and update its details.
     * Only fields actually provided on the invoice are overwritten, so
     * existing client data (e.g. a phone number set at registration) is
     * never wiped by an invoice that omits it.
     */
    private function syncClientRecord(array $validated): void
    {
        if (empty($validated['client_email'])) {
            return;
        }

        $attributes = array_filter([
            'name' => $validated['client_name'] ?? null,
            'phone' => $validated['client_phone'] ?? null,
            'address' => $validated['client_address'] ?? null,
        ], fn ($value) => $value !== null && $value !== '');

        Client::updateOrCreate(
            ['email' => $validated['client_email']],
            $attributes
        );
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully');
    }

    public function downloadPDF(Invoice $invoice)
    {
        $invoice->load('items');
        $companySettings = CompanySettings::getSettings();
        
        // Get logo file path if exists
        $logoPath = null;
        if ($companySettings->logo_path) {
            $logoPath = public_path('storage/' . $companySettings->logo_path);
        }
        
        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'companySettings' => $companySettings,
            'logoPath' => $logoPath,
        ])->setPaper('a4');
        
        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    public function send(Invoice $invoice)
    {
        $invoice->load('items');

        if (!$invoice->client_email) {
            return back()->with('error', 'This invoice has no client email address');
        }

        $companySettings = CompanySettings::getSettings();

        $logoPath = null;
        if ($companySettings->logo_path) {
            $logoPath = public_path('storage/' . $companySettings->logo_path);
        }

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'companySettings' => $companySettings,
            'logoPath' => $logoPath,
        ])->setPaper('a4')->output();

        Mail::to($invoice->client_email)->send(new InvoiceMail($invoice, $pdf));

        if ($invoice->status === 'draft') {
            $invoice->update(['status' => 'sent']);
        }

        return back()->with('success', "Invoice sent to {$invoice->client_email}");
    }
}
