<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CompanySettingsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientInvoiceController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ClientPaymentController;
use App\Http\Controllers\AdminPaymentController;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Auth/Login'))->name('login');

Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [AuthController::class, 'store'])->name('register.store');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Routes (protected by admin middleware)
Route::middleware('auth.admin')->group(function () {
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create/{client_id?}', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPDF'])->name('invoices.pdf');

    Route::get('/clients', [ClientsController::class, 'index'])->name('clients.index');
    Route::get('/clients/{client}', [ClientsController::class, 'show'])->name('clients.show');

    Route::get('/settings', [CompanySettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [CompanySettingsController::class, 'update'])->name('settings.update');

    // Admin Payment Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        Route::get('/payments/{payment}', [AdminPaymentController::class, 'show'])->name('payments.show');
        Route::post('/payments/{payment}/approve', [AdminPaymentController::class, 'approve'])->name('payments.approve');
        Route::post('/payments/{payment}/reject', [AdminPaymentController::class, 'reject'])->name('payments.reject');
    });
});

// Client Routes
Route::prefix('client')->name('client.')->group(function () {
    Route::middleware('auth.client')->group(function () {
        Route::get('/dashboard', [ClientInvoiceController::class, 'index'])->name('dashboard');
        Route::get('/invoices/{invoice}', [ClientInvoiceController::class, 'show'])->name('invoices.show');
        Route::get('/invoices/{invoice}/pdf', [ClientInvoiceController::class, 'downloadPDF'])->name('invoices.pdf');

        // Client Payment Routes
        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [ClientPaymentController::class, 'index'])->name('index');
            Route::get('/create', [ClientPaymentController::class, 'create'])->name('create');
            Route::post('/', [ClientPaymentController::class, 'store'])->name('store');
            Route::get('/{payment}', [ClientPaymentController::class, 'show'])->name('show');
        });
    });
});
