import AppLayout from "@/layouts/app-layout";
import { usePage , router } from "@inertiajs/react";
import { Card }from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Dialog , DialogContent , DialogHeader , DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { route } from "ziggy-js";
import { SheetClose } from "@/components/ui/sheet";

const emptyForm = {
    first_name : '', 
    last_name: '',
    email: '',
    phone: '',
    check_in: '',
    check_out: ''
};

export default function Guests() {
    const {guests =[]} = usePage().props ;
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
    return (
        <AppLayout>Guests</AppLayout>
    )
}
