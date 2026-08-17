<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 30px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }
        .logo-section {
            flex: 1;
        }
        .company-logo {
            max-width: 120px;
            max-height: 120px;
            object-fit: contain;
            margin-bottom: 15px;
        }
        .your-company {
            margin-top: 15px;
        }
        .your-company-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 5px 0;
        }
        .company-address {
            font-size: 12px;
            color: #666;
            margin: 3px 0;
            white-space: pre-line;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h1 {
            font-size: 48px;
            font-weight: bold;
            color: #333;
            margin: 0;
            letter-spacing: 2px;
        }
        .invoice-details {
            margin-top: 20px;
            text-align: right;
        }
        .invoice-detail-row {
            margin: 8px 0;
            font-size: 13px;
        }
        .invoice-detail-label {
            color: #666;
            font-weight: bold;
            margin-right: 10px;
        }
        .invoice-detail-value {
            color: #333;
        }
        .bill-to-section {
            display: flex;
            gap: 40px;
            margin-bottom: 30px;
        }
        .bill-to {
            flex: 1;
        }
        .bill-to-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .client-name {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 5px 0;
        }
        .client-address {
            font-size: 12px;
            color: #666;
            margin: 3px 0;
            white-space: pre-line;
        }
        .invoice-info-right {
            flex: 1;
            padding-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        thead {
            background: #dc2626;
        }
        th {
            color: white;
            padding: 12px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        th.qty, th.rate, th.tax, th.amount {
            text-align: right;
        }
        td {
            padding: 12px 10px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }
        td.qty, td.rate, td.tax, td.amount {
            text-align: right;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .totals {
            width: 250px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }
        .total-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #333;
            padding-top: 12px;
        }
        .tax-display {
            text-align: right;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .notes {
            margin-top: 30px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 3px solid #dc2626;
        }
        .notes-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .notes-content {
            font-size: 12px;
            color: #333;
            white-space: pre-line;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                @if($companySettings->logo_path)
                    <img src="{{ asset('storage/' . $companySettings->logo_path) }}" alt="Company Logo" class="company-logo">
                @endif
                
                <div class="your-company">
                    <div class="your-company-label">Your Company</div>
                    <div class="company-name">{{ $companySettings->company_name }}</div>
                    @if($companySettings->address)
                        <div class="company-address">{{ $companySettings->address }}</div>
                    @endif
                    @if($companySettings->email)
                        <div class="company-address">{{ $companySettings->email }}</div>
                    @endif
                    @if($companySettings->phone)
                        <div class="company-address">{{ $companySettings->phone }}</div>
                    @endif
                </div>
            </div>
            
            <div class="invoice-title">
                <h1>INVOICE</h1>
                <div class="invoice-details">
                    <div class="invoice-detail-row">
                        <span class="invoice-detail-label">Invoice#</span>
                        <span class="invoice-detail-value">{{ $invoice->invoice_number }}</span>
                    </div>
                    <div class="invoice-detail-row">
                        <span class="invoice-detail-label">Invoice Date</span>
                        <span class="invoice-detail-value">{{ \Carbon\Carbon::parse($invoice->invoice_date)->format('M d, Y') }}</span>
                    </div>
                    <div class="invoice-detail-row">
                        <span class="invoice-detail-label">Due Date</span>
                        <span class="invoice-detail-value">{{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bill To Section -->
        <div class="bill-to-section">
            <div class="bill-to">
                <div class="bill-to-label">Bill To:</div>
                <div class="client-name">{{ $invoice->client_name }}</div>
                @if($invoice->client_address)
                    <div class="client-address">{{ $invoice->client_address }}</div>
                @endif
                @if($invoice->client_email)
                    <div class="client-address">{{ $invoice->client_email }}</div>
                @endif
                @if($invoice->client_phone)
                    <div class="client-address">{{ $invoice->client_phone }}</div>
                @endif
            </div>
            
            <div class="invoice-info-right">
                <!-- Empty space for layout balance -->
            </div>
        </div>

        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th style="width: 45%;">Item Description</th>
                    <th style="width: 15%;" class="qty">Qty</th>
                    <th style="width: 15%;" class="rate">Rate</th>
                    <th style="width: 15%;" class="tax">Tax</th>
                    <th style="width: 10%;" class="amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td class="qty">{{ $item->quantity }}</td>
                        <td class="rate">${{ number_format($item->unit_price, 2) }}</td>
                        <td class="tax">{{ number_format($item->unit_price * $invoice->tax_rate / 100, 2) }}</td>
                        <td class="amount">${{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Tax Display -->
        @if($invoice->tax_amount > 0)
            <div class="tax-display">
                {{ number_format($invoice->tax_amount, 2) }}
            </div>
        @endif

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>${{ number_format($invoice->subtotal, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Tax ({{ $invoice->tax_rate }}%)</span>
                    <span>${{ number_format($invoice->tax_amount, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Total</span>
                    <span>${{ number_format($invoice->total, 2) }}</span>
                </div>
            </div>
        </div>

        <!-- Notes -->
        @if($invoice->notes)
            <div class="notes">
                <div class="notes-label">Notes</div>
                <div class="notes-content">{{ $invoice->notes }}</div>
            </div>
        @endif
    </div>
</body>
</html>