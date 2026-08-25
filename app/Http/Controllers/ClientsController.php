<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientsController extends Controller
{
    public function index()
    {
        $clients = Client::withCount('invoices')->get();

        return inertia('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function show(Client $client)
    {
        $client->load(['invoices' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'invoices.items']);

        return inertia('Clients/Show', [
            'client' => $client,
        ]);
    }
}
