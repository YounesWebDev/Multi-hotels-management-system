import AppLayout from "@/layouts/app-layout";
import { Head,usePage,router } from "@inertiajs/react";
import { Building2,Pencil,Trash2,Plus} from "lucide-react";
import { useState } from "react";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { route } from 'ziggy-js';

// Type definition for a Hotel object coming from Laravel
interface Hotel {
    tenant_id:number ; 
    hotel_name:string;
    address:string;
    contact_number:string;
    created_at:string;
}

// Initial empty form state
const emptyForm = {
    hotel_name:'',
    address:'',
    contact_number:''
};

export default function ManageHotels() {

    // Get hotels data from Inertia props
    const {hotels} = usePage().props as unknown as {hotels: Hotel[]};

    // Dialog open/close state
    const [open , setOpen] = useState(false);

    // Form state
    const [form , setForm] = useState(emptyForm);

    // Loading state for submit button
    const [loading, setLoading] = useState(false);

    // Validation errors from Laravel
    const [errors, setErrors] = useState<{ [key: string ] : string[]}>({});

    // Determines if we are editing or adding
    const [isEdit, setIsEdit] = useState(false);

    // Stores the ID of the hotel being edited
    const [editId, setEditId] = useState< number | null >(null);

    //determines if we are deleting or editing or adding
    const [isDelete, setIsDelete] = useState(false);

    //stores the ID of the hotel being deleted
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Open modal for adding a new hotel
    const handleOpen = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setEditId(null);
        setOpen(true);
    };

    //Open modal for deleting an existing hotel
    const handleOpenDelete = (hotelId: number) => {
    setDeleteId(hotelId);   // Track which hotel to delete
    setIsDelete(true);      // Enable delete mode
    setOpen(true);          // Open the dialog
    setLoading(false);      //reset loading
};


    // Open modal for editing an existing hotel
    const handleOpenEdit = (hotel : Hotel) => {
        setForm({
            hotel_name: hotel.hotel_name,
            address: hotel.address,
            contact_number: hotel.contact_number,
        });
        setErrors({});
        setIsEdit(true);
        setEditId(hotel.tenant_id);
        setOpen(true);
    };

    // Close modal and reset state
    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setEditId(null);
        setIsDelete(false);
        setDeleteId(null);
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form , [e.target.name]: e.target.value});
    };

    // Submit form (Add or Edit or Delete)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (deleteId) {
            router.delete(route('hotels.destroy', deleteId), {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err: any) => {
                    setLoading(false);
                    setErrors(err);
                },
            });
            return; // stop further code
        }else if(isEdit && editId) {
            // Update hotel
            router.put(route('hotels.update' , editId), form , {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err : any) => {
                    setLoading(false);
                    setErrors(err);
                },
        });
        }else{
            // Create new hotel
            router.post(route('hotels.store') , form ,{
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err : any) => {
                    setLoading(false);
                    setErrors(err);
                },
            })
        }
    };

    return (
    <AppLayout breadcrumbs={[{ title:'Manage Hotels' , href: 'hotels'}]}>
        <Head title="Manage Hotels" />

        {/* Page content */}
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Building2 className="mr-2 text-blue-500" size={32} />
                    <h1 className="text-2xl font-bold">Manage Hotels</h1>
                </div>

                {/* Add hotel button */}
                <Button onClick={handleOpen} className="gap-2">
                    <Plus size={18} /> Add Hotel
                </Button>
            </div>

            {/* Hotels table */}
            <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                <table className="min-w-full bg-white dark:bg-gray-900">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left">Hotel Name</th>
                            <th className="px-4 py-2 text-left">Address</th>
                            <th className="px-4 py-2 text-left">Contact</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels && hotels.length > 0 ? hotels.map((hotel) => (
                            <tr key={hotel.tenant_id} className="border-t dark:border-gray-700">
                                <td className="px-4 py-2 font-medium">{hotel.hotel_name}</td>
                                <td className="px-4 py-2">{hotel.address}</td>
                                <td className="px-4 py-2">{hotel.contact_number}</td>
                                <td className="px-4 py-2">
                                    {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString() : ''}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        className="mr-2"
                                        title="Edit"
                                        onClick={() => handleOpenEdit(hotel)}
                                    >
                                        <Pencil size={18}/>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mr-2"
                                        title="Delete"
                                        onClick={() => handleOpenDelete(hotel.tenant_id)}
                                    >
                                        <Trash2 className="text-red-600" size={18}/>
                                    </Button>

                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                    No hotels found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Hotel Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>
                {isDelete ? 'Delete Hotel' : isEdit ? 'Edit Hotel' : 'Add Hotel'}
            </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
            {isDelete ? (
                // Show delete confirmation message
                <h3 className="text-red-500 text-center">
                    Are you sure you want to delete this hotel?
                </h3>
            ) : (
                <>
                    {/* Hotel Name */}
                    <div>
                        <label className="block mb-1 font-medium">Hotel Name</label>
                        <input
                            type="text"
                            name="hotel_name"
                            value={form.hotel_name}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                        {errors.hotel_name && <div className="text-red-500 text-xs mt-1">{errors.hotel_name[0]}</div>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block mb-1 font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                        {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address[0]}</div>}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block mb-1 font-medium">Contact number</label>
                        <input
                            type="text"
                            name="contact_number"
                            value={form.contact_number}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                        {errors.contact_number && <div className="text-red-500 text-xs mt-1">{errors.contact_number[0]}</div>}
                    </div>
                </>
            )}

            <DialogFooter>
                <Button type="button" variant='outline' onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading
                        ? isEdit
                            ? 'Saving...'
                            : isDelete
                                ? 'Deleting...'
                                : 'Adding...'
                        : isEdit
                            ? 'Save Changes'
                            : isDelete
                                ? 'Delete'
                                : 'Add Hotel'}
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>

        </div>
    </AppLayout>
    )
}
