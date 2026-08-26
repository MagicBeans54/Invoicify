<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'contract_number',
        'invoice_date',
        'due_date',
        'status',
        'payment_terms',
        'company_name',
        'company_logo',
        'company_email',
        'company_phone',
        'company_address',
        'client_name',
        'client_email',
        'client_phone',
        'client_address',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'total',
        'notes',
        'terms',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_email', 'email');
    }

    public function clientUser()
    {
        return $this->belongsTo(User::class, 'client_email', 'email');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'client_email', 'email');
    }

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('total');
        $this->tax_amount = $this->subtotal * ($this->tax_rate / 100);
        $this->total = $this->subtotal + $this->tax_amount;
    }

    public static function generateInvoiceNumber($clientName, $invoiceDate): string
    {
        $date = $invoiceDate instanceof \DateTime ? $invoiceDate->format('Y-m-d') : $invoiceDate;
        
        // Find existing invoices for this client on this date
        $existingInvoices = self::where('client_name', $clientName)
            ->where('invoice_date', $date)
            ->orderBy('invoice_number', 'desc')
            ->get();
        
        if ($existingInvoices->isEmpty()) {
            // First invoice for this client on this date
            return "INV-000-{$date}";
        }
        
        // Extract the highest suffix from existing invoices
        $lastInvoice = $existingInvoices->first();
        $lastNumber = $lastInvoice->invoice_number;
        
        // Parse the format INV-XXX-YYYY-MM-DD
        if (preg_match('/INV-(\d+)-' . preg_quote($date, '/') . '$/', $lastNumber, $matches)) {
            $suffix = intval($matches[1]);
            $newSuffix = str_pad($suffix + 1, 3, '0', STR_PAD_LEFT);
            return "INV-{$newSuffix}-{$date}";
        }
        
        // Fallback if format doesn't match expected pattern
        return "INV-001-{$date}";
    }
}
