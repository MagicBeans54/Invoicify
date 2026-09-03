<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable;

    // Don't use SerializesModels to avoid encoding issues with queued jobs
    // Instead, we'll manually handle the data

    public int $invoiceId;
    public string $pdf;
    public array $invoiceData;

    public function __construct(Invoice $invoice, string $pdf)
    {
        $this->invoiceId = $invoice->id;
        $this->pdf = base64_encode($pdf);

        // Store only the necessary invoice data in a clean array
        $this->invoiceData = [
            'invoice_number' => $this->cleanUtf8($invoice->invoice_number),
            'company_name' => $this->cleanUtf8($invoice->company_name),
        ];
    }

    private function cleanUtf8($string): string
    {
        if (empty($string)) return '';
        if (!mb_check_encoding($string, 'UTF-8')) {
            $string = mb_convert_encoding($string, 'UTF-8', 'UTF-8');
        }
        return mb_convert_encoding($string, 'UTF-8', 'UTF-8');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Invoice {$this->invoiceData['invoice_number']} from {$this->invoiceData['company_name']}",
        );
    }

    public function content(): Content
    {
        // Reload the invoice from database for the view
        $invoice = Invoice::find($this->invoiceId);
        if (!$invoice) {
            throw new \Exception("Invoice not found: {$this->invoiceId}");
        }

        return new Content(
            view: 'emails.invoice',
            with: ['invoice' => $invoice],
            text: 'emails.invoice-text',
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => base64_decode($this->pdf))
                ->as("invoice-{$this->invoiceData['invoice_number']}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
