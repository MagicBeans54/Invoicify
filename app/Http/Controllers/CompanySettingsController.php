<?php

namespace App\Http\Controllers;

use App\Models\CompanySettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanySettingsController extends Controller
{
    public function index()
    {
        $settings = CompanySettings::getSettings();
        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'default_tax_rate' => 'required|numeric|min:0',
            'invoice_notes' => 'nullable|string',
            'bank_account_name' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string',
            'bank_account_type' => 'nullable|string',
            'bank_address' => 'nullable|string',
            'default_terms' => 'nullable|string',
        ]);

        $settings = CompanySettings::getSettings();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($settings->logo_path) {
                $oldLogoPath = public_path('storage/' . $settings->logo_path);
                if (file_exists($oldLogoPath)) {
                    unlink($oldLogoPath);
                }
            }

            // Store new logo
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $logoPath;
        }

        // Remove logo from validated data since it's not a database field
        unset($validated['logo']);

        $settings->update($validated);

        return back()->with('success', 'Settings updated successfully');
    }
}
