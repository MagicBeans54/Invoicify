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
