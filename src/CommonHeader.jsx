import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const CommonHeader = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  return (
    <header className="mp-header">
      <div className="mp-header-top">
        <div className="mp-header-left">
          <button type="button" className="mp-menu-btn" aria-label="Menu">
            <span className="mp-hamburger"></span>
            <span className="mp-hamburger"></span>
            <span className="mp-hamburger"></span>
          </button>
          <Link className="mp-logo-link active" to="/">
            <span className="mp-logo-text">MedPlus<span className="mp-logo-plus">+</span></span>
          </Link>
        </div>
        <div className="mp-header-actions">
          <Link aria-label="Search" className="mp-icon-btn" to="/search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          <Link aria-label="Cart" className="mp-cart-btn" to="/cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="mp-cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
      <div className="mp-header-title-bar">
        <div className="mp-title-bar-left">
          <svg className="mp-loc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="mp-loc-city">HYDERABAD ▾</span>
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
