"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Updated to async for handling API calls
}

const DeleteProductModal = ({ isOpen, onClose, onConfirm }: DeleteProductModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(); // Call delete function
      toast.success("✅ Product deleted successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 text-sm">
          Are you sure you want to delete this product? <br /> 
          <span className="font-medium text-red-500">This action cannot be undone.</span>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outline" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
