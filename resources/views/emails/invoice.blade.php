@component('mail::message')

# Invoice {{ $invoice->invoice_number }}

Hi {{ $invoice->client_name }},

**{{ $invoice->company_name }}** has issued you invoice **{{ $invoice->invoice_number }}**, attached to this email as a PDF.

@component('mail::panel')
| | |
|-|-|
| **Amount due** | **${{ number_format((float) $invoice->total, 2) }}** |
| **Due date** | {{ \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y') }} |
@endcomponent

## Summary

| Item | Qty | Price |
|-|-|-|
@foreach ($invoice->items as $item)
| {{ $item->description }} | {{ $item->quantity }} | ${{ number_format((float) $item->total, 2) }} |
@endforeach

@if ((float) $invoice->tax_amount > 0)
| Subtotal | | ${{ number_format((float) $invoice->subtotal, 2) }} |
| Tax ({{ $invoice->tax_rate }}%) | | ${{ number_format((float) $invoice->tax_amount, 2) }} |
@endif
| **Total** | | **${{ number_format((float) $invoice->total, 2) }}** |

@if ($invoice->notes)
> {{ $invoice->notes }}
@endif

Questions about this invoice? Just reply to this email.

Thanks,
{{ $invoice->company_name }}

@endcomponent
