import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus, Bed } from "lucide-react";
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
import { route } from "ziggy-js";

/* ======================================================
    Types
====================================================== */

// Room object coming from Laravel
interface Room {
    room_id: number;
    room_number: string;
    type: string;
    price_per_night: number;
    status: string;
}

/* ======================================================
    Initial empty form
====================================================== */

export const emptyForm = {
    room_number: "",
    type: "single",
    price_per_night: "",
    status: "available",
};

export default function ManageRooms() {
    /* ======================================================
        Data from Inertia
    ====================================================== */

    const { rooms } = usePage().props as unknown as { rooms: Room[] };

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
    const handleOpenEdit = (room: Room) => {
        setForm({
            room_number: room.room_number,
            type: room.type,
            price_per_night: String(room.price_per_night),
            status: room.status,
        });
        setErrors({});
        setIsEdit(true);
        setEditId(room.room_id);
        setOpen(true);
    };

    // Open Delete modal
    const handleOpenDelete = (id: number) => {
        setDeleteId(id);
        setIsDelete(true);
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

    // Add / Edit / Delete submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // DELETE
        if (deleteId && isDelete) {
            router.delete(route("rooms.destroy", deleteId), {
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

        // UPDATE
        if (isEdit && editId) {
            router.put(route("rooms.update", editId), form, {
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
        router.post(route("rooms.store"), form, {
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
        <AppLayout breadcrumbs={[{ title: "Manage Rooms", href: "/rooms" }]}>
            <Head title="Manage Rooms" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Bed className="mr-2 text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold">Manage Rooms</h1>
                    </div>

                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18} /> Add Room
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                    <table className="min-w-full bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 text-left">Number</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <tr key={room.room_id} className="border-t dark:border-gray-700">
                                        <td className="px-4 py-2">{room.room_number}</td>
                                        <td className="px-4 py-2 capitalize">{room.type}</td>
                                        <td className="px-4 py-2">$ {room.price_per_night}</td>
                                        <td className="px-4 py-2 capitalize">{room.status}</td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mr-2"
                                                onClick={() => handleOpenEdit(room)}
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDelete(room.room_id)}
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
                                        No rooms found.
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
                                {isDelete ? "Delete Room" : isEdit ? "Edit Room" : "Add Room"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isDelete ? (
                                <h3 className="text-red-500 text-center">
                                    Are you sure you want to delete this room?
                                </h3>
                            ) : (
                                <>
                                    <div>
                                        <Label>Room Number</Label>
                                        <Input
                                            name="room_number"
                                            value={form.room_number}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.room_number && (
                                            <div className="text-red-500 text-xs">
                                                {errors.room_number[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Type</Label>
                                        <Select
                                            value={form.type}
                                            onValueChange={(v) =>
                                                setForm({ ...form, type: v })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="double">Double</SelectItem>
                                                <SelectItem value="suite">Suite</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Price per night</Label>
                                        <Input
                                            type="number"
                                            name="price_per_night"
                                            value={form.price_per_night}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            value={form.status}
                                            onValueChange={(v) =>
                                                setForm({ ...form, status: v })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="occupied">Occupied</SelectItem>
                                                <SelectItem value="maintenance">
                                                    Maintenance
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        : "Add Room"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
