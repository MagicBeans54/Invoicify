<?php

namespace App\Mail;

use App\Models\CompanySettings;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Invoice {$this->invoice->invoice_number} from {$this->invoice->company_name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice',
            text: 'emails.invoice-text',
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->buildPdf())
                ->as("invoice-{$this->invoice->invoice_number}.pdf")
                ->withMime('application/pdf'),
        ];
    }

    /**
     * Generate the invoice PDF at send time (inside the queued job), rather
     * than serializing raw binary PDF bytes into the queue payload (which is
     * not valid UTF-8 and breaks JSON-encoding of the job).
     */
    private function buildPdf(): string
    {
        $this->invoice->loadMissing('items');

        $companySettings = CompanySettings::getSettings();

        $logoPath = null;
        if ($companySettings->logo_path) {
            $logoPath = public_path('storage/' . $companySettings->logo_path);
        }

        return Pdf::loadView('invoices.pdf', [
            'invoice' => $this->invoice,
            'companySettings' => $companySettings,
            'logoPath' => $logoPath,
        ])->setPaper('a4')->output();
    }
}
