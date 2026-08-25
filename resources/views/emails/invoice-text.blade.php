Hello {{ $invoice->client_name }},

Please find your invoice {{ $invoice->invoice_number }} from {{ $invoice->company_name }} below.
(The attached PDF is best for printing.)

Invoice: {{ $invoice->invoice_number }}
Issued:  {{ \Illuminate\Support\Carbon::parse($invoice->invoice_date)->format('M j, Y') }}
Due:     {{ \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y') }}
Amount due: ${{ number_format((float) $invoice->total, 2) }}

@foreach ($invoice->items as $item)
- {{ $item->description }} x{{ $item->quantity }} @ ${{ number_format((float) $item->unit_price, 2) }} = ${{ number_format((float) $item->total, 2) }}
@endforeach

@if ($invoice->notes)
{{ $invoice->notes }}
@endif

Regards,
{{ $invoice->company_name }}
