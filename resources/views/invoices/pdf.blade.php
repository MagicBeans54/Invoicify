<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 5px;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            margin-bottom: 1px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            padding-bottom: 50px;
        }
        .header-table td {
            vertical-align: middle;
        }
        .header-table td:first-child {
            text-align: left;
        }
        .header-table td:last-child {
            text-align: right;
            
        }
        .company-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .company-logo {
            height: 64px;
            max-width: 220px;
        }
        .company-info h1 {
            color: #10b981;
            font-size: 28px;
            margin-bottom: 1px;
            font-weight: bold;
        }
        .company-info .company-details p {
            color: #666;
            font-size: 12px;
            margin-bottom: 2px;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h2 {
            color: #333;
            font-size: 32px;
            margin-bottom: 1px;
            font-weight: bold;
        }
        .invoice-title .invoice-number {
            color: #666;
            font-size: 14px;
        }

        .info-section {
            margin-bottom: 5px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            
        }
        .info-table td {
            vertical-align: top;
        }
        .info-table td:first-child {
            text-align: left;
        }
        .info-table td:last-child {
            text-align: right;
        }
        .bill-to {
            flex: 1;
        }
        .bill-to h3 {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .bill-to p {
            color: #333;
            font-size: 14px;
            font-weight: bold;
            line-height: 1.5;
        }
        .invoice-meta {
            flex: 1;
            text-align: right;
        }
        .invoice-meta p {
            color: #333;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .invoice-meta strong {
            color: #666;
            font-weight: normal;
        }
        .balance-due-box {
            background-color: #f3f4f6;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-radius: 4px;
            margin-left: auto;
            max-width: 300px;
        }
        .balance-due-box h3 {
            color: #333;
            font-size: 14px;
            font-weight: bold;
        }
        .balance-due-box .amount {
            color: #333;
            font-size: 24px;
            font-weight: bold;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #374151;
            color: white;
            font-size: 12px;
            font-weight: 600;
            padding: 1px;
            text-align: left;
            text-transform: uppercase;
        }
        .items-table th:last-child {
            text-align: right;
        }
        .items-table td {
            padding: 1px;
            color: #333;
            font-size: 14px;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table td:last-child {
            text-align: right;
        }
        .summary-section {
            margin-bottom: 30px;
            text-align: right;
            margin-left: auto;
            max-width: 300px;
        }
        .summary-table {
            width: 300px;
        }
        .summary-table td {
            padding: 8px 0;
            color: #333;
            font-size: 14px;
        }
        .summary-table td:last-child {
            text-align: right;
            font-weight: 600;
        }
        .summary-table tr.total td {
            color: #333;
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #e5e7eb;
            padding-top: 12px;
        }
        .notes-section {
            margin-bottom: 30px;
        }
        .notes-section h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .notes-section p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        .bank-details {
            margin-bottom: 30px;
        }
        .bank-details h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .bank-details p {
            color: #666;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .bank-details strong {
            color: #333;
        }
        .terms-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        .terms-section h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .terms-section p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <table class="header-table">
                <tr>
                    <td>
                        <div class="company-info">
                            @if($logoPath)
                                <img src="{{ str_replace('\\', '/', $logoPath) }}" alt="Company Logo" class="company-logo" />
                            @else
                                <img src="{{ str_replace('\\', '/', public_path('images/techstackfull_mint.png')) }}" alt="Techstacks" class="company-logo" />
                            @endif
                            <div>
                                {{-- <h1>{{ $companySettings->company_name }}</h1> --}}
                                <div class="company-details">
                                    @if($companySettings->address)
                                        <p>{{ $companySettings->address }}</p>
                                    @endif
                                    @if($companySettings->email)
                                        <p>{{ $companySettings->email }}</p>
                                    @endif
                                    @if($companySettings->phone)
                                        <p>{{ $companySettings->phone }}</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="invoice-title">
                            <h2>INVOICE</h2>
                            <div class="invoice-number"># {{ $invoice->invoice_number }}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="info-section">
            <table class="info-table">
                <tr>
                    <td>
                        <div class="bill-to">
                            <h3>Bill To:</h3>
                            <p>{{ $invoice->client_name }}</p>
                            @if($invoice->client_address)
                                <p>{{ $invoice->client_address }}</p>
                            @endif
                            @if($invoice->client_email)
                                <p>{{ $invoice->client_email }}</p>
                            @endif
                            @if($invoice->client_phone)
                                <p>{{ $invoice->client_phone }}</p>
                            @endif
                        </div>
                    </td>
                    <td>
                        <div class="invoice-meta">
                            @if($invoice->contract_number)
                                <p><strong>Contract #:</strong> {{ $invoice->contract_number }}</p>
                            @endif
                            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('M d, Y') }}</p>
                            <p><strong>Payment Terms:</strong> {{ $invoice->payment_terms ?? 'Due on receipt' }}</p>
                            <p><strong>Due Date:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="balance-due-box">
            <h3>Balance Due:</h3>
            <div class="amount">PHP {{ number_format($invoice->total, 2) }}</div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>PHP {{ number_format($item->unit_price, 2) }}</td>
                        <td>PHP {{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="summary-section">
            <table class="summary-table">
                <tr>
                    <td>Subtotal</td>
                    <td>PHP {{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax ({{ $invoice->tax_rate }}%)</td>
                    <td>PHP {{ number_format($invoice->tax_amount, 2) }}</td>
                </tr>
                <tr class="total">
                    <td>Total</td>
                    <td>PHP {{ number_format($invoice->total, 2) }}</td>
                </tr>
            </table>
        </div>

        @if($invoice->notes || $companySettings->invoice_notes)
            <div class="notes-section">
                <h3>Notes</h3>
                <p>
                    @if($invoice->notes)
                        {{ $invoice->notes }}
                    @endif
                    @if($companySettings->invoice_notes)
                        @if($invoice->notes)
                            <br><br>
                        @endif
                        {{ $companySettings->invoice_notes }}
                    @endif
                </p>
            </div>
        @endif

        @if($companySettings->tax_id || $companySettings->bank_name)
            <div class="bank-details">
                <h3>Bank Details</h3>
                @if($companySettings->bank_account_name)
                    <p><strong>Account Name:</strong> {{ $companySettings->bank_account_name }}</p>
                @endif
                @if($companySettings->bank_name)
                    <p><strong>Bank Name:</strong> {{ $companySettings->bank_name }}</p>
                @endif
                @if($companySettings->bank_account_number)
                    <p><strong>Account Number:</strong> {{ $companySettings->bank_account_number }}</p>
                @endif
                @if($companySettings->bank_account_type)
                    <p><strong>Account Type:</strong> {{ $companySettings->bank_account_type }}</p>
                @endif
                @if($companySettings->bank_address)
                    <p><strong>Bank Address:</strong> {{ $companySettings->bank_address }}</p>
                @endif
                @if($companySettings->tax_id)
                    <p><strong>Tax ID:</strong> {{ $companySettings->tax_id }}</p>
                @endif
            </div>
        @endif

        @if($invoice->terms)
            <div class="terms-section">
                <h3>Terms</h3>
                <p>{{ $invoice->terms }}</p>
            </div>
        @else
            <div class="terms-section">
                <h3>Terms</h3>
                <p>Payment is due upon receipt. Thank you for your business!</p>
            </div>
        @endif
    </div>
</body>
</html>