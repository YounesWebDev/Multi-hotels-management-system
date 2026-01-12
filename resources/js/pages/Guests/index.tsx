import AppLayout from "@/layouts/app-layout";
import { usePage , router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog , DialogContent , DialogFooter, DialogHeader , DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Pencil, Plus, Trash2, User } from "lucide-react";

const emptyForm = {
    first_name : '', 
    last_name: '',
    email: '',
    phone: '',
    check_in: '',
    check_out: ''
};


export default function Guests() {
    const {guests} = usePage().props ;
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
    const handleOpenEdit = (guest: any) => {
        setForm({
            first_name : guest.first_name, 
            last_name: guest.last_name,
            email: guest.email,
            phone: guest.phone,
            check_in: guest.check_in || '',
            check_out: guest.check_out || ''
        });
        setErrors({});
        setIsEdit(true);
        setEditId(guest.guest_id);
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
    const handleClose = () =>{
        setOpen(false);
        setForm(emptyForm);
        setIsDelete(false);
        setIsEdit(false);
        setEditId(null);
        setDeleteId(null);
    }

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

        //DELETE 
        if (deleteId && isDelete) {
            router.delete(`/guests/${deleteId}` , {
                onSuccess : () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err: any) =>{
                    setLoading(false);
                    setErrors(err);
                },
            });

            
        }

        //UPDATE
        if(isEdit && editId) {
            router.put(`/guests/${editId}` , form , {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err : any) => {
                    setLoading(false);
                    setErrors(err);
                }
            });
        //ADD
        }else {
            router.post(`/guests` , form , {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err : any) => {
                    setLoading(false);
                    setErrors(err);
                }
            });
        }
    }

    const guestsList = Array.isArray(guests) ? guests : [];
    return (
        <AppLayout breadcrumbs={[{ title: "Manage Guests" , href: "/guests"}]}>
            <Head title = "Manage Guests"/>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <User className="mr-2 text-blue-500" size={32}/>
                        <h1 className="text-2xl font-bold">Manage Guests</h1>
                    </div>

                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18}/>
                        Add Guest
                    </Button>
                </div>
                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                    <table className="min-w-full bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 text-left">First Name</th>
                                <th className="px-4 py-2 text-left">Last Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Phone</th>
                                <th className="px-4 py-2 text-left">Check In</th>
                                <th className="px-4 py-2 text-left">Check Out</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guestsList && guestsList.length > 0 ? (
                                guestsList.map((guest) => (
                                    <tr key={guest.guest_id} className="border-t dark:border-gray-700">
                                        <td className="px-4 py-2">{guest.first_name}</td>
                                        <td className="px-4 py-2">{guest.last_name}</td>
                                        <td className="px-4 py-2">{guest.email}</td>
                                        <td className="px-4 py-2">{guest.phone}</td>
                                        <td className="px-4 py-2">{guest.check_in}</td>
                                        <td className="px-4 py-2">{guest.check_out}</td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mr-2"
                                                onClick={() => handleOpenEdit(guest)}
                                                >
                                                    <Pencil size={18} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="mr-2"
                                                onClick={() => handleOpenDelete(guest.guest_id)}
                                                >
                                                    <Trash2 className="text-red-600" size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center font-bold text-gray-500 dark:text-gray-400"
                                    >
                                        No guests found.
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
                                {isDelete ? "Delete Guest" : isEdit ? "Edit Guest" : "Add Guest"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isDelete ? (
                                <h3 className="text-red-500 text-center ">
                                    Are you sure you want to delete this guest ?
                                </h3>
                            ) : (
                                <>
                                    <div>
                                        <Label>Guest's First Name</Label>
                                        <Input 
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            required
                                            />
                                            {errors.first_name && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.first_name[0]}
                                                </div>
                                            )}
                                    </div>

                                    <div>
                                        <Label>Guest's Last Name</Label>
                                        <Input 
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            required
                                            />
                                            {errors.last_name && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.last_name[0]}
                                                </div>
                                            )}
                                    </div>
                                    
                                    <div>
                                        <Label>Guest's Email</Label>
                                        <Input 
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            type="email"
                                            />
                                            {errors.email && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.email[0]}
                                                </div>
                                            )}
                                    </div>
                                    
                                    <div>
                                        <Label>Guest's Phone</Label>
                                        <Input 
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            />
                                            {errors.phone && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.phone[0]}
                                                </div>
                                            )}
                                    </div>
                                    
                                    <div>
                                        <Label>Guest's Check In Date</Label>
                                        <Input 
                                            name="check_in"
                                            value={form.check_in}
                                            onChange={handleChange}
                                            required
                                            type="date"
                                            />
                                            {errors.check_in && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.check_in[0]}
                                                </div>
                                            )}
                                    </div>

                                    <div>
                                        <Label>Guest's Check Out Date</Label>
                                        <Input 
                                            name="check_out"
                                            value={form.check_out}
                                            onChange={handleChange}
                                            required
                                            type="date"
                                            />
                                            {errors.check_out && (
                                                <div className="text-red-500 text-xs">
                                                    {errors.check_out[0]}
                                                </div>
                                            )}
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
                                <Button
                                    type="submit"
                                    disabled={loading}>
                                    {loading
                                                ? isEdit
                                                    ? "Saving..."
                                                    : isDelete
                                                    ? "Deleting..."
                                                    : "Adding..."
                                                : isEdit
                                                ? "Save Changes"
                                                :isDelete
                                                ? "Delete"
                                                : "Add"
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

        </AppLayout>
    )
}
