"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import EditProductModal from "@/components/EditProductModal"; 
import DeleteProductModal from "@/components/DeleteProductModal";
import { urlFor } from "@/sanity/lib/image";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: Product[] = await client.fetch(`
          *[_type == "product"]{
            _id, productName, category, price, inventory, colors, status, description,
            "imageUrl": image.asset->url
          }
        `);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
  
    try {
      await client.delete(deletingProduct._id, {
        token: process.env.SANITY_API_TOKEN,
      });

      setProducts(prev => prev.filter(p => p._id !== deletingProduct._id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleEditSave = async (updatedProduct: Product) => {
    if (!editingProduct) return;
  
    try {
      await client
        .patch(editingProduct._id)
        .set({
          productName: updatedProduct.productName,
          category: updatedProduct.category,
          price: updatedProduct.price,
          inventory: updatedProduct.inventory,
          colors: updatedProduct.colors,
          status: updatedProduct.status,
          description: updatedProduct.description,
        })
        .commit({
          token: process.env.SANITY_API_TOKEN,
        });

      setProducts(prev =>
        prev.map(p => (p._id === editingProduct._id ? { ...p, ...updatedProduct } : p))
      );

    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    } finally {
      setEditingProduct(null);
    }
  };

  // ✅ Consistent loading, error, and empty state handling
  if (loading) return <div className="p-6 text-center text-gray-600">Loading products...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!products || products.length === 0) return <div className="p-6 text-center text-gray-600">No products found.</div>;

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Product List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((item) => (
          <div key={item._id} className="p-4 bg-white shadow-lg rounded-lg">
            <Image 
              src={urlFor(item.imageUrl).url()} 
              alt={item.productName} 
              width={300} 
              height={300} 
              className="w-full h-auto rounded-lg"
            />
            <h2 className="font-semibold text-lg">{item.productName}</h2>
            <p className="text-gray-500">Price: PKR {item.price}</p>
            <div className="flex justify-between mt-2">
              <Button 
                variant="ghost" 
                className="border"
                onClick={() => setEditingProduct(item)}
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                className="border"
                onClick={() => setDeletingProduct(item)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleEditSave}
      />

      <DeleteProductModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ProductPage;
