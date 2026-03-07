import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonHeader from './CommonHeader';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="app-shell pb-safe relative">
      <CommonHeader />
      
      <main className="main-panel">
        <section className="card city-strip">
          <div>
            <h3>Hyderabad</h3>
            <p className="muted">Madhapur</p>
          </div>
          <div className="city-strip-right">
            <button type="button" className="change-loc-btn">Change Location</button>
          </div>
        </section>
        
        <section className="main-tabs">
          <button 
            className="main-tab tab-diagnostics cursor-pointer" 
            onClick={() => navigate('/search')}
          >
            <svg className="main-tab-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 10a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"></path>
              <line x1="17" y1="17" x2="13.5" y2="13.5"></line>
              <path d="M8 10h4"></path>
              <path d="M10 8v4"></path>
              <rect x="16" y="16" width="6" height="6" rx="1"></rect>
            </svg>
            <span className="main-tab-title">Diagnostics</span>
          </button>
          <a href="#" className="main-tab tab-pharmacy">
            <svg className="main-tab-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2h6l1 7H8L9 2z"></path>
              <rect x="5" y="9" width="14" height="13" rx="2"></rect>
              <line x1="12" y1="13" x2="12" y2="18"></line>
              <line x1="9.5" y1="15.5" x2="14.5" y2="15.5"></line>
            </svg>
            <span className="main-tab-title">Pharmacy</span>
          </a>
          <a href="#" className="main-tab tab-doctors">
            <svg className="main-tab-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="main-tab-title">Doctors</span>
          </a>
        </section>
        
        <section className="hero card gradient-red">
          <p className="hero-overline">Hello, User (Corporate)</p>
          <h2>Save up to 50–80% on Diagnostics</h2>
          <p>Your Corporate plan unlocks exclusive prices on 100+ tests — walk-in or home collection.</p>
          <button className="cta cursor-pointer" onClick={() => navigate('/search')}>Explore Tests</button>
        </section>
        
        <div className="offer-banner-row">
          <div className="offer-banner offer-banner-coral">
            <span className="offer-badge">PHARMACY</span>
            <h3>Flat 20% Off on Medicines</h3>
            <p>On all prescription &amp; OTC medicines. Use code CORP20.</p>
          </div>
          <div className="offer-banner offer-banner-purple">
            <span class="offer-badge">PHARMACY</span>
            <h3>Buy 2 Get 1 Free</h3>
            <p>On vitamins, supplements &amp; wellness essentials.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
