<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        if ($user->role === 'admin') {
            $hotels = \App\Models\Tenant::with(['rooms'])->get();
            $totalHotels = $hotels->count();
            $totalRooms = \App\Models\Room::count();
            $totalManagers = \App\Models\User::where('role' , 'manager')->count();
            $totalGuests = \App\Models\Guest::count();
            return \Inertia\Inertia::render('dashboard' , [
                'isAdmin' => true,
                'hotels' => $hotels,
                'totalHotels' => $totalHotels,
                'totalRooms' => $totalRooms,
                'totalManagers' => $totalManagers,
                'totalGuests' => $totalGuests,
            ]);
        }

        $tenantId = $user->tenant_id;
        $hotel = \App\Models\Tenant::where('tenant_id' , $tenantId)->first();
        $guestsCount = \App\Models\Guest::where('tenant_id', $tenantId)->count();
        $roomsCount = \App\Models\Room::where('tenant_id', $tenantId)->count();
        $bookingsCount = \App\Models\Booking::where('tenant_id',$tenantId)->count();

        return \Inertia\Inertia::render('dashboard', [
            'isAdmin' => false,
            'hotel' => $hotel,
            'guestCount' => $guestsCount,
            'roomsCount' => $roomsCount,
            'bookingsCount' => $bookingsCount
        ]);
    }
}
