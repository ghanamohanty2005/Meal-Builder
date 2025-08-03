import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeOrder } from '../api/orderApi';
import Footer from '../components/Footer'; // ✅ Add Footer import
import './Home.css';

const Home = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: 'Student Plan',
      price: 299,
      description: '10 meals designed for busy students',
      details: ['5 lunches + 5 dinners', 'Ready in 15 min or less', 'Budget-friendly ingredients', 'Free delivery to campus']
    },
    {
      name: 'Office Professional',
      price: 459,
      description: 'Healthy meals for the work week',
      mostPopular: true,
      details: ['5 lunches + 5 dinners', 'Premium ingredients', 'Office delivery available', 'Free Friday smoothie']
    },
    {
      name: 'Fitness Plan',
      price: 539,
      description: 'High-protein meals for active lifestyles',
      details: ['7 lunches + 7 dinners', 'Macro-balanced meals', 'Protein-packed options', 'Free shaker bottle']
    }
  ];

  const handleConfirm = async () => {
    try {
      const payload = {
        name: selectedPlan.name,
        address: 'Pre-designed Plan',
        paymentMethod: 'Cash on Delivery'
      };
      await placeOrder(payload);
      alert(`${selectedPlan.name} added to order history!`);
      setSelectedPlan(null);
    } catch (err) {
      alert('Failed to place order');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="text-box">
            <h1>Craft Your Perfect Meal</h1>
            <p>Pick your base, protein, veggies, and extras — delivered hot & fresh.</p>
            <div className="hero-buttons">
              <Link to="/builder" className="btn primary-btn">Start Building</Link>
              <Link to="/cart" className="btn secondary-btn">View Cart</Link>
            </div>
          </div>
          <div className="image-box">
            <img
              src="/meal_images/starting-image.png"
              alt="Meal Bowl"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Why MealCraft?</h2>
        <p className="subheading">Delicious, flexible, and fast. Just the way you like it.</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-box" key={index}>
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to customize your next meal?</h2>
          <p>Get started with our simple meal builder and enjoy personalized flavors.</p>
          <Link to="/builder" className="btn primary-btn">🚀 Launch Meal Builder</Link>
        </div>
      </section>

      {/* Meal Plans */}
      <section className="plans-section">
        <h2>Meal Plans for Busy People</h2>
        <p className="subheading">Save time and money with our pre-designed meal plans</p>
        <div className="plan-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`plan-card ${plan.mostPopular ? 'popular' : ''}`}>
              {plan.mostPopular && <div className="badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <h2>₹{plan.price}<span className="per-week">/week</span></h2>
              <p>{plan.description}</p>
              <hr />
              <ul>
                {plan.details.map((d, i) => (
                  <li key={i}>✔️ {d}</li>
                ))}
              </ul>
              <button onClick={() => setSelectedPlan(plan)}>Choose Plan</button>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {selectedPlan && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Purchase</h3>
              <p>Do you want to order the <strong>{selectedPlan.name}</strong> for ₹{selectedPlan.price}?</p>
              <div className="modal-buttons">
                <button onClick={handleConfirm}>✅ Confirm</button>
                <button onClick={() => setSelectedPlan(null)}>❌ Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </div>
  );
};

const features = [
  {
    icon: '🧑‍🍳',
    title: 'Custom Meals',
    desc: 'Build your own meal with just a few clicks.'
  },
  {
    icon: '⚡',
    title: 'Fast Delivery',
    desc: 'Meals delivered in under an hour.'
  },
  {
    icon: '📦',
    title: 'Order History',
    desc: 'Easily reorder from your past favorites.'
  }
];

export default Home;
