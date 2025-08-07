import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {deleteDepartment} from "@/clients/api-client"
import { Label } from "@/components/ui/label"
import React, {useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { useAppContext } from '@/contexts/AppContext';


function DeleteDepartment( {id} :{id : number})
{ 
    const [success, setSuccess] = useState(false)
    const { invalidateDepartments } = useAppContext();
    const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
        try{
            await deleteDepartment(id)
             setSuccess(true)        
            setTimeout(() => setSuccess(false), 3000)
            form.reset();
            invalidateDepartments();
        }catch(err:any)
        {
            console.log("error to delete Dep: " + err)
        }
    },
    })
    return (
        <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Delete Department</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
            <form.Field
                name="department_name"
                children={(field) => (
                    <>
                    <Label htmlFor="department_name">Are you sure?</Label>
                    </>
                )}
                />
                <Button type="submit" onClick={form.handleSubmit}>
                Yes
                </Button>
                {success && <p className="text-[#423]">Department Deleted successfully!</p>}
        </DialogContent>
    </Dialog>
    )
}
export default DeleteDepartment