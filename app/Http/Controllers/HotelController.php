<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Inertia\Inertia;

class HotelController extends Controller
{
    /**
     * Show the list of hotels
     */
    public function index()
    {
        // Fetch all hotels from the database ordered by newest first
        $hotels = Tenant::orderBy('created_at', 'desc')->get();

        // Return an Inertia response and pass hotels data to the frontend
        return Inertia::render('hotels', [
            'hotels' => $hotels,
        ]);
    }

    /**
     * Store a new hotel in the database
     */
    public function store(Request $request)
    {
        // Validate incoming request data from the form
        $data = $request->validate([
            'hotel_name' => 'required|string|max:255',     // Hotel name must exist and be text
            'address' => 'required|string|max:255',        // Address must exist and be text
            'contact_number' => 'required|string|max:255', // Contact number must exist and be text
        ]);

        // Create a new hotel record using validated data
        $hotel = Tenant::create($data);

        // Redirect back to the hotels index page after saving
        return redirect()->route('hotels.index');
    }

    /**
     * Update an existing hotel
     */
    public function update(Request $request, $id)
    {
        // Find the hotel by ID or fail with 404
        $hotel = Tenant::findOrFail($id);

        // Validate updated data from the request
        $data = $request->validate([
            'hotel_name' => 'required|string|max:255',     // Hotel name is required
            'address' => 'required|string|max:255',        // Address is required
            'contact_number' => 'required|string|max:255', // Contact number is required
        ]);

        // Update the hotel record with new data
        $hotel->update($data);

        // Redirect back to the hotels index page
        return redirect()->route('hotels.index');
    }

    public function destroy($id)
    {
    // Find the hotel by its ID
    // If it does not exist, Laravel automatically returns a 404 error
    $hotel = Tenant::findOrFail($id);

    // Delete the hotel record from the database
    $hotel->delete();

    // Redirect back to the hotels list page after deletion
    return redirect()->route('hotels.index');
    }


}
