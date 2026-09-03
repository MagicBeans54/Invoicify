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

    // Remove the boot method and cleanUtf8 function for now
    // The issue was with SerializesModels in queued jobs, not database storage

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

        // Collect the numeric suffixes of all invoices for this client on this
        // date (format: INV-XXX-YYYY-MM-DD) and take the highest one. This is
        // done numerically rather than via string ordering, which breaks once
        // the suffix grows beyond three digits.
        $highestSuffix = self::where('client_name', $clientName)
            ->where('invoice_date', $date)
            ->pluck('invoice_number')
            ->map(function ($number) use ($date) {
                preg_match('/INV-(\d+)-' . preg_quote($date, '/') . '$/', $number, $matches);

                return $matches[1] ?? null;
            })
            ->filter(fn ($suffix) => $suffix !== null)
            ->map(fn ($suffix) => (int) $suffix)
            ->max();

        $nextSuffix = ($highestSuffix ?? -1) + 1;

        return 'INV-' . str_pad((string) $nextSuffix, 3, '0', STR_PAD_LEFT) . "-{$date}";
    }
}
