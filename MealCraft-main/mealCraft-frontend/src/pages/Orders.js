import React, { useEffect, useState } from 'react';
import { fetchOrderHistory } from '../api/orderApi';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory()
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  if (orders.length === 0) {
    return <p style={{ padding: '20px' }}>📭 No orders found.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <h3 style={{ margin: 0 }}>🧾 Order #{order.id}</h3>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>{order.status}</span></p>
            <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>

            <div style={{ marginTop: '10px' }}>
              <strong>Items:</strong>
              <ul>
                {order.items.map(item => (
                  <li key={item.id} style={{ marginTop: '6px' }}>
                    <img
                      src={item.meal?.imageUrl}
                      alt={item.meal?.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                    />
                    {item.meal?.name} — ₹{item.meal?.price} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <h4 style={{ marginTop: '10px' }}>Total Paid: ₹{order.totalAmount}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
