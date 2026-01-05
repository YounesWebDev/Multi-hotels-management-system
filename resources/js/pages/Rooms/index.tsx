import AppLayout from "@/layouts/app-layout";
import { usePage , router } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@headlessui/react";
import { DialogContent , Dialog , DialogTitle , DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select , SelectTrigger , SelectContent , SelectItem , SelectValue } from "@/components/ui/select";

const emptyForm = {room_number:'' , type: 'single' , price_per_night:'' , status:'available'  };

export default function index() {
    const {rooms = []} = usePage().props;
    const [open , setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setEditId(null);
        setOpen(true);
    }
    const handleOpenEdit = (room : any) => {
        setForm({
            room_number: room.room_number,
            type: room.type,
            price_per_night: room.price_per_night,
            status: room.status,
        });
        setIsEdit(true);
        setEditId(room.room_id);
        setOpen(true);
    }
    const handleClose = () => {
        setForm(emptyForm);
        setOpen(false);
        setIsEdit(false);
        setEditId(null);
    }
    const handleChange = (e: any) => {
        setForm({...form , [e.target.name]: e.target.value});
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isDelete) {
            //code
        } else if (isEdit && editId) {
            router.put(`/rooms/${editId}`,form , {
                onSuccess: handleClose,
            });
        } else {
            router.post('/rooms' , form , {
                onSuccess: handleClose,
            });
        }
    }

    const handleDelete = (id:any)=>{
        if (window.confirm('Are you sure you want to delete this room?')) {
            router.delete(`/rooms/${id}`);
        }
    }
    const roomList = Array.isArray(rooms) ? rooms : [] ;

    return (
        <></>
    )
}

