import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus, CalendarDays } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

/* ======================================================
    Types
====================================================== */

// Booking object shape coming from backend
interface Booking {
    booking_id: number;
    guest_id: number;
    room_id: number;
    check_in: string;
    check_out: string;
}

// Guest object shape
interface Guest {
    guest_id: number;
    first_name: string;
    last_name: string;
}

// Room object shape
interface Room {
    room_id: number;
    room_number: string;
    status: string;
}

/* ======================================================
    Initial empty form
====================================================== */

// Used to reset the form when opening / closing modal
const emptyForm = {
    guest_id: "",
    room_id: "",
    check_in: "",
    check_out: "",
};

export default function ManageBookings() {

    /* ======================================================
        Data from Inertia
    ====================================================== */

    // Props sent from BookingController@index
    const { bookings = [], guests = [], rooms = [] } = usePage().props as unknown as {
        bookings: Booking[];
        guests: Guest[];
        rooms: Room[];
    };

    // Safety checks to ensure arrays
    const bookingList = Array.isArray(bookings) ? bookings : [];
    const guestsList = Array.isArray(guests) ? guests : [];
    const roomsList = Array.isArray(rooms) ? rooms : [];

    /* ======================================================
        State
    ====================================================== */

    // Controls modal open/close
    const [open, setOpen] = useState(false);

    // Form data state
    const [form, setForm] = useState(emptyForm);

    // Loading state for submit button
    const [loading, setLoading] = useState(false);

    // Laravel validation errors
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    // Edit mode state
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Delete mode state
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    /* ======================================================
        Available rooms logic
    ====================================================== */

    // Filters rooms based on availability and booking rules
    const availableRooms = roomsList.filter((room: any) => {

        // Only available rooms
        if (room.status !== "available") return false;

        // Allow the same room when editing the current booking
        if (isEdit && form.room_id && String(room.room_id) === String(form.room_id)) {
            return true;
        }

        // Exclude rooms already booked by another booking
        const isBooked = bookingList.some((b: any) => {
            if (String(b.room_id) !== String(room.room_id)) return false;

            // Allow same room if editing this booking
            if (isEdit && editId && b.booking_id === editId) return false;

            return true;
        });

        if (isBooked) return false;

        // Prevent same guest from booking multiple rooms on same date
        if (form.guest_id && form.check_in) {
            const guestHasBooking = bookingList.some((b: any) => {
                if (isEdit && editId && b.booking_id === editId) return false;

                return (
                    String(b.guest_id) === String(form.guest_id) &&
                    b.check_in === form.check_in
                );
            });

            if (guestHasBooking) return false;
        }

        return true;
    });

    /* ======================================================
        Modal handlers
    ====================================================== */

    // Open "Add booking" modal
    const handleOpen = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setIsDelete(false);
        setEditId(null);
        setDeleteId(null);
        setOpen(true);
    };

    // Open "Edit booking" modal
    const handleOpenEdit = (booking: any) => {
        setForm({
            guest_id: booking.guest_id,
            room_id: booking.room_id,
            check_in: booking.check_in || "",
            check_out: booking.check_out || "",
        });
        setErrors({});
        setIsEdit(true);
        setIsDelete(false);
        setEditId(booking.booking_id);
        setOpen(true);
    };

    // Open "Delete booking" modal
    const handleOpenDelete = (id: number) => {
        setDeleteId(id);
        setIsDelete(true);
        setIsEdit(false);
        setOpen(true);
        setLoading(false);
    };

    // Close modal and reset state
    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setIsDelete(false);
        setEditId(null);
        setDeleteId(null);
    };

    /* ======================================================
        Form handlers
    ====================================================== */

    // Handle text/date input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit (create / update / delete)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // DELETE booking
        if (deleteId && isDelete) {
            router.delete(`/bookings/${deleteId}`, {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err: any) => {
                    setLoading(false);
                    setErrors(err);
                },
            });
            return;
        }

        // Validate selected room before submit
        const selectedRoom = roomsList.find(
            (r: any) => String(r.room_id) === String(form.room_id)
        );

        if (!selectedRoom || selectedRoom.status !== "available") {
            alert("Please select an available room!");
            setLoading(false);
            return;
        }

        // UPDATE booking
        if (isEdit && editId) {
            router.put(`/bookings/${editId}`, form, {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err: any) => {
                    setLoading(false);
                    setErrors(err);
                },
            });
            return;
        }

        // CREATE booking
        router.post("/bookings", form, {
            onSuccess: () => {
                setLoading(false);
                handleClose();
            },
            onError: (err: any) => {
                setLoading(false);
                setErrors(err);
            },
        });
    };

    /* ======================================================
        Render
    ====================================================== */

    return (
        <AppLayout breadcrumbs={[{ title: "Manage Bookings", href: "/bookings" }]}>
            <Head title="Manage Bookings" />

            <div className="p-6">

                {/* Page header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <CalendarDays className="mr-2 text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold">Manage Bookings</h1>
                    </div>

                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18} /> Add Booking
                    </Button>
                </div>

                {/* Bookings table */}
                <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                    <table className="min-w-full bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 text-left">Guest</th>
                                <th className="px-4 py-2 text-left">Room</th>
                                <th className="px-4 py-2 text-left">Check in</th>
                                <th className="px-4 py-2 text-left">Check out</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookingList.length > 0 ? (
                                bookingList.map((booking: any) => (
                                    <tr key={booking.booking_id} className="border-t dark:border-gray-700">
                                        <td className="px-4 py-2">
                                            {guestsList.find(
                                                (g) => String(g.guest_id) === String(booking.guest_id)
                                            )?.first_name ?? booking.guest_id}
                                        </td>

                                        <td className="px-4 py-2">
                                            {roomsList.find(
                                                (r) => String(r.room_id) === String(booking.room_id)
                                            )?.room_number ?? booking.room_id}
                                        </td>

                                        <td className="px-4 py-2">{booking.check_in}</td>
                                        <td className="px-4 py-2">{booking.check_out}</td>

                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mr-2"
                                                onClick={() => handleOpenEdit(booking)}
                                            >
                                                <Pencil size={18} />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDelete(booking.booking_id)}
                                            >
                                                <Trash2 className="text-red-600" size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                {isDelete
                                    ? "Delete Booking"
                                    : isEdit
                                    ? "Edit Booking"
                                    : "Add Booking"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Delete confirmation */}
                            {isDelete ? (
                                <h3 className="text-red-500 text-center">
                                    Are you sure you want to delete this booking?
                                </h3>
                            ) : (
                                <>
                                    {/* Guest select */}
                                    <div>
                                        <Label>Guest</Label>
                                        <Select
                                            value={String(form.guest_id)}
                                            onValueChange={(v) =>
                                                setForm({ ...form, guest_id: v })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select guest" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {guestsList.map((g) => (
                                                    <SelectItem
                                                        key={g.guest_id}
                                                        value={String(g.guest_id)}
                                                    >
                                                        {g.first_name} {g.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.guest_id && (
                                            <div className="text-red-500 text-xs">
                                                {errors.guest_id[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Room select */}
                                    <div>
                                        <Label>Room</Label>
                                        <Select
                                            value={String(form.room_id)}
                                            onValueChange={(v) =>
                                                setForm({ ...form, room_id: v })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRooms.map((r: any) => (
                                                    <SelectItem
                                                        key={r.room_id}
                                                        value={String(r.room_id)}
                                                    >
                                                        {r.room_number}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.room_id && (
                                            <div className="text-red-500 text-xs">
                                                {errors.room_id[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div>
                                        <Label>Check in</Label>
                                        <Input
                                            type="date"
                                            name="check_in"
                                            value={form.check_in}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Check out</Label>
                                        <Input
                                            type="date"
                                            name="check_out"
                                            value={form.check_out}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal footer */}
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? isEdit
                                            ? "Saving..."
                                            : isDelete
                                            ? "Deleting..."
                                            : "Adding..."
                                        : isEdit
                                        ? "Save Changes"
                                        : isDelete
                                        ? "Delete"
                                        : "Add Booking"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
