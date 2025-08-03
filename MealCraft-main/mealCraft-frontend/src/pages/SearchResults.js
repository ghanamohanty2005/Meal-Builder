import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SearchResults = () => {
  const location = useLocation();
  const { results = [] } = location.state || {};
  const { addToCart } = useCart();

  if (!results.length) {
    return <p style={{ padding: '20px' }}>🔍 No meals found for your search.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔍 Search Results</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {results.map(meal => (
          <div
            key={meal.id}
            style={{
              width: '200px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <img
              src={meal.imageUrl}
              alt={meal.name}
              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <h4 style={{ margin: '10px 0 5px' }}>{meal.name}</h4>
            <div style={{ fontSize: '14px', color: '#555' }}>{meal.calories} cal</div>
            <div style={{ fontWeight: 'bold', color: '#28a745' }}>₹{meal.price}</div>

            <button
              onClick={() => {
                addToCart(meal.id, 1);
                alert("✅ Meal added to cart!");
              }}
              style={{
                marginTop: '10px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🛒 Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
