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
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'default_tax_rate' => 'required|numeric|min:0',
            'invoice_notes' => 'nullable|string',
        ]);

        $settings = CompanySettings::getSettings();
        $settings->update($validated);

        return back()->with('success', 'Settings updated successfully');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $settings = CompanySettings::getSettings();
            $settings->update(['logo_path' => $path]);
            
            return redirect()->route('settings.index')->with('success', 'Logo uploaded successfully');
        }

        return redirect()->route('settings.index')->with('error', 'Failed to upload logo');
    }
}
