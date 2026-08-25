<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySettings extends Model
{
    protected $fillable = [
        'company_name',
        'logo_path',
        'email',
        'phone',
        'address',
        'tax_id',
        'default_tax_rate',
        'invoice_notes',
        'bank_account_name',
        'bank_name',
        'bank_account_number',
        'bank_account_type',
        'bank_address',
        'default_terms',
    ];

    protected $casts = [
        'default_tax_rate' => 'decimal:2',
    ];

    public static function getSettings(): self
    {
        return self::firstOrCreate([], [
            'company_name' => 'Techstacks',
            'default_tax_rate' => 0,
        ]);
    }
}
