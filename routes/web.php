<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CompanySettingsController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [AuthController::class, 'store'])->name('register.store');

Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');
Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPDF'])->name('invoices.pdf');

Route::get('/settings', [CompanySettingsController::class, 'index'])->name('settings.index');
Route::post('/settings', [CompanySettingsController::class, 'update'])->name('settings.update');
Route::post('/settings/logo', [CompanySettingsController::class, 'uploadLogo'])->name('settings.uploadLogo');
