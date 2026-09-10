<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Invoice;
use App\Models\Payment;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'stats' => function () use ($request) {
                $user = $request->user();
                if (! $user) {
                    return null;
                }
                if ($user->isAdmin()) {
                    return [
                        'overdueInvoices' => Invoice::where('status', 'overdue')->count(),
                        'pendingPayments' => Payment::where('status', 'pending')->count(),
                        'overdueItems' => Invoice::where('status', 'overdue')
                            ->orderByDesc('due_date')
                            ->take(5)
                            ->get(['id', 'invoice_number', 'client_name', 'total'])
                            ->map(fn ($i) => [
                                'id' => $i->id,
                                'invoice_number' => $i->invoice_number,
                                'client_name' => $i->client_name,
                                'total' => (string) $i->total,
                            ])
                            ->values()
                            ->all(),
                        'pendingItems' => Payment::where('status', 'pending')
                            ->with(['invoice:id,invoice_number'])
                            ->orderByDesc('created_at')
                            ->take(5)
                            ->get(['id', 'amount', 'invoice_id', 'reference_number'])
                            ->map(fn ($p) => [
                                'id' => $p->id,
                                'reference_number' => $p->reference_number,
                                'amount' => (string) $p->amount,
                                'invoice_number' => $p->invoice?->invoice_number,
                            ])
                            ->values()
                            ->all(),
                    ];
                }
                return [
                    'overdueInvoices' => Invoice::where('client_email', $user->email)
                        ->where('status', 'overdue')
                        ->count(),
                    'pendingPayments' => 0,
                    'overdueItems' => Invoice::where('client_email', $user->email)
                        ->where('status', 'overdue')
                        ->orderByDesc('due_date')
                        ->take(5)
                        ->get(['id', 'invoice_number', 'client_name', 'total'])
                        ->map(fn ($i) => [
                            'id' => $i->id,
                            'invoice_number' => $i->invoice_number,
                            'client_name' => $i->client_name,
                            'total' => (string) $i->total,
                        ])
                        ->values()
                        ->all(),
                    'pendingItems' => [],
                ];
            },
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ]);
    }
}
