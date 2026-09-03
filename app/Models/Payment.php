<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'user_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'status',
        'receipt_file',
        'client_notes',
        'admin_notes',
        'admin_reviewed_at',
    ];

    // Remove the boot method and cleanUtf8 function for now
    // The issue was with SerializesModels in queued jobs, not database storage

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'admin_reviewed_at' => 'datetime',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
