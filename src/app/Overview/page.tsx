"use client";
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  totalPrice: number;
  date: string;
  paymentMethod: string;
  cartItems: CartItem[];
}

const Overview = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data: Order[] = await client.fetch(
          `*[_type == "person"]{
            _id,
            fullName,
            email,
            phone,
            totalPrice,
            date,
            paymentMethod,
            "cartItems": cartItems[]{
              id,
              name,
              price,
              quantity
            }
          }`
        );
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Overview</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-xl text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold text-gray-700">
                    {orders.length}
                  </p>
                  <p className="text-gray-500">Total Orders</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold text-gray-700">
                    PKR {totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {order.fullName}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {order.email}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Payment:</span>{' '}
                    {order.paymentMethod}
                  </p>
                  <p className="text-gray-800 font-semibold mt-4">
                    Total: PKR {order.totalPrice}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
