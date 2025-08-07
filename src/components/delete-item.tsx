import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { deleteItem } from "@/clients/api-client"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Trash2 } from 'lucide-react';

interface DeleteItemProps {
  itemId: number;
  itemName: string;
}

function DeleteItem({ itemId, itemName }: DeleteItemProps) {
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { invalidateItems } = useAppContext();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(itemId);
      setSuccess(true);
        setSuccess(false);
        setIsOpen(false);
        invalidateItems();
    } catch (err: any) {
      console.log("Error deleting item: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Delete Item</DialogTitle>
        <div className="py-4">
          <Label className="text-base">
            Are you sure you want to delete "<strong>{itemName}</strong>"?
          </Label>
          <p className="text-sm text-gray-600 mt-2">
            This action cannot be undone.
          </p>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
        
        {success && (
          <p className="text-green-600 text-center mt-2">
            Item deleted successfully!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DeleteItem;
