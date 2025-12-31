<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request) {
        // Get the currently logged-in user
        $user = $request->user();

        // Check if the user is an admin
        if ($user->role === 'admin') {
            // Get all hotels with their rooms
            $hotels = \App\Models\Tenant::with(['rooms'])->get();
            // Count totals for summary cards
            $totalHotels = $hotels->count();
            $totalRooms = \App\Models\Room::count();
            $totalManagers = \App\Models\User::where('role' , 'manager')->count();
            $totalGuests = \App\Models\Guest::count();

            // Render Inertia dashboard view for admin
            return \Inertia\Inertia::render('dashboard' , [
                'isAdmin' => true,
                'hotels' => $hotels,
                'totalHotels' => $totalHotels,
                'totalRooms' => $totalRooms,
                'totalManagers' => $totalManagers,
                'totalGuests' => $totalGuests,
            ]);
        }

        // For manager users: get their hotel id
        $tenantId = $user->tenant_id;
        // Fetch the hotel of this manager
        $hotel = \App\Models\Tenant::where('tenant_id' , $tenantId)->first();
        // Count hotel-related data
        $guestsCount = \App\Models\Guest::where('tenant_id', $tenantId)->count();
        $roomsCount = \App\Models\Room::where('tenant_id', $tenantId)->count();
        $bookingsCount = \App\Models\Booking::where('tenant_id',$tenantId)->count();

        // Render Inertia dashboard view for manager
        return \Inertia\Inertia::render('dashboard', [
            'isAdmin' => false,
            'hotel' => $hotel,
            'guestCount' => $guestsCount,
            'roomsCount' => $roomsCount,
            'bookingsCount' => $bookingsCount
        ]);
    }
}
