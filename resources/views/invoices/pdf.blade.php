<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 1px solid #ddd;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
        }
        .company-info {
            flex: 1;
        }
        .company-logo {
            max-width: 150px;
            max-height: 80px;
            object-fit: contain;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-number {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1f2937;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #6b7280;
            margin-bottom: 5px;
        }
        .info-value {
            color: #1f2937;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .totals {
            margin-left: auto;
            width: 250px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .total-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            color: #2563eb;
        }
        .notes {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-draft { background: #e5e7eb; color: #374151; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                @if($companySettings->logo_path)
                    <img src="{{ asset('storage/' . $companySettings->logo_path) }}" alt="Company Logo" class="company-logo">
                @endif
                <h1 style="margin: 10px 0 5px 0; color: #1f2937;">{{ $companySettings->company_name }}</h1>
                @if($companySettings->email)
                    <p style="margin: 5px 0;">{{ $companySettings->email }}</p>
                @endif
                @if($companySettings->phone)
                    <p style="margin: 5px 0;">{{ $companySettings->phone }}</p>
                @endif
                @if($companySettings->address)
                    <p style="margin: 5px 0; white-space: pre-line;">{{ $companySettings->address }}</p>
                @endif
            </div>
            <div class="invoice-details">
                <div class="invoice-number">INVOICE</div>
                <p style="margin: 5px 0;"><strong>{{ $invoice->invoice_number }}</strong></p>
                <span class="status-badge status-{{ $invoice->status }}">{{ $invoice->status }}</span>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="info-grid">
            <div class="info-box">
                <div class="section-title">Bill To</div>
                <p style="margin: 5px 0; font-weight: bold;">{{ $invoice->client_name }}</p>
                @if($invoice->client_email)
                    <p style="margin: 5px 0;">{{ $invoice->client_email }}</p>
                @endif
                @if($invoice->client_phone)
                    <p style="margin: 5px 0;">{{ $invoice->client_phone }}</p>
                @endif
                @if($invoice->client_address)
                    <p style="margin: 5px 0; white-space: pre-line;">{{ $invoice->client_address }}</p>
                @endif
            </div>
            <div class="info-box">
                <div class="section-title">Invoice Details</div>
                <div class="total-row">
                    <span class="info-label">Invoice Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($invoice->invoice_date)->format('M d, Y') }}</span>
                </div>
                <div class="total-row">
                    <span class="info-label">Due Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</span>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Description</th>
                    <th style="width: 15%; text-align: center;">Quantity</th>
                    <th style="width: 15%; text-align: right;">Unit Price</th>
                    <th style="width: 20%; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right;">${{ number_format($item->unit_price, 2) }}</td>
                        <td style="text-align: right;">${{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${{ number_format($invoice->subtotal, 2) }}</span>
            </div>
            <div class="total-row">
                <span>Tax ({{ $invoice->tax_rate }}%):</span>
                <span>${{ number_format($invoice->tax_amount, 2) }}</span>
            </div>
            <div class="total-row">
                <span>Total:</span>
                <span>${{ number_format($invoice->total, 2) }}</span>
            </div>
        </div>

        <!-- Notes -->
        @if($invoice->notes)
            <div class="notes">
                <div class="section-title">Notes</div>
                <p style="margin: 0; white-space: pre-line;">{{ $invoice->notes }}</p>
            </div>
        @endif

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Thank you for your business!</p>
            <p>Generated by Invoicify</p>
        </div>
    </div>
</body>
</html>