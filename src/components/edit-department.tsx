import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {updateDepartment} from "@/clients/api-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, {useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from '@tanstack/react-query';

interface EditDepartmentProps {
  id: number;
  name: string;
}


function EditDepartment({id, name}: EditDepartmentProps)
{ const [success, setSuccess] = useState(false)
    const queryClient = useQueryClient()
    const form = useForm({
    defaultValues: {
        department_name: name,
    },
    onSubmit: async (values) => {
        try{
            await updateDepartment(id, values.value.department_name)
             setSuccess(true)        
            setTimeout(() => setSuccess(false), 3000)
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        }catch(err:any)
        {
            console.log("error to add Dep: " + err)
        }
    },
    })
    return (
        <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Edit Department</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
            <form.Field
                name="department_name"
                children={(field) => (
                    <>
                    <Label htmlFor="department_name">Department Name</Label>
                    <Input id="department_name" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                    </>
                )}
                />
                <Button type="submit" onClick={form.handleSubmit}>
                Submit
                </Button>
                {success && <p className="text-[#423]">Department added successfully!</p>}
        </DialogContent>
    </Dialog>
    )
}
export default EditDepartment