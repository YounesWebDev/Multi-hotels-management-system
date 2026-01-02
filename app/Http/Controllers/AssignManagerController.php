<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignManagerController extends Controller
{
    // Display the assign manager page
    public function index(){
        // Get all users with role = manager
        $managers = User::where('role','manager')->get();

        // Get all hotels (tenants)
        $hotels = Tenant::all();

        // Prepare managers with their assigned hotels
        $managerAssignments = $managers->map(function ($manager) use ($hotels) { 
            // Find the hotel assigned to the manager (if any)
            $hotel = $manager->tenant_id 
                ? $hotels->firstWhere('tenant_id',$manager->tenant_id) 
                : null;

            // Return formatted manager data
            return[
                'id' => $manager->id,
                'name' =>$manager->name,
                'email' => $manager->email,
                'is_active' => $manager->is_active, // manager active status
                'hotel' => $hotel ? [
                    'tenant_id' => $hotel->tenant_id,
                    'hotel_name' =>$hotel->hotel_name,
                ] : null,
            ];
        });

        // Prepare hotels with their assigned managers
        $hotelAssignments = $hotels->map(function ($hotel) use ($managers) {
            // Find the manager assigned to this hotel
            $manager = $managers->firstWhere('tenant_id' , $hotel->tenant_id);

            // Return formatted hotel data
            return [
                'tenant_id' => $hotel->tenant_id,
                'hotel_name'=> $hotel->hotel_name,
                'manager' => $manager ? [
                    'id' => $manager->id,
                    'name' => $manager->name,
                    'email' => $manager->email
                ] : null,
            ];
        });

        // Send data to Inertia frontend
        return Inertia::render('assign-manager', [
            'managers' => $managerAssignments,
            'hotels' => $hotelAssignments,
        ]);
    }
    //Unassign a manager
    public function unassign($managerId){
        // Find the manager
        $manager = \App\Models\User::where('role','manager')->findOrFail($managerId);

        // Remove manager from any hotel
        $manager->tenant_id = null;

        //save the modifications in db
        $manager->save();

        // Redirect back to assign manager page
        return redirect()->route('assign-manager');
    }

    // Assign a manager to a hotel
    public function assign(Request $request , $managerId){
        // Validate tenant ID
        $request->validate([
            'tenant_id' => 'required|exists:tenants,tenant_id',

        ]);
        
        //get the manager from the db
        $manager = \App\Models\User::where('role','manager')->findOrFail($managerId);

        //assign the manager 
        $manager->tenant_id = $request->tenant_id;

        //save the modifications in db
        $manager->save();

        return redirect()->route('assign-manager');
        
    }

    // Toggle user active/inactive status
    public function toggleActive($id){
        // Find the user
        $user = User::findOrFail($id);

        // Toggle active status
        $user->is_active = !$user->is_active;
        $user->save();

        // Redirect back with success message
        return back()->with('success','User status updated!');
    }
}
