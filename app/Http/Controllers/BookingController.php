<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Show the bookings page (Inertia page).
     * Sends bookings + guests + rooms to the React page.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all data for the current tenant only
        $bookings = Booking::where('tenant_id', $user->tenant_id)->get();
        $guests   = Guest::where('tenant_id', $user->tenant_id)->get();
        $rooms    = Room::where('tenant_id', $user->tenant_id)->get();

        // Must match your React page path: resources/js/Pages/Bookings/index.tsx
        return Inertia::render('Bookings/index', [
            'tenant_id' => $user->tenant_id,
            'bookings'  => $bookings,
            'guests'    => $guests,
            'rooms'     => $rooms,
        ]);
    }

    /**
     * Create a new booking.
     * Validate, attach tenant_id, then create.
     * Redirect back to index (Inertia best practice).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Validation: these errors will automatically be sent to Inertia
        $data = $request->validate([
            'guest_id'  => ['required'],
            'room_id'   => ['required'],
            'check_in'  => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        // Always force tenant_id from the logged-in user (security)
        $data['tenant_id'] = $user->tenant_id;

        Booking::create($data);

        // Redirect instead of rendering
        return redirect()->route('bookings.index');
    }

    /**
     * Update an existing booking (tenant-safe).
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        // Find booking ONLY inside current tenant (security)
        $booking = Booking::where('tenant_id', $user->tenant_id)->findOrFail($id);

        $data = $request->validate([
            'guest_id'  => ['required'],
            'room_id'   => ['required'],
            'check_in'  => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        $booking->update($data);

        return redirect()->route('bookings.index');
    }

    /**
     * Delete a booking (tenant-safe).
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        // Delete only inside current tenant (security)
        Booking::where('tenant_id', $user->tenant_id)->where('booking_id', $id)->delete();

        return redirect()->route('bookings.index');
    }

    /**
     * Optional: show one booking as JSON (only if you need API).
     * If not used, you can remove this.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $booking = Booking::where('tenant_id', $user->tenant_id)->findOrFail($id);

        return response()->json($booking);
    }
}
