import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { mockPickupLocations, mockUser } from './mockData';
import CommonHeader from './CommonHeader';

// ——————————————————————————————
// Center Address Selection Modal
// ——————————————————————————————
const CenterAddressModal = ({ onClose, onSelect }) => {
  const [tab, setTab] = useState('cheapest'); // 'cheapest' | 'nearest'
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const locations =
    tab === 'cheapest'
      ? mockPickupLocations.cheapestFirst
      : mockPickupLocations.nearestFirst;

  const handleConfirm = () => {
    const loc = locations.find(l => l.id === selectedLocationId);
    if (loc) onSelect(loc);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white w-full sm:w-[520px] sm:rounded-[20px] rounded-t-[20px] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#f0f0f0]">
          <h3 className="m-0 font-[800] text-[1.1rem] text-[#111827]">Select Collection Centre</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mx-5 mt-4 bg-[#f3f4f6] rounded-[10px] p-1">
          <button
            onClick={() => setTab('cheapest')}
            className={`flex-1 py-2 rounded-[8px] text-[0.85rem] font-[700] transition-all ${tab === 'cheapest' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#6b7280]'}`}
          >
            Cheapest First
          </button>
          <button
            onClick={() => setTab('nearest')}
            className={`flex-1 py-2 rounded-[8px] text-[0.85rem] font-[700] transition-all ${tab === 'nearest' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#6b7280]'}`}
          >
            Nearest First
          </button>
        </div>

        {/* Location list */}
        <div className="px-5 py-3 overflow-y-auto flex flex-col gap-2">
          {locations.map(loc => (
            <label
              key={loc.id}
              className={`flex items-start gap-3 p-3.5 rounded-[12px] border cursor-pointer transition-all ${selectedLocationId === loc.id ? 'border-[#0f766e] bg-[#f0fdf9]' : 'border-[#e5e7eb] hover:bg-[#f9fafb]'}`}
            >
              <input
                type="radio"
                name="locationPick"
                className="absolute opacity-0 w-0 h-0"
                checked={selectedLocationId === loc.id}
                onChange={() => setSelectedLocationId(loc.id)}
              />
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedLocationId === loc.id ? 'border-[#0f766e]' : 'border-[#d1d5db]'}`}>
                {selectedLocationId === loc.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0f766e]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-[700] text-[#111827] text-[0.95rem] leading-tight">{loc.name}</span>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-[800] text-[#111827] text-[1rem]">{loc.price}</span>
                    <span className="text-[#9ca3af] line-through text-[0.8rem]">{loc.mrp}</span>
                  </div>
                </div>
                <p className="m-0 mt-1 text-[#6b7280] text-[0.8rem]">{loc.address}, {loc.city} - {loc.pincode}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-[#0f766e] font-[700] text-[0.75rem]">{loc.distance} away</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#f0f0f0] flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-[10px] border border-[#d1d5db] text-[#374151] font-[700] hover:bg-[#f9fafb] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLocationId}
            className={`px-6 py-2.5 rounded-[10px] font-[800] text-white transition-colors ${selectedLocationId ? 'bg-[#111827] hover:bg-black' : 'bg-[#e5e7eb] cursor-not-allowed'}`}
          >
            Confirm Address
          </button>
        </div>
      </div>
    </div>
  );
};

// ——————————————————————————————
// Cart Page
// ——————————————————————————————
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem, updateUserCenter, updateAllHomeItems } = useCart();
  
  const [activeModalProfileId, setActiveModalProfileId] = useState(null); // Which profile's center address modal is open?

  // Separation of items
  const homeItems = cartItems.filter(i => i.isHomePickup);
  const centerItems = cartItems.filter(i => i.isStorePickup);

  // Group Center Items by profile ID
  const centerItemsByProfile = centerItems.reduce((acc, item) => {
    if (!acc[item.profile.id]) acc[item.profile.id] = [];
    acc[item.profile.id].push(item);
    return acc;
  }, {});

  // Extract unique user home addresses for the dropdown
  const allHomeAddresses = mockUser.profiles.flatMap(p => p.addresses).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

  const upcomingDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
  const slots = ['07:00 AM', '08:00 AM', '09:00 AM', '05:00 PM', '06:00 PM'];
  const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  // Calculating Totals
  const totalB2B = cartItems.reduce((sum, item) => sum + parseInt((item.b2b || '₹0').replace(/[^0-9]/g, ''), 10), 0);
  const homeTrips = homeItems.length > 0 ? 1 : 0; // Assume 1 trip if any home items exist
  const totalAmount = totalB2B + (homeTrips * 50);

  return (
    <div className="app-shell min-h-screen bg-[#f1f3f6] pb-28 font-sans text-gray-800">
      <CommonHeader />

      <main className="max-w-[800px] mx-auto w-full px-4 md:px-5">
        <button
          type="button"
          className="flex items-center gap-1.5 text-[#111827] font-[700] text-[0.95rem] py-3 mt-2 bg-transparent border-none cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[12px] p-10 text-center shadow-sm">
            <svg className="mx-auto mb-4 text-[#9ca3af]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h3 className="m-0 text-[#374151] font-[700] text-[1.1rem]">Your cart is empty</h3>
            <p className="mt-2 text-[#6b7280] text-[0.9rem]">Add tests from the search page to get started.</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-5 bg-[#111827] text-white px-6 py-2.5 rounded-[10px] font-[800] text-[0.95rem] hover:bg-black transition-colors"
            >
              Search Tests
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-2">
            <h2 className="m-0 text-[#111827] font-[900] text-[1.4rem]">Review Your Order</h2>

            {/* HOME PICKUP SECTION */}
            {homeItems.length > 0 && (
              <section className="bg-white rounded-[12px] overflow-hidden shadow-sm border border-[#e5e7eb]">
                <div className="bg-[#f0fdf9] border-b border-[#ccfbf1] px-5 py-3.5 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <h3 className="m-0 text-[#0f766e] font-[800] text-[1.05rem]">Home Sample Collection</h3>
                </div>
                
                <div className="p-5 flex flex-col gap-4">
                  {/* List of items */}
                  {homeItems.map(item => {
                    const priceNum = parseInt((item.b2b || '₹0').replace(/[^0-9]/g, ''), 10);
                    const mrpNum = parseInt((item.mrpPrice || '₹0').replace(/[^0-9]/g, ''), 10);
                    const savedPct = mrpNum > 0 ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
                    
                    return (
                      <div key={item.cartItemId} className="flex justify-between items-start border-b border-[#f3f4f6] pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="m-0 text-[0.95rem] font-[700] text-[#111827]">{item.testName}</h4>
                          <p className="m-0 text-[#6b7280] text-[0.8rem] mt-1">Patient: <span className="font-[600] text-[#374151]">{item.profile.name}</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-[800] text-[#111827]">{item.b2b}</span>
                          <span className="text-[#9ca3af] line-through text-[0.75rem]">{item.mrpPrice}</span>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-[#ef4444] text-[0.75rem] font-[700] hover:underline mt-1 bg-transparent border-none p-0">Remove</button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Combined Settings for Home Collection */}
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-4 mt-2">
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[#6b7280] text-[0.75rem] font-[800] uppercase tracking-wider">Pickup Address</label>
                      <select 
                        className="border border-[#d1d5db] rounded-[8px] px-3 py-2.5 text-[#111827] font-[600] text-[0.9rem] bg-white focus:outline-none focus:border-[#0f766e]"
                        value={homeItems[0]?.selectedAddress || ''}
                        onChange={(e) => updateAllHomeItems({ selectedAddress: e.target.value })}
                      >
                        <option value="">Select an address</option>
                        {allHomeAddresses.map(addr => (
                          <option key={addr.id} value={`${addr.tag} - ${addr.line1}, ${addr.line2}`}>
                            {addr.tag} - {addr.line1}, {addr.line2}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#6b7280] text-[0.75rem] font-[800] uppercase tracking-wider">Pickup Slot</label>
                      <select
                        className="border border-[#d1d5db] rounded-[8px] px-3 py-2.5 text-[#111827] font-[500] text-[0.9rem] bg-white focus:outline-none focus:border-[#0f766e] disabled:bg-[#f3f4f6]"
                        disabled={!homeItems[0]?.selectedAddress}
                        value={homeItems[0]?.appointmentSlot || ''}
                        onChange={e => updateAllHomeItems({ appointmentSlot: e.target.value })}
                      >
                        <option value="">Select slot</option>
                        {slots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CENTER VISIT SECTION */}
            {Object.keys(centerItemsByProfile).length > 0 && (
              <section className="bg-white rounded-[12px] overflow-hidden shadow-sm border border-[#e5e7eb]">
                <div className="bg-[#fef2f2] border-b border-[#fecaca] px-5 py-3.5 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path></svg>
                  <h3 className="m-0 text-[#dc2626] font-[800] text-[1.05rem]">Center Visit</h3>
                </div>

                <div className="p-5 flex flex-col gap-6">
                  {Object.entries(centerItemsByProfile).map(([profileId, items]) => {
                    const profile = items[0].profile;
                    const sharedAddress = items[0].selectedAddress; // Assume all items for this profile share the address

                    return (
                      <div key={profileId} className="border border-[#e5e7eb] rounded-[10px] overflow-hidden">
                        <div className="bg-[#f9fafb] px-4 py-2 border-b border-[#e5e7eb]">
                          <span className="font-[800] text-[#374151] text-[0.95rem]">Patient: {profile.name} <span className="text-[#6b7280] font-[500]">({profile.relation})</span></span>
                        </div>
                        
                        <div className="p-4 flex flex-col gap-4">
                          {/* Test List */}
                          {items.map(item => (
                            <div key={item.cartItemId} className="flex justify-between items-start border-b border-[#f3f4f6] pb-3 last:border-0 last:pb-0">
                              <h4 className="m-0 text-[0.95rem] font-[700] text-[#111827]">{item.testName}</h4>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                {sharedAddress ? (
                                  <>
                                    <span className="font-[800] text-[#111827]">{item.b2b}</span>
                                    <span className="text-[#9ca3af] line-through text-[0.75rem]">{item.mrpPrice}</span>
                                  </>
                                ) : (
                                  <span className="text-[#d97706] text-[0.75rem] font-[700] bg-[#fef3c7] px-2 py-0.5 rounded">Address Required</span>
                                )}
                                <button onClick={() => removeFromCart(item.cartItemId)} className="text-[#ef4444] text-[0.75rem] font-[700] hover:underline mt-1 bg-transparent border-none p-0">Remove</button>
                              </div>
                            </div>
                          ))}

                          {/* Profile Settings Block */}
                          <div className="bg-[#f0fdf9] border border-[#ccfbf1] rounded-[8px] p-4 mt-1">
                            {/* Address Selector */}
                            <div className="flex flex-col gap-1.5 mb-4">
                              <label className="text-[#0f766e] text-[0.75rem] font-[800] uppercase tracking-wider">Collection Centre</label>
                              {sharedAddress ? (
                                <div className="flex items-start justify-between gap-2 bg-white border border-[#99f6e4] p-3 rounded-[8px]">
                                  <div>
                                    <p className="m-0 font-[800] text-[#111827] text-[0.95rem]">{sharedAddress.name}</p>
                                    <p className="m-0 text-[#4b5563] text-[0.85rem] mt-0.5">{sharedAddress.address} · <span className="text-[#0f766e] font-[700]">{sharedAddress.distance} away</span></p>
                                  </div>
                                  <button onClick={() => setActiveModalProfileId(profileId)} className="text-[#0f766e] font-[800] text-[0.8rem] shrink-0 bg-[#ccfbf1] px-3 py-1.5 rounded-[6px] border-none cursor-pointer hover:bg-[#99f6e4] transition-colors">
                                    Change
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setActiveModalProfileId(profileId)}
                                  className="w-full flex items-center justify-between text-left bg-white border border-[#99f6e4] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-[#ccfbf1] transition-colors"
                                >
                                  <span className="font-[700] text-[#0f766e] text-[0.65rem]">Select Collection Centre (Smart Search)</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </button>
                              )}
                            </div>

                            {/* Date / Slot Selection */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[#0f766e] text-[0.75rem] font-[800] uppercase tracking-wider">Visit Date</label>
                                <select
                                  className="border border-[#ccfbf1] rounded-[8px] px-3 py-2.5 text-[#111827] font-[600] text-[0.9rem] bg-white focus:outline-none focus:border-[#0f766e] disabled:bg-white/50 disabled:text-[#9ca3af] disabled:cursor-not-allowed"
                                  disabled={!sharedAddress}
                                  value={items[0]?.appointmentDate || ''}
                                  onChange={e => {
                                    items.forEach(i => updateCartItem(i.cartItemId, { appointmentDate: e.target.value }));
                                  }}
                                >
                                  <option value="">Select date</option>
                                  {upcomingDates.map(d => (
                                    <option key={d.toISOString()} value={d.toISOString().split('T')[0]}>{formatDate(d)}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[#0f766e] text-[0.75rem] font-[800] uppercase tracking-wider">Visit Slot</label>
                                <select
                                  className="border border-[#ccfbf1] rounded-[8px] px-3 py-2.5 text-[#111827] font-[600] text-[0.9rem] bg-white focus:outline-none focus:border-[#0f766e] disabled:bg-white/50 disabled:text-[#9ca3af] disabled:cursor-not-allowed"
                                  disabled={!sharedAddress}
                                  value={items[0]?.appointmentSlot || ''}
                                  onChange={e => {
                                    items.forEach(i => updateCartItem(i.cartItemId, { appointmentSlot: e.target.value }));
                                  }}
                                >
                                  <option value="">Select slot</option>
                                  {slots.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Summary Block */}
            <div className="border border-[#e5e7eb] rounded-[10px] p-5 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex justify-between text-[#4b5563] text-[0.95rem]">
                <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                <span className="font-[600]">₹{totalB2B}</span>
              </div>
              {homeTrips > 0 && (
                <div className="flex justify-between text-[#4b5563] text-[0.95rem]">
                  <span>Home Collection Charges ({homeTrips} trip)</span>
                  <span className="font-[600] text-[#0f766e] bg-[#ccfbf1] px-2 py-0.5 rounded-[4px]">+₹50</span>
                </div>
              )}
              <div className="border-t border-dashed border-[#d1d5db] pt-3 flex justify-between text-[#111827] text-[1.1rem] font-[900]">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-[#111827] text-white rounded-[12px] py-4 font-[800] text-[1.05rem] hover:bg-black transition-colors shadow-md my-4"
            >
              Proceed to Review — ₹{totalAmount}
            </button>
          </div>
        )}
      </main>

      {/* Center Address Modal */}
      {activeModalProfileId && (
        <CenterAddressModal
          onClose={() => setActiveModalProfileId(null)}
          onSelect={(loc) => {
            updateUserCenter(activeModalProfileId, loc);
            setActiveModalProfileId(null);
          }}
        />
      )}
    </div>
  );
};

export default CartPage;
