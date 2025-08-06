import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {addItem} from "@/clients/api-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, {useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from '@tanstack/react-query';

interface AddItemProps {
  departmentId: number;
  departmentName: string;
}

function AddItem({departmentId, departmentName}: AddItemProps)
{ 
    const [success, setSuccess] = useState(false)
    const queryClient = useQueryClient()
    const form = useForm({
    defaultValues: {
        name: '',
        price: 0,
    },
    onSubmit: async (values) => {
        // Basic validation
        if (!values.value.name.trim()) {
            console.log("Item name is required");
            return;
        }
        if (values.value.price <= 0) {
            console.log("Price must be greater than 0");
            return;
        }
        
        try{
            await addItem(departmentId, values.value.name.trim(), values.value.price)
             setSuccess(true)        
            setTimeout(() => setSuccess(false), 3000)
            form.reset();
            // Invalidate queries to refresh the items list and departments
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            // Also trigger a refetch of items for this specific department
            queryClient.invalidateQueries({ queryKey: ['items', departmentId] });
        }catch(err:any)
        {
            console.log("error to add Item: " + err)
        }
    },
    })
    return (
        <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Add Item to {departmentName}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Add New Item</DialogTitle>
            <div className="space-y-4">
                <form.Field
                    name="name"
                    children={(field) => (
                        <>
                        <Label htmlFor="item_name">Item Name</Label>
                        <Input 
                            id="item_name" 
                            type="text" 
                            value={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter item name..."
                        />
                        </>
                    )}
                    />
                <form.Field
                    name="price"
                    children={(field) => (
                        <>
                        <Label htmlFor="item_price">Price</Label>
                        <Input 
                            id="item_price" 
                            type="number" 
                            step="0.01"
                            min="0"
                            value={field.state.value} 
                            onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                        />
                        </>
                    )}
                    />
                    <Button type="submit" onClick={form.handleSubmit}>
                    Add Item
                    </Button>
                    {success && <p className="text-green-600">Item added successfully!</p>}
            </div>
        </DialogContent>
    </Dialog>
    )
}
export default AddItem
