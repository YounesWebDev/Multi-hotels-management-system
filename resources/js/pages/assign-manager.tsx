import AppLayout from "@/layouts/app-layout";
import { Head , usePage , router } from "@inertiajs/react";
import {Users } from 'lucide-react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

interface Manager {
    id:number;
    name:string;
    email:string;
    hotel:{ tenant_id: number; hotel_name:string; } | null;
    is_active:boolean;
}

interface Hotel {
    tenant_id: number;
    hotel_name:string;
    manager: { id:number , name:string ; email:string } | null;
}

export default function AssignManger() {
    
    const {managers , hotels } = usePage().props as unknown as { managers : Manager[] , hotels: Hotel[]};
    const [loading , setLoading] = useState(false);
    const unassignedHotels = hotels.filter(h => !h.manager);
    const handleAssign = (managerId : number , tenantId: number) => {
        setLoading(true);
        router.post(route('assign-manager.assign' , managerId) , { tenant_id: tenantId } , {
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false),
            preserveScroll: true,
        });
    }
    return (
    <AppLayout breadcrumbs={[{ title: 'Assign Manager ' , href:'/assign-manager' }]}>
        <Head title="Assign Manager"/>
        <div className="p-6">
            <div className="flex items-center mb-4">
                <Users className="mr-2 text-blue-500" size={32}/>
                <h1 className="text-2xl font-bold">Assign Manager</h1>
            </div>
            <div className="overflow-x-auto rounded-lg shadow border dark:border-r-gray-700">
                <table className="min-w-full bg-white dark:bg-gray-900">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Assigned Hotel</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managers && managers.length > 0 ? managers.map((manager) => (
                            <tr key={manager.id} className="border-t dark:border-gray-700">
                                <td className="px-4 py-2 font-medium">{manager.name}</td>
                                <td className="px-4 py-2 font-medium">{manager.email}</td>
                                <td className="px-4 py-2 font-medium">
                                    {manager.hotel ? (
                                        <div className="flex items-center gap-2">
                                            {manager.hotel.hotel_name}
                                            <Button size='sm'
                                            variant='outline'
                                            onClick={() => router.post(route('assign-manager.unassign' , manager.id))}
                                            >Unassign</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit = { e => {
                                            const formData = new FormData(e.currentTarget);
                                            const tenantId = Number(formData.get('tenant_id'));
                                            if(tenantId) handleAssign(manager.id , tenantId);
                                        }}>
                                            <select name="tenant_id" 
                                                    className="rounded border px-2 py-1 dark:bg-gray-800 dark:border-gray-700 mr-2"
                                                    required
                                                    defaultValue=""
                                                    disabled={loading || unassignedHotels.length === 0}
                                                    >
                                                        <option value="" disabled>Select hotel ...</option>
                                                        {hotels && hotels.length > 0 ? unassignedHotels.map(hotel => (
                                                            <option key={hotel.tenant_id} value={hotel.tenant_id}>{hotel.hotel_name}</option>
                                                        )
                                                        ) : 
                                                        <option disabled value="">there is no hotels</option>
                                                        }
                                                    </select>
                                                    <Button size='sm' type="submit" disabled ={loading || unassignedHotels.length === 0}>
                                                    Assign
                                                    </Button>
                                        </form>
                                    )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={manager.is_active ? "text-green-600" : "text-red-600"}>
                                            {manager.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button size='sm'
                                        variant={manager.is_active ? "destructive" : "default"}
                                        onClick={() => router.post(route('user.toggleActive', manager.id))}>
                                            {manager.is_active ? "Disactivate" : "Activate"}
                                        </Button>
                                    </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">No managers found.</td>
                            </tr>
                        )}
                    </tbody> 
                </table>
            </div>

        </div>
    </AppLayout>
    )
}
