# Invoicify

A professional invoice generation system built with **Laravel 12**, **Inertia.js**, and **React**, styled with **shadcn/ui** and **Tailwind CSS v4**.

## Features

- User authentication (register / login / logout)
- Invoice management — create, edit, view, and delete invoices with line items
- Automatic subtotal, tax, and total calculations
- Multiple invoice statuses (draft, sent, paid, overdue)
- Company settings with logo upload and invoice defaults
- PDF invoice generation via [barryvdh/laravel-dompdf](https://github.com/barryvdh/laravel-dompdf)
- Email invoices to clients as PDF attachments via SMTP
- Clean, minimal UI using shadcn/ui components with dark-mode-ready design tokens

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Laravel 12, PHP 8.2+                        |
| Frontend  | React 19, Inertia.js, Ziggy                 |
| Styling   | Tailwind CSS v4, shadcn/ui, lucide-react    |
| PDF       | DomPDF                                      |
| Mail      | Laravel Mailables over SMTP                 |

## Getting Started

### Requirements

- PHP 8.2+
- Composer
- Node.js 20+

### Installation

```bash
git clone <repository-url>
cd Invoicify

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations and seed test accounts
php artisan migrate --seed

# Build frontend assets
npm run build
```

### Development

```bash
composer run dev
```

Or run the servers separately:

```bash
php artisan serve   # backend at http://localhost:8000
npm run dev         # Vite dev server
```

## Test Accounts

After running `php artisan db:seed`, you can log in with:

| Role  | Email             | Password      |
|-------|-------------------|---------------|
| Admin | admin@company.com | `password123` |
| User  | user@company.com  | `password123` |

## Mail Configuration

The app uses [Mailtrap](https://mailtrap.io) over its HTTP API (`railsware/mailtrap-php`), so no SMTP ports are required:

```env
MAIL_MAILER=mailtrap-sdk
MAILTRAP_API_KEY=your-api-key
MAILTRAP_HOST=sandbox.api.mailtrap.io
MAILTRAP_INBOX_ID=123456
```

Get the key from Mailtrap → **Settings → API Keys**. The config above uses Mailtrap's **sandbox**, which captures emails in the Mailtrap dashboard instead of delivering them — ideal for testing. Find your numeric inbox ID under **Email Testing → Inboxes → Settings**. To deliver to real recipients, remove `MAILTRAP_HOST`/`MAILTRAP_INBOX_ID` and verify your sending domain in Mailtrap (**Email Sending → Domains**).

> Gmail SMTP is still supported as an alternative — set `MAIL_MAILER=smtp` with the credentials below:
>
> ```env
> MAIL_HOST=smtp.gmail.com
> MAIL_PORT=587
> MAIL_USERNAME=your-email@gmail.com
> MAIL_PASSWORD=your-app-password
> MAIL_ENCRYPTION=tls
> MAIL_FROM_ADDRESS="your-email@gmail.com"
> ```
>
> Gmail users: create an [App Password](https://myaccount.google.com/apppasswords) rather than using your account password.

Once configured, open an invoice and click **Send** to email it to the client with the PDF attached.

## Project Structure

```
app/
├── Http/Controllers/     # Auth, Invoice, and Settings controllers
├── Mail/                 # InvoiceMail (mailable with PDF attachment)
└── Models/               # User, Invoice, InvoiceItem, CompanySettings

resources/js/
├── Pages/                # Inertia pages (Auth, Invoices, Settings)
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── AppLayout.jsx     # Shared app shell (header nav + flash messages)
│   └── InvoiceForm.jsx   # Shared create/edit invoice form
└── app.jsx               # Inertia entry point
```
