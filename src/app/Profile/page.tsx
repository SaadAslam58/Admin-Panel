"use client"
import { client } from '@/sanity/lib/client';
import React from 'react';
import { useEffect,useState } from 'react';
import { Order } from '../Order/page';
const Profile = () => {
  const [data, setData] = useState<Order[]>([])
   const [loading, setLoading] = useState<boolean>(true)
   const [error, setError] = useState<string>('')
 
   useEffect(() => {
     async function fetchData() {
       try {
         const response: Order[] = await client.fetch(
           `*[_type == "person"]{
             _id,
             fullName,
             email,
             phone,
             city,
             address,
             state,
            
           
           }`
         )
         setData(response)
       } catch (err) {
         console.error("Error fetching data:", err)
         setError("Failed to load orders.")
       } finally {
         setLoading(false)
       }
     }
     fetchData()
   }, [])
 
   if (loading) return <div className="p-6 text-center text-gray-600">Loading Customer Profiles...</div>
   if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>
   if (!data || data.length === 0) return <div className="p-6">No Profile found.</div>
 

  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Customer Profile</h1>
        <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border whitespace-nowrap">Customer</th>
                <th className="px-4 py-2 border whitespace-nowrap">Email</th>
                <th className="px-4 py-2 border whitespace-nowrap">Phone</th>
                <th className="px-4 py-2 border whitespace-nowrap">City</th>
                <th className="px-4 py-2 border whitespace-nowrap">Address</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="px-4 py-2 border whitespace-nowrap">{order.fullName}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{order.email}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{order.phone}</td>
             
                  <td className="px-4 py-2 border whitespace-nowrap">{order.city}</td>
                  <td  className="px-4 py-2 border whitespace-nowrap">
                   {order.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {data.map((order) => (
          <div key={order._id} className="border rounded-lg shadow p-4">
            <div className="mb-1">
              <span className="font-bold">Customer:</span> {order.fullName}
            </div>
            <div className="mb-1">
              <span className="font-bold">Email:</span> {order.email}
            </div>
            <div className="mb-1">
              <span className="font-bold">Phone:</span> {order.phone}
            </div>
            <div className="mb-1">
              <span className="font-bold">City:</span> {order.city}
            </div>
            <div className="mb-1">
              <span className="font-bold">Address:</span> {order.address}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Profile;
