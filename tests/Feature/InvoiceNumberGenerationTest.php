<?php

namespace Tests\Feature;

use App\Models\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceNumberGenerationTest extends TestCase
{
    use RefreshDatabase;

    private function createInvoice(array $attributes = []): Invoice
    {
        return Invoice::create(array_merge([
            'invoice_number' => 'INV-000-2026-08-28',
            'invoice_date' => '2026-08-28',
            'due_date' => '2026-09-28',
            'status' => 'draft',
            'company_name' => 'Techstacks',
            'client_name' => 'Acme Corp',
        ], $attributes));
    }

    public function test_first_invoice_for_client_and_date_gets_suffix_000(): void
    {
        $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');

        $this->assertSame('INV-000-2026-08-28', $number);
    }

    public function test_it_increments_the_highest_existing_suffix(): void
    {
        $this->createInvoice(['invoice_number' => 'INV-000-2026-08-28']);
        $this->createInvoice(['invoice_number' => 'INV-001-2026-08-28']);

        $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');

        $this->assertSame('INV-002-2026-08-28', $number);
    }

    public function test_it_finds_the_highest_suffix_regardless_of_string_order(): void
    {
        // INV-999 sorts above INV-1000 in string order, so the old
        // orderBy('invoice_number', 'desc') approach would pick INV-999
        // and generate a duplicate.
        $this->createInvoice(['invoice_number' => 'INV-999-2026-08-28']);
        $this->createInvoice(['invoice_number' => 'INV-1000-2026-08-28']);

        $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');

        $this->assertSame('INV-1001-2026-08-28', $number);
    }

    public function test_it_ignores_other_clients_and_other_dates(): void
    {
        $this->createInvoice(['invoice_number' => 'INV-005-2026-08-28', 'client_name' => 'Other Corp']);
        $this->createInvoice(['invoice_number' => 'INV-003-2026-08-27', 'invoice_date' => '2026-08-27']);

        $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');

        $this->assertSame('INV-000-2026-08-28', $number);
    }

    public function test_legacy_non_matching_numbers_do_not_cause_a_collision(): void
    {
        // The old fallback returned "INV-001-{date}" for non-matching numbers,
        // which could collide with an existing invoice number. A non-matching
        // number never ends in "INV-XXX-{date}", so INV-000-{date} is safe.
        $this->createInvoice(['invoice_number' => 'LEGACY-001']);

        $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');

        $this->assertSame('INV-000-2026-08-28', $number);

        $this->assertDatabaseHas('invoices', ['invoice_number' => 'LEGACY-001']);
    }

    public function test_created_invoice_numbers_are_unique_across_sequential_generations(): void
    {
        $numbers = [];

        for ($i = 0; $i < 12; $i++) {
            $number = Invoice::generateInvoiceNumber('Acme Corp', '2026-08-28');
            $this->createInvoice(['invoice_number' => $number]);
            $numbers[] = $number;
        }

        $this->assertCount(12, array_unique($numbers));
    }
}
