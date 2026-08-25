{{-- Custom email template matching the Invoicify app look (minimal, neutral) --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">
                    <!-- Brand -->
                    <tr>
                        <td style="padding: 8px 4px 24px;">
                            <span style="color: #18181b; font-size: 15px; font-weight: 600; letter-spacing: -0.2px;">Invoicify</span>
                            <span style="color: #a1a1aa; font-size: 13px;">&nbsp;/&nbsp;{{ $invoice->company_name }}</span>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px;">

                            <h1 style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #18181b;">Invoice {{ $invoice->invoice_number }}</h1>
                            <p style="margin: 0 0 24px; font-size: 14px; color: #71717a;">Hi {{ $invoice->client_name }}, your invoice from {{ $invoice->company_name }} is attached as a PDF.</p>

                            <!-- Amount due panel -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="margin: 0 0 2px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">Amount due</p>
                                        <p style="margin: 0; font-size: 22px; font-weight: 600; color: #18181b;">${{ number_format((float) $invoice->total, 2) }}</p>
                                    </td>
                                    <td align="right" style="padding: 16px;">
                                        <p style="margin: 0 0 2px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">Due date</p>
                                        <p style="margin: 0; font-size: 14px; font-weight: 500; color: #18181b;">{{ \Illuminate\Support\Carbon::parse($invoice->due_date)->format('M j, Y') }}</p>
                                    </td>
                                </tr>
                            </table>

                            @if ($invoice->company_email)
                                <p style="margin: 0 0 6px; font-size: 13px; color: #3f3f46;">
                                    Questions about this invoice? Email
                                    <a href="mailto:{{ $invoice->company_email }}" style="color: #18181b; text-decoration: underline;">{{ $invoice->company_email }}</a>.
                                </p>
                            @endif
                            <p style="margin: 0; font-size: 12px; color: #a1a1aa;">This is an auto-generated message — replies are not monitored.</p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <p style="margin: 0; font-size: 12px; color: #a1a1aa;">Powered by Invoicify</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
