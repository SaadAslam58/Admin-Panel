"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client } from "@/sanity/lib/client";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  productName: string;
  category: string;
  price: number;
  inventory: number;
  colors: string;
  status: string;
  description: string;
  imageUrl: string;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal = ({ product, isOpen, onClose, onSave }: EditProductModalProps) => {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  if (!product || !formData) {
    return null; // Don't render if no product is being edited
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      await client
        .patch(formData._id)
        .set({
          productName: formData.productName,
          category: formData.category,
          price: parseFloat(formData.price.toString()),
          inventory: parseInt(formData.inventory.toString()),
          colors: formData.colors,
          status: formData.status,
          description: formData.description,
        })
        .commit();

      // ✅ FIXED: Toast only runs once!
      toast.success("✅ Product updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });

      onSave(formData); // ✅ Update parent state
      onClose(); // ✅ Close the modal
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("❌ Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input name="productName" value={formData.productName} onChange={handleChange} />
            </div>
            <div>
              <Label>Category</Label>
              <Input name="category" value={formData.category} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input name="price" type="number" value={formData.price} onChange={handleChange} />
            </div>
            <div>
              <Label>Inventory</Label>
              <Input name="inventory" type="number" value={formData.inventory} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Colors</Label>
              <Input name="colors" value={formData.colors} onChange={handleChange} />
            </div>
            <div>
              <Label>Status</Label>
              <Input name="status" value={formData.status} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
