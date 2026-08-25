<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\CompanySettings;
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

    public function create()
    {
        $companySettings = CompanySettings::getSettings();
        return Inertia::render('Invoices/Create', [
            'companySettings' => $companySettings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => 'required|unique:invoices',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'required|in:draft,sent,paid,overdue',
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
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $invoice = Invoice::create([
            'invoice_number' => $validated['invoice_number'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'company_name' => $validated['company_name'],
            'company_email' => $validated['company_email'],
            'company_phone' => $validated['company_phone'],
            'company_address' => $validated['company_address'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_phone' => $validated['client_phone'],
            'client_address' => $validated['client_address'],
            'tax_rate' => $validated['tax_rate'],
            'notes' => $validated['notes'],
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
            ]);
        }

        $invoice->calculateTotals();
        $invoice->save();

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
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'required|in:draft,sent,paid,overdue',
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
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $invoice->update([
            'invoice_number' => $validated['invoice_number'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'company_name' => $validated['company_name'],
            'company_email' => $validated['company_email'],
            'company_phone' => $validated['company_phone'],
            'company_address' => $validated['company_address'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_phone' => $validated['client_phone'],
            'client_address' => $validated['client_address'],
            'tax_rate' => $validated['tax_rate'],
            'notes' => $validated['notes'],
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

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $settings = CompanySettings::getSettings();
            $settings->update(['logo_path' => $path]);
            
            return back()->with('success', 'Logo uploaded successfully');
        }

        return back()->with('error', 'Failed to upload logo');
    }

    public function downloadPDF(Invoice $invoice)
    {
        $invoice->load('items');
        $companySettings = CompanySettings::getSettings();
        
        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'companySettings' => $companySettings,
        ]);
        
        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    public function send(Invoice $invoice)
    {
        $invoice->load('items');

        if (!$invoice->client_email) {
            return back()->with('error', 'This invoice has no client email address');
        }

        $companySettings = CompanySettings::getSettings();

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'companySettings' => $companySettings,
        ]);

            Mail::to($invoice->client_email)
                ->send(new InvoiceMail($invoice, $pdf->output()));

        if ($invoice->status === 'draft') {
            $invoice->update(['status' => 'sent']);
        }

        return back()->with('success', "Invoice sent to {$invoice->client_email}");
    }
}
