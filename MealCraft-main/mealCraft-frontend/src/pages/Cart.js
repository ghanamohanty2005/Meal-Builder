import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/orderApi';

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearAll } = useCart();
  const navigate = useNavigate();

  const grandTotal = cart?.reduce((sum, item) => {
    const price = item.meal?.price || 0;
    const qty = item.quantity || 0;
    return sum + price * qty;
  }, 0) || 0;

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        name: 'Customer',
        address: 'Default Address',
        paymentMethod: 'Cash on Delivery'
      };
      const res = await placeOrder(payload);
      clearAll();
      alert('✅ Order placed! Delivering in 1 hour.');
      navigate('/orders');
    } catch (err) {
      console.error('❌ Order placement failed:', err);
      alert('❌ Failed to place order.');
    }
  };

  if (!cart || cart.length === 0) {
    return <p style={{ padding: '20px' }}>🛒 Your cart is empty.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛒 Your Cart</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <img
              src={item.meal?.imageUrl || ''}
              alt={item.meal?.name || 'Meal'}
              style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ flexGrow: 1 }}>
              <h4 style={{ margin: 0 }}>{item.meal?.name || 'Meal Item'}</h4>
              <p style={{ margin: '4px 0', fontWeight: 500 }}>
                ₹{item.meal.price} × {item.quantity ?? 1} = ₹{item.meal.price * (item.quantity ?? 1)}
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '5px', alignItems: 'center' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                  style={qtyButtonStyle}
                >
                  −
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={qtyButtonStyle}
                >
                  ＋
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ margin: '20px 0' }} />
      <h3>Total: ₹{grandTotal}</h3>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={clearAll}
          style={{
            backgroundColor: '#ccc',
            color: '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Clear Cart
        </button>

        <button
          onClick={handlePlaceOrder}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 30px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginLeft: 'auto'
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

const qtyButtonStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Cart;
