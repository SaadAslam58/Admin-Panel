"use client";
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  state: string;
  postalCode: string;
  date: string;
  paymentMethod: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  totalPrice: number;
  cartItems: CartItem[];
}

const Page = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response: Order[] = await client.fetch(
          `*[_type == "person"]{
            _id,
            fullName,
            firstName,
            lastName,
            email,
            phone,
            country,
            city,
            address,
            state,
            postalCode,
            date,
            paymentMethod,
            cardNumber,
            expiry,
            cvv,
            totalPrice,
            "cartItems": cartItems[]{
              id,
              name,
              price,
              quantity
            }
          }`
        );
        setData(response);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  

  if (loading) return <div className="p-6 text-center text-gray-600">Loading orders...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="p-6 text-center text-gray-600">No orders found.</div>;
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Customer Orders</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {data.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Details</h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Name:</span> {order.fullName}</p>
                  <p><span className="font-medium">Email:</span> {order.email}</p>
                  <p><span className="font-medium">Phone:</span> {order.phone}</p>
                  <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.state}, {order.postalCode}, {order.country}</p>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                <div className="space-y-4">
                  {order.cartItems.map((item) => (
                    <div key={item.id} className="border-b pb-2 last:border-b-0">
                      <p className="text-gray-800"><span className="font-medium">Product:</span> {item.name}</p>
                      <p className="text-gray-600"><span className="font-medium">Price:</span> PKR {item.price}</p>
                      <p className="text-gray-600"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    </div>
                  ))}
                  <div className="pt-4 flex md:flex-row flex-col  md:space-x-5 md:space-y-0 space-y-3">
                    <p className="text-lg font-semibold text-gray-800">
                      <span className="font-medium">Total Price:</span> PKR {order.totalPrice}
                    </p>
                    {/* Over here */}
                    <Button >Cancel</Button>
                    <Button>Accept</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;