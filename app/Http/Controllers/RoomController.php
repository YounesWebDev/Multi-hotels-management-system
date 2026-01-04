<?php

namespace App\Http\Controllers;

use App\Models\Room; // Import Room model
use Illuminate\Http\Request; // Import Request class
use Inertia\Inertia; // Import Inertia for frontend rendering

class RoomController extends Controller
{
    // Display all rooms for the authenticated user's tenant
    public function index(Request $request){
        $user = $request->user(); // Get authenticated user
        $rooms = Room::where('tenant_id', $user->tenant_id)->get(); // Get rooms for tenant

        return Inertia::render('Rooms/index',[
            "rooms" => $rooms, // Pass rooms to frontend
            "tenant_id" => $user->tenant_id // Pass tenant ID
        ]);
    }

    // Store a new room
    public function store(Request $request) {
        $user = $request->user(); // Get authenticated user
        $data = $request->all(); // Get request data
        $data['tenant_id'] = $user->tenant_id; // Assign tenant ID
        Room::create($data); // Create room

        $rooms = Room::where('tenant_id',$user->tenant_id)->get(); // Reload rooms

        return Inertia::render('Rooms/index',[
            'rooms' => $rooms, // Send rooms
            'tenant_id' => $user->tenant_id, // Send tenant ID
        ]);
    }

    // Show a single room as JSON
    public function show($id){
        return response()->json(Room::findOrFail($id)); // Return room or 404
    }

    // Update an existing room
    public function update(Request $request, $id){
        $user = $request->user(); // Get authenticated user
        $room = Room::findOrFail($id); // Find room
        $room->update($request->all()); // Update room data

        $rooms = Room::where('tenant_id' , $user->tenant_id)->get(); // Reload rooms

        return Inertia::render('Rooms/index' , [
            'rooms' => $rooms, // Send updated rooms
            'tenant_id' => $user->tenant_id // Send tenant ID
        ]);
    }

    // Delete a room
    public function destroy($id){
        $user = request()->user(); // Get authenticated user
        Room::destroy($id); // Delete room

        $rooms = Room::where('tenant_id',$user->tenant_id)->get(); // Get rooms query

        return Inertia::render('Rooms/index',[
            'rooms' => $rooms, // Send rooms
            'tenant_id' => $user->tenant_id // Send tenant ID
        ]);
    }
}
