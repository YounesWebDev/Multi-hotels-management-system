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

interface Booking {
    booking_id: number;
    guest_id: number;
    room_id: number;
    check_in: string;
    check_out: string;
}

interface Guest {
    guest_id: number;
    first_name: string;
    last_name: string;
}

interface Room {
    room_id: number;
    room_number: string;
    status: string;
}

/* ======================================================
    Initial empty form
====================================================== */

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

    const { bookings = [], guests = [], rooms = [] } = usePage().props as unknown as {
        bookings: Booking[];
        guests: Guest[];
        rooms: Room[];
    };

    const bookingList = Array.isArray(bookings) ? bookings : [];
    const guestsList = Array.isArray(guests) ? guests : [];
    const roomsList = Array.isArray(rooms) ? rooms : [];

    /* ======================================================
        State
    ====================================================== */

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    /* ======================================================
        Available rooms (same logic you wrote)
    ====================================================== */

    const availableRooms = roomsList.filter((room: any) => {
        if (room.status !== "available") return false;

        // if this is an edit , allow the current booking room
        if (isEdit && form.room_id && String(room.room_id) === String(form.room_id)) return true;

        // Exclude rooms that have any booking by another guest
        const isBooked = bookingList.some((b: any) => {
            if (String(b.room_id) !== String(room.room_id)) return false;

            // if editing , allow the current booking's room for the current booking
            if (isEdit && editId && b.booking_id === editId) return false;

            return true;
        });
        if (isBooked) return false;

        // prevent the same guest from booking two rooms for the same check in Date
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
        Open modals
    ====================================================== */

    // Open Add modal
    const handleOpen = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setIsDelete(false);
        setEditId(null);
        setDeleteId(null);
        setOpen(true);
    };

    // Open Edit modal
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

    // Open Delete modal
    const handleOpenDelete = (id: number) => {
        setDeleteId(id);
        setIsDelete(true);
        setIsEdit(false);
        setOpen(true);
        setLoading(false);
    };

    // Close modal
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add / Edit / Delete submit (same as ManageRooms but without ziggy)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // DELETE
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

        // validate selected room (fixed condition only)
        const selectedRoom = roomsList.find(
            (r: any) => String(r.room_id) === String(form.room_id)
        );

        if (!selectedRoom || selectedRoom.status !== "available") {
            alert("Please select an available room!");
            setLoading(false);
            return;
        }

        // UPDATE
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

        // CREATE
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
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <CalendarDays className="mr-2 text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold">Manage Bookings</h1>
                    </div>

                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18} /> Add Booking
                    </Button>
                </div>

                {/* Table */}
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
                            {bookingList && bookingList.length > 0 ? (
                                bookingList.map((booking: any) => (
                                    <tr
                                        key={booking.booking_id}
                                        className="border-t dark:border-gray-700"
                                    >
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
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                                    >
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
                            {isDelete ? (
                                <h3 className="text-red-500 text-center">
                                    Are you sure you want to delete this booking?
                                </h3>
                            ) : (
                                <>
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
