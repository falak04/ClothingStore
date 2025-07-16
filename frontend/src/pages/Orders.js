import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchOrders } from '../api/api';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      if (user && user._id) {
        const res = await fetchOrders(user._id);
        setOrders(res.data);
      }
    };
    loadOrders();
  }, [user]);

  // Remove chat state and functions: chatOrderId, chatMessages, chatInput, chatLoading, openChat, closeChat, sendMessage

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-classic-pink">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-gray-500 text-lg">You have no orders yet.</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6 border border-pale-pink">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-lg text-classic-pink">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="mb-2 text-sm text-gray-700">Status: <span className="font-semibold text-classic-pink">{order.status}</span></div>
                <div className="mb-2 text-sm text-gray-700">Total: <span className="font-semibold">₹{order.totalAmount}</span></div>
                <div className="mb-2 text-sm text-gray-700">Name: {order.customerName}</div>
                <div className="mb-2 text-sm text-gray-700">Address: {order.address || 'N/A'}</div>
                <div className="mb-2 text-sm text-gray-700">Phone: {order.phone || 'N/A'}</div>
                <div className="flex gap-2 mt-2">
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2 text-classic-pink">Items:</div>
                  <ul className="list-disc pl-6">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="mb-1">
                        {item.productName} x {item.quantity} @ ₹{item.price} each
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Remove chat modal */}
    </>
  );
} 