<?php

namespace App\Http\Controllers;

use App\Models\Guest; // Guest model
use Illuminate\Http\Request; // Handle HTTP requests
use Inertia\Inertia; // Inertia rendering
use LDAP\Result; // Unused import

class GuestController extends Controller
{
    // Display all guests for the tenant
    public function index(Request $request){
        $user = $request->user(); // Authenticated user
        $guests = Guest::where('tenant_id' , $user->tenant_id)->get(); // Tenant guests

        return Inertia::render('Guests/index' , [
            'guests' => $guests, // Send guests
            'tenant_id' => $user->tenant_id // Send tenant ID
        ]);
    }

    // Store a new guest
    public function store(Request $request) {
        $user = $request->user(); // Authenticated user
        $data = $request->all(); // Request data
        $data['tenant_id'] = $user->tenant_id; // Assign tenant
        Guest::create($data); // Create guest

        $guests = Guest::where('tenant_id',$user->tenant_id)->get(); // Reload guests

        return Inertia::render('Guests/index' , [
            'guests' => $guests,
            'tenant_id' => $user->tenant_id
        ]);
    }

    // Show one guest
    public function show($id) {
        return response()->json(Guest::findOrFail($id)); // Return guest as JSON
    }

    // Update a guest
    public function update(Request $request , $id) {
        $user = $request->user(); // Authenticated user
        $guest = Guest::findOrFail($id); // Find guest
        $guest = Guest::update($request->all()); // Incorrect update
        $guests = Guest::where('tenant_id', $user->tenant_id)->get(); // Reload guests

        return Inertia::render('Guests/index' , [
            'tenant_id' => $user->tenant_id,
            'guests' => $guest // Sends single guest
        ]);
    }

    // Delete a guest
    public function destroy($id) {
        $user = request()->user(); // Authenticated user
        Guest::destroy($id); // Delete guest
        $guests = Guest::where('tenant_id',$user->tenant_id)->get(); // Reload guests

        return Inertia::render('Guests/index' , [
            'tenant_id' => $user->tenant_id,
            'guests' => $guests
        ]);
    }
}
