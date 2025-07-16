import React, { useEffect, useState } from 'react';
import { fetchSellerOrders } from '../api/api';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (user && user._id) {
      fetchSellerOrders(user._id).then(res => setOrders(res.data));
    }
  }, [user]);

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-pale-pink">
        <h2 className="text-2xl font-bold mb-4 text-classic-pink">Orders Received</h2>
        <table className="w-full border bg-almost-white">
          <thead className="bg-pale-pink">
            <tr>
              <th className="text-classic-pink">Order ID</th><th className="text-classic-pink">Customer</th><th className="text-classic-pink">Status</th><th className="text-classic-pink">Total</th><th className="text-classic-pink">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName || (order.user && order.user.username)}</td>
                <td>{order.status}</td>
                <td>{order.totalAmount}</td>
                <td>
                  <ul>
                    {order.items.filter(item => item.seller === user._id || item.seller === user._id?.toString()).map(item => (
                      <li key={item.productId?._id || item.productId}>{item.productName} x {item.quantity}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 