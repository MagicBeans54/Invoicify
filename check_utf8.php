<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$payments = \App\Models\Payment::all();
foreach ($payments as $payment) {
    $hasIssue = false;
    if (!empty($payment->client_notes) && !mb_check_encoding($payment->client_notes, 'UTF-8')) {
        echo 'Payment ID ' . $payment->id . ' has invalid UTF-8 in client_notes' . PHP_EOL;
        $hasIssue = true;
    }
    if (!empty($payment->admin_notes) && !mb_check_encoding($payment->admin_notes, 'UTF-8')) {
        echo 'Payment ID ' . $payment->id . ' has invalid UTF-8 in admin_notes' . PHP_EOL;
        $hasIssue = true;
    }
    if (!empty($payment->reference_number) && !mb_check_encoding($payment->reference_number, 'UTF-8')) {
        echo 'Payment ID ' . $payment->id . ' has invalid UTF-8 in reference_number' . PHP_EOL;
        $hasIssue = true;
    }
    if ($hasIssue) {
        echo 'Payment ID ' . $payment->id . ' needs fixing' . PHP_EOL;
    }
}

$invoices = \App\Models\Invoice::all();
foreach ($invoices as $invoice) {
    $hasIssue = false;
    $fields = ['invoice_number', 'contract_number', 'company_name', 'company_email', 'company_phone', 'company_address', 'client_name', 'client_email', 'client_phone', 'client_address', 'notes', 'terms'];
    foreach ($fields as $field) {
        if (!empty($invoice->$field) && !mb_check_encoding($invoice->$field, 'UTF-8')) {
            echo 'Invoice ID ' . $invoice->id . ' has invalid UTF-8 in ' . $field . PHP_EOL;
            $hasIssue = true;
        }
    }
    if ($hasIssue) {
        echo 'Invoice ID ' . $invoice->id . ' needs fixing' . PHP_EOL;
    }
}

$users = \App\Models\User::all();
foreach ($users as $user) {
    $hasIssue = false;
    if (!empty($user->name) && !mb_check_encoding($user->name, 'UTF-8')) {
        echo 'User ID ' . $user->id . ' has invalid UTF-8 in name' . PHP_EOL;
        $hasIssue = true;
    }
    if (!empty($user->email) && !mb_check_encoding($user->email, 'UTF-8')) {
        echo 'User ID ' . $user->id . ' has invalid UTF-8 in email' . PHP_EOL;
        $hasIssue = true;
    }
    if ($hasIssue) {
        echo 'User ID ' . $user->id . ' needs fixing' . PHP_EOL;
    }
}

echo "Check complete." . PHP_EOL;
