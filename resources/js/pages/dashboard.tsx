import { Head,usePage } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Dialog , DialogContent , DialogHeader , DialogTitle , DialogDescription , DialogClose } from "@/components/ui/dialog";
import {Users , Bed , CalendarCheck2 , Building2 , UserCog, User} from 'lucide-react';
import React, {useState} from "react";
import AppLayout from "@/layouts/app-layout";

// Room structure received from Laravel
interface Room {
    room_id : number ;
    room_number: string;
    type: string;
    price_per_night: string;
    status: string;
}

// Hotel structure including rooms
interface Hotel {
    tenant_id: number;
    hotel_name:string;
    address:string;
    contact_number:string;
    rooms:Room[];
}

export default function Dashboard() {
    // Get props sent from Laravel controller
    const {
        isAdmin,
        hotels,
        hotel,
        guestsCount,
        roomsCount,
        bookingsCount,
        totalHotels,
        totalRooms,
        totalManagers,
        totalGuests,
        auth
    } = usePage().props as unknown as any;

    // Current logged-in user
    const user = auth?.user;

    // Guard: manager with no assigned hotel
    if(user?.role === 'manager' && !user?.tenant_id){
        return (
            <AppLayout breadcrumbs={[{title: 'Dashboard', href:'/dashboard'}]}>
                <Head title="Dashboard"/>
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-xl font-bold text-gray-600" >
                        You're not a manager of any hotel yet.
                    </h1>
                </div>
            </AppLayout>
        );
    }

    // Dialog state to show hotel details
    const [open , setOpen] = useState(false);
    const [selectedHotel , setSelectedHotel] = useState<Hotel | null>(null);

    // Handle hotel card click
    const handleHotelClick = (hotel : Hotel) => {
        setSelectedHotel(hotel);
        setOpen(true);
    }

    // Admin dashboard view
    if (isAdmin) {
        const safeHotels: Hotel[] = Array.isArray(hotels) ? hotels : [];
        return(
            <AppLayout breadcrumbs={[{ title:'Dashboard' , href: '/dashboard' }]}>
                <Head title="Admin Dashboard" />
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6">All Hotels Overview</h1> {/* Summary cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                            {/* Total Hotels Card */}
                            <Card className="p-6 text-center  bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <Building2 className="mx-auto mb-2 text-blue-500" size={32}/>
                                <div className="text-lg font-semibold mb-2">Total Hotels</div>
                                <div className="text-3xl font-bold">{totalHotels ?? 0}</div>
                            </Card>

                            {/* Total Rooms Card */}
                            <Card className="p-6 text-center bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <Bed className="mx-auto mb-2 text-green-500" size={32}/>
                                <div className="text-lg font-semibold mb-2">Total Rooms</div>
                                <div className="text-3xl font-bold">{totalRooms ?? 0}</div>
                            </Card>

                            {/* Total Managers Card */}
                            <Card className="p-6 text-center bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                                <UserCog className="mx-auto mb-2 text-purple-500" size={32}/>
                                <div className="text-lg font-semibold mb-2">Total Managers</div>
                                <div className="text-3xl font-bold">{totalManagers ?? 0}</div>
                            </Card>

                            {/* Total Guests Card */}
                            <Card className="p-6 text-center bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                                <User className="mx-auto mb-2 text-yellow-500" size={32}/>
                                <div className="text-lg font-semibold mb-2">Total Guests</div>
                                <div className="text-3xl font-bold">{totalGuests ?? 0}</div>
                            </Card>

                            {/* List of hotels */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {safeHotels.map((hotel:Hotel) =>(
                                    <button key={hotel.tenant_id}
                                        className="text-left w-full focus:outline-none"
                                        onClick={()=> handleHotelClick(hotel)}
                                        type="button">
                                        <Card className="p-6 hover:shadow-lg md:px-1 transition-shadow cursor-pointer">
                                            <div className="flex items-center mb-2">
                                                <Building2 className="ml-2 mr-2 text-blue-500" />
                                                <span className="text-lg font-semibold text-center" >{hotel.hotel_name}</span>
                                            </div>
                                        </Card>
                                    </button>
                                ))}
                            </div>

                            {/* Hotel details modal */}
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{selectedHotel?.hotel_name}</DialogTitle>
                                        <DialogDescription>
                                            <div className="mb-2 text-sm tex-gray-600 dark:text-gray-300">
                                                Address: {selectedHotel?.address}
                                            </div>
                                            <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                                Contact: {selectedHotel?.contact_number}
                                            </div>
                                            <div className="font-medium mb-1">Rooms:</div>
                                            <ul className="ml-4 list-disc">
                                                {selectedHotel?.rooms && selectedHotel.rooms.length>0 ? 
                                                    (selectedHotel.rooms.map(( room:Room ) => (
                                                        <li key={room.room_id} className="flex items-center text-sm mb-1">
                                                            <Bed className="mr-1 text-green-500" size={16} />
                                                            Room {room.room_number} - {room.type} - {room.status} - ${room.price_per_night}
                                                        </li>
                                                    )))
                                                    :
                                                    (<li className="text-xs text-gray-400">No rooms</li>)
                                                }
                                            </ul>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
            </AppLayout>
        );
    }

    // Manager dashboard
    const safeHotel:Hotel | undefined = hotel;
    const safeGuestsCount = guestsCount || 0 ;
    const safeRoomsCount = roomsCount || 0;
    const safeBookingsCount = bookingsCount || 0;
    
    return (
        <AppLayout breadcrumbs={[{title:'Dashboard' , href: '/dashboard'}]}>
            <Head title="Dashboard"/>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    {safeHotel && safeHotel.hotel_name ? safeHotel.hotel_name : 'Hotel Dashboard'}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                        <Users className="mx-auto mb-2 text-blue-500" size={32}/>
                        <div className="text-lg font-semibold mb-2">Total Guests</div>
                        <div className="text-3xl font-bold">{safeGuestsCount}</div>
                    </Card>
                    <Card className="p-6 text-center">
                        <Bed className="mx-auto mb-2 text-green-500" size={32}/>
                        <div className="text-lg font-semibold mb-2">Total Rooms</div>
                        <div className="text-3xl font-bold">{safeRoomsCount}</div>
                    </Card>
                    <Card className="p-6 text-center">
                        <CalendarCheck2 className="mx-auto mb-2 text-purple-500" size={32}/>
                        <div className="text-lg font-semibold mb-2">Total Bookings</div>
                        <div className="text-3xl font-bold">{safeBookingsCount}</div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
