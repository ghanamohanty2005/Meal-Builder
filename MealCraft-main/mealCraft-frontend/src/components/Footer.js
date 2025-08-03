import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left section with logo and description */}
        <div className="footer-brand">
          <h2 className="brand-title">🍴 <span style={{ color: '#ff6b6b' }}>MealCraft</span></h2>
          <p>Building better meals for busy lives since 2023.</p>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>

        {/* Footer columns */}
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Delivery Areas</li>
            <li>Nutrition Info</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
            <li>Accessibility</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
