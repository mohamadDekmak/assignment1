import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {addDepartments} from "@/clients/apiClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, {useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from '@tanstack/react-query';


function TopSection()
{
    const [success, setSuccess] = useState(false)
    const queryClient = useQueryClient()
    const form = useForm({
    defaultValues: {
        department_name: '',
    },
    onSubmit: async (values) => {
        try{
            await addDepartments(values.value.department_name)
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
    return(
        <section className="px-5 py-3 border-b-[2px] flex items-center justify-between">
            <h1>ECommerce</h1>
            <Dialog>
                <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">Add Department</Button>
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
        </section>
    )
}
export default TopSection;