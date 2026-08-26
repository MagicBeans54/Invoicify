Invoicify

Hi {{ $invoice->client_name }},

Your invoice from {{ $invoice->company_name }} is attached as a PDF.

Amount due: ₱{{ number_format((float) $invoice->total, 2) }}
Due date: {{ \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y') }}

@if ($invoice->company_email)
Questions about this invoice? Email {{ $invoice->company_email }}.
@endif
This is an auto-generated message — replies are not monitored.
