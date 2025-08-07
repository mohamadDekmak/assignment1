import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { editItem } from "@/clients/api-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useForm } from "@tanstack/react-form"
import { useAppContext } from '@/contexts/AppContext';
import { Edit } from 'lucide-react';
import { GetItemDto } from "@/clients/items/get-items-dto";

interface EditItemProps {
  item: GetItemDto;
}

function EditItem({ item }: EditItemProps) {
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { invalidateItems } = useAppContext();

  const form = useForm({
    defaultValues: {
      name: item.name,
      price: item.price,
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

      setIsEditing(true);
      try {
        await editItem(
          item.id, 
          values.value.name.trim(), 
          values.value.price, 
          selectedImage || undefined
        );
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
          invalidateItems();
        }, 1500);
      } catch (err: any) {
        console.log("Error editing item: " + err);
      } finally {
        setIsEditing(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="cursor-pointer"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit Item</DialogTitle>
        
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
                  disabled={isEditing}
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
                  disabled={isEditing}
                />
              </>
            )}
          />
          
          <div>
            <Label htmlFor="item_image">Update Image (Optional)</Label>
            <Input 
              id="item_image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
              disabled={isEditing}
            />
            
            <div className="flex gap-4 mt-2">
              {/* Current image */}
              {item.imageUrl && !imagePreview && (
                <div>
                  <Label className="text-xs text-gray-500">Current Image</Label>
                  <img 
                    src={item.imageUrl} 
                    alt="Current" 
                    className="w-20 h-20 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/80x80";
                    }}
                  />
                </div>
              )}
              
              {/* New image preview */}
              {imagePreview && (
                <div>
                  <Label className="text-xs text-gray-500">New Image</Label>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={form.handleSubmit}
            disabled={isEditing}
          >
            {isEditing ? "Updating..." : "Update Item"}
          </Button>
        </DialogFooter>
        
        {success && (
          <p className="text-green-600 text-center mt-2">
            Item updated successfully!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditItem;
