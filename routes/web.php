<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CompanySettingsController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPDF'])->name('invoices.pdf');

Route::get('/settings', [CompanySettingsController::class, 'index'])->name('settings.index');
Route::post('/settings', [CompanySettingsController::class, 'update'])->name('settings.update');
Route::post('/settings/logo', [CompanySettingsController::class, 'uploadLogo'])->name('settings.uploadLogo');
