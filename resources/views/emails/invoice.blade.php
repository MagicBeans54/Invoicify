{{ __('Hello :name', ['name' => $invoice->client_name]) }},

{{ __("Please find attached invoice :number from :company, due :date.", [
    'number' => $invoice->invoice_number,
    'company' => $invoice->company_name,
    'date' => \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y'),
]) }}

@if ($invoice->notes)
{{ $invoice->notes }}
@endif

{{ __('Regards') }},
{{ $invoice->company_name }}
