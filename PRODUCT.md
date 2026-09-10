# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: operations/admin staff at an IT company sending invoices to their clients and getting paid. They create, edit, send, and track invoices, manage clients, review/approve payments, and maintain company settings.

Secondary: clients of the IT company. They log into a client portal to view invoices, download PDFs, and submit/track payments.

Open decision: exact internal titles for the admin role (ops, billing, admin) are not confirmed; routes enforce `auth.admin` vs `auth.client` separation.

## Product Purpose

Invoicify lets a small IT company issue accurate invoices and collect payment without SaaS overhead. Admins produce invoices with line items and automatic subtotal/tax/total math, send them as PDF email attachments, and track draft/sent/paid/overdue states. Clients self-serve invoices and payments through a portal.

Success means invoices go out quickly, totals are always correct, and clients can view and pay with minimal back-and-forth.

## Positioning

A simple self-hosted invoicing tool the company owns and runs itself. No subscription bloat, no external billing platform lock-in: minimal setup, company-controlled data, PDF + email built in, and a client payment portal.

## Operating Context

Core workflows, confirmed from routes and README:

- Admin: register/login/logout; list/create/edit/view/delete invoices with line items; send invoice by email with PDF attached; download PDF; list/view clients; update company settings (logo upload, invoice defaults); list/view/approve/reject payments.
- Client: login; portal dashboard listing own invoices; view invoice detail; download PDF; list/create/view payments.
- Supporting rituals: storage symlink for logo uploads; migrate/seed for test accounts (`admin@company.com` / `user@company.com`); Mailtrap sandbox capture for testing email before real delivery.

Environment: desktop-first web app (Laravel 12 + Inertia.js + React 19 + Tailwind CSS v4 + shadcn/ui). SQLite by default, MySQL optional.

## Capabilities and Constraints

Confirmed capabilities:

- Auth with admin/client role separation and separate route groups.
- Invoice CRUD with line items, automatic calculations, statuses (draft, sent, paid, overdue).
- Company settings with logo upload and invoice defaults.
- PDF generation via DomPDF; email via Laravel Mailables (Mailtrap sandbox supported, Gmail SMTP alternative).
- Client portal and client/admin payment flows.

Constraints and facts to preserve:

- Invoice money math accuracy is non-negotiable.
- Role separation (admin vs client) and per-client invoice scoping must hold.
- Implementation may be simplified or evolved; stack is not locked beyond what the codebase already uses (user chose "simplify allowed").

Explicitly undecided: payment methods/rails accepted in the portal; tax rules per region; multi-company or multi-currency needs; real sending domain for production mail.

## Evidence on Hand

- `README.md`: feature list, tech stack table, install/dev commands, Mailtrap setup, project structure.
- `routes/web.php`: admin invoice/client/settings/payment routes; client dashboard/invoice/payment routes.
- `resources/js/Pages/`, `resources/js/components/` (incl. `AppLayout.jsx`, `InvoiceForm.jsx`, `ui/` shadcn primitives).
- `app/Http/Controllers/`, `app/Models/` (User, Invoice, InvoiceItem, CompanySettings), `app/Mail/InvoiceMail`.

Absences future work must not fabricate: no testimonials, customers, case studies, benchmarks, pricing, or production mail domain. No logo/brand assets confirmed beyond the Invoicify name and shadcn-based UI.

## Product Principles

1. Accuracy first: totals, taxes, statuses, and per-client scoping are always right.
2. Simplest self-hosted path: prefer the minimal flow that ships an invoice and collects payment.
3. Respect the two sides: admin control and client self-service stay separate and obvious.
4. Own the data: company-controlled storage, portable DB, no hidden SaaS dependency.
5. Evolvable over clever: keep the implementation easy to simplify or replace.
