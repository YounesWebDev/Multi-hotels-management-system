<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $room = Room::where('tenant_id', $user->tenant_id)->findOrFail($data['room_id']);

        if ($room->status !== 'available') {
            return back()->withErrors([
                'room_id' => ['Selected room is not available.'],
            ]);
        }

        DB::transaction(function () use ($data, $room) {
            Booking::create($data);
            $room->update(['status' => 'occupied']);
        });

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
        $previousRoomId = $booking->room_id;

        $data = $request->validate([
            'guest_id'  => ['required'],
            'room_id'   => ['required'],
            'check_in'  => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        $room = Room::where('tenant_id', $user->tenant_id)->findOrFail($data['room_id']);

        if ($previousRoomId !== $room->room_id && $room->status !== 'available') {
            return back()->withErrors([
                'room_id' => ['Selected room is not available.'],
            ]);
        }

        DB::transaction(function () use ($booking, $data, $previousRoomId, $room, $user) {
            if ($previousRoomId !== $room->room_id) {
                $previousRoom = Room::where('tenant_id', $user->tenant_id)
                    ->where('room_id', $previousRoomId)
                    ->first();

                if ($previousRoom) {
                    $previousRoom->update(['status' => 'available']);
                }
            }

            $booking->update($data);
            $room->update(['status' => 'occupied']);
        });

        return redirect()->route('bookings.index');
    }

    /**
     * Delete a booking (tenant-safe).
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        // Delete only inside current tenant (security)
        $booking = Booking::where('tenant_id', $user->tenant_id)->findOrFail($id);

        DB::transaction(function () use ($booking, $user) {
            $roomId = $booking->room_id;
            $booking->delete();

            $room = Room::where('tenant_id', $user->tenant_id)
                ->where('room_id', $roomId)
                ->first();

            if ($room) {
                $room->update(['status' => 'available']);
            }
        });

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
