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
                </table>
            </div>

        </div>
    </AppLayout>
    )
}
