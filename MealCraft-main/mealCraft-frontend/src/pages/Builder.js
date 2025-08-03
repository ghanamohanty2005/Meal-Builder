import React, { useEffect, useState } from 'react';
import { fetchMealsByType } from '../api/mealApi';
import StepNavigation from '../components/StepNavigation';
import { useCart } from '../context/CartContext';

const Builder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [baseOptions, setBaseOptions] = useState([]);
  const [proteinOptions, setProteinOptions] = useState([]);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [veggieOptions, setVeggieOptions] = useState([]);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMealsByType('base').then(res => setBaseOptions(res.data || []));
    fetchMealsByType('protein').then(res => setProteinOptions(res.data || []));
    fetchMealsByType('veggie').then(res => setVeggieOptions(res.data || []));
    fetchMealsByType('extra').then(res => setExtraOptions(res.data || []));
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2></h2>
            <OptionGrid items={baseOptions} selected={selectedBase} onSelect={setSelectedBase} />
            <div style={navButtonContainer}>
              <button onClick={() => setCurrentStep(1)} style={nextBtnStyle}>Next</button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2></h2>
            <OptionGrid items={proteinOptions} selected={selectedProtein} onSelect={setSelectedProtein} />
            <div style={navButtonContainer}>
              <button onClick={() => setCurrentStep(0)} style={backBtnStyle}>Back</button>
              <button onClick={() => setCurrentStep(2)} style={nextBtnStyle}>Next</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2></h2>
            <MultiSelectGrid items={veggieOptions} selected={selectedVeggies} setSelected={setSelectedVeggies} max={4} />
            {selectedVeggies.length > 0 && (
              <button
                onClick={() => {
                  selectedVeggies.forEach(item => addToCart(item.id, 1));
                  alert('✅ Selected veggies added to cart!');
                  setSelectedVeggies([]);
                }}
                style={{
                  marginTop: '20px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Move to Cart
              </button>
            )}
            <div style={navButtonContainer}>
              <button onClick={() => setCurrentStep(1)} style={backBtnStyle}>Back</button>
              <button onClick={() => setCurrentStep(3)} style={nextBtnStyle}>Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2></h2>
            <ExtrasGrid items={extraOptions} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras} />
            <div style={navButtonContainer}>
              <button onClick={() => setCurrentStep(2)} style={backBtnStyle}>Back</button>
            </div>
          </>
        );
      default:
        return <p>Coming soon...</p>;
    }
  };

  return (
    <div>
      <StepNavigation currentStep={currentStep} setCurrentStep={setCurrentStep} />
      {renderStepContent()}
    </div>
  );
};

const OptionGrid = ({ items, selected, onSelect }) => {
  const { addToCart } = useCart();

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {Array.isArray(items) &&
        items.map(item => (
          <div
            key={item.id}
            style={{
              width: '206px', 
             idth: '200px',
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
            <div onClick={() => onSelect(item)} style={{ flex: 1 }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '130px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <h4 style={{ margin: '10px 0 5px' }}>{item.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>₹{item.price}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{item.calories} cal</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item.id, 1);
                alert("✅ Meal added to cart!");
              }}
              style={{
                width: '100%',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 0',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Move to Cart
            </button>
          </div>
        ))}
    </div>
  );
};

const MultiSelectGrid = ({ items, selected, setSelected, max }) => {
  const toggleItem = (item) => {
    const isSelected = selected.find(v => v.id === item.id);
    if (isSelected) {
      setSelected(selected.filter(v => v.id !== item.id));
    } else {
      if (selected.length >= max) {
        alert(`You can select a maximum of ${max} items.`);
        return;
      }
      setSelected([...selected, item]);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {Array.isArray(items) &&
        items.map((item) => {
          const isSelected = selected.find(v => v.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item)}
              style={{
                border: isSelected ? '2px solid #4ecdc4' : '1px solid #ccc',
                padding: '10px',
                borderRadius: '10px',
                width: '180px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#e6f9f8' : 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px' }} />
              <h4>{item.name}</h4>
              <h3>₹{item.price}</h3>
              <p>{item.calories} cal</p>
            </div>
          );
        })}
    </div>
  );
};

const ExtrasGrid = ({ items, selectedExtras, setSelectedExtras }) => {
  const { addToCart } = useCart();

  const handleQuantityChange = (item, delta) => {
    const existing = selectedExtras.find(e => e.id === item.id);
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        setSelectedExtras(selectedExtras.filter(e => e.id !== item.id));
      } else {
        setSelectedExtras(
          selectedExtras.map(e =>
            e.id === item.id ? { ...e, quantity: newQty } : e
          )
        );
      }
    } else if (delta > 0) {
      setSelectedExtras([...selectedExtras, { ...item, quantity: 1 }]);
    }
  };

  const getQuantity = (id) => {
    const item = selectedExtras.find(e => e.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {Array.isArray(items) &&
        items.map((item) => {
          const qty = getQuantity(item.id);
          return (
            <div
              key={item.id}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                width: '200px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h4>{item.name}</h4>
              <h3>₹{item.price}</h3>
              <p>{item.calories} cal</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                <button
                  onClick={() => handleQuantityChange(item, -1)}
                  style={qtyBtnStyle}
                  disabled={qty === 0}
                >−</button>
                <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{qty}</span>
                <button
                  onClick={() => handleQuantityChange(item, 1)}
                  style={qtyBtnStyle}
                >＋</button>
              </div>

              {qty > 0 && (
                <button
                  onClick={() => {
                    addToCart(item.id, qty);
                    alert('✅ Added to cart!');
                    setSelectedExtras(selectedExtras.filter(e => e.id !== item.id));
                  }}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold'
                  }}
                >
                  🛒 Add to Cart
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};


const navButtonContainer = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px'
};

const backBtnStyle = {
  backgroundColor: '#ccc',
  color: '#333',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const nextBtnStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const addToCartBtnStyle = {
  marginTop: '20px',
  backgroundColor: '#ff6b6b',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};


const qtyBtnStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#ff6b6b',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Builder;
