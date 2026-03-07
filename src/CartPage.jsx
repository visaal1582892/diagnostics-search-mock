import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { mockPickupLocations, mockUser, mockTests } from './mockData';

const slots = ['07:00 AM', '08:00 AM', '09:00 AM', '05:00 PM', '06:00 PM'];
import CommonHeader from './CommonHeader';

// ——————————————————————————————
// Center Address Selection Modal
// ——————————————————————————————
// ——————————————————————————————
// Inline Center Selection Component
// ——————————————————————————————
const CenterSelectionInline = ({ onSelect, currentSelectedId }) => {
  const [sortBy, setSortBy] = useState('cheapest'); 
  const [nablFilter, setNablFilter] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get filtered locations
  let locations = sortBy === 'cheapest' ? mockPickupLocations.cheapestFirst : mockPickupLocations.nearestFirst;
  if (nablFilter === 'yes') locations = locations.filter(l => l.isNablCertified);
  else if (nablFilter === 'no') locations = locations.filter(l => !l.isNablCertified);

  // Pagination logic
  const totalPages = Math.ceil(locations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocations = locations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white border border-[#ccfbf1] rounded-[16px] overflow-hidden shadow-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-4 bg-[#f0fdf9]/50 border-b border-[#ccfbf1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <select 
            value={sortBy} 
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-[#ccfbf1] rounded-[8px] px-3 py-1.5 text-[0.75rem] font-[800] text-[#0f766e] outline-none"
          >
            <option value="cheapest">Cheapest First</option>
            <option value="nearest">Nearest First</option>
          </select>
          <select 
            value={nablFilter} 
            onChange={e => { setNablFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-[#ccfbf1] rounded-[8px] px-3 py-1.5 text-[0.75rem] font-[800] text-[#0f766e] outline-none"
          >
            <option value="all">All Centers</option>
            <option value="yes">NABL Only</option>
            <option value="no">Non-NABL</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col">
        {currentLocations.map(loc => (
          <div 
            key={loc.id} 
            onClick={() => onSelect(loc)}
            className={`p-4 border-b border-[#f0fdf9] flex items-start gap-3 cursor-pointer transition-all hover:bg-[#f0fdf9]/30 ${currentSelectedId === loc.id ? 'bg-[#f0fdf9]' : ''}`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${currentSelectedId === loc.id ? 'border-[#0f766e]' : 'border-gray-300'}`}>
              {currentSelectedId === loc.id && <div className="w-2 h-2 rounded-full bg-[#0f766e]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="m-0 text-[0.85rem] font-[800] text-[#111827] leading-tight">{loc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#fef9c3] text-[#a16207] px-1.5 py-0.5 rounded-[4px] text-[0.6rem] font-[900] flex items-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {loc.rating}
                    </span>
                    {loc.isNablCertified && <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded-[4px] text-[0.55rem] font-[900] uppercase">NABL</span>}
                    <span className="text-[#6b7280] text-[0.7rem] font-[600]">{loc.distance}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#111827] font-[900] text-[0.9rem]">{loc.price}</div>
                  <div className="text-[#9ca3af] line-through text-[0.7rem]">{loc.mrp}</div>
                </div>
              </div>
              <p className="m-0 mt-2 text-[#6b7280] text-[0.7rem] line-clamp-1">{loc.address}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="p-3 bg-white flex items-center justify-center gap-2 border-t border-[#f0fdf9]">
          <button 
            disabled={currentPage === 1}
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p - 1)); }}
            className="w-8 h-8 rounded-[8px] border border-[#ccfbf1] text-[#0f766e] flex items-center justify-center disabled:opacity-30 hover:bg-[#f0fdf9]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                className={`w-8 h-8 rounded-[8px] text-[0.75rem] font-[900] transition-all ${
                  currentPage === i + 1 
                    ? 'bg-[#0f766e] text-white shadow-sm' 
                    : 'bg-white border border-[#ccfbf1] text-[#0f766e] hover:bg-[#f0fdf9]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
            className="w-8 h-8 rounded-[8px] border border-[#ccfbf1] text-[#0f766e] flex items-center justify-center disabled:opacity-30 hover:bg-[#f0fdf9]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ——————————————————————————————
// Review Details Modal
// ——————————————————————————————
const ReviewModal = ({ onClose, cartItems, totalAmount, homeTrips }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-[4px] px-4">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
          <h3 className="m-0 font-[900] text-[1.2rem] text-[#111827]">Order Review</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {Object.entries(cartItems.reduce((acc, item) => {
            if (!acc[item.profile.id]) acc[item.profile.id] = { name: item.profile.name, items: [] };
            acc[item.profile.id].items.push(item);
            return acc;
          }, {})).map(([profId, data]) => (
            <div key={profId} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111827] font-[800] text-[0.8rem]">{data.name[0]}</div>
                <span className="font-[800] text-[#111827] text-[1rem]">{data.name}</span>
              </div>
              <div className="bg-[#f9fafb] rounded-[16px] p-4 flex flex-col gap-3 border border-[#f0f0f0]">
                {data.items.map(item => (
                  <div key={item.cartItemId} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[0.9rem] font-[700] text-[#374151]">{item.testName}</span>
                      <span className="text-[0.7rem] text-[#6b7280] uppercase font-[800] tracking-tight mt-0.5">{item.isHomePickup ? 'Home Collection' : (item.selectedAddress?.name || 'Center Selection Required')}</span>
                    </div>
                    <span className="font-[800] text-[#111827]">
                      {item.isStorePickup && !item.selectedAddress ? '₹0' : item.b2b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-dashed border-[#d1d5db] pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-[#6b7280] text-[0.95rem] font-[600]">
              <span>Subtotal</span>
              <span>₹{totalAmount - (homeTrips * 50)}</span>
            </div>
            {homeTrips > 0 && (
              <div className="flex justify-between text-[#6b7280] text-[0.95rem] font-[600]">
                <span>Home Collection Charges</span>
                <span className="text-[#0f766e]">₹50</span>
              </div>
            )}
            <div className="flex justify-between text-[#111827] text-[1.2rem] font-[900] mt-2">
              <span>Grand Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button className="w-full bg-[#111827] text-white py-4 rounded-[16px] font-[900] text-[1.1rem] shadow-xl shadow-black/10 hover:bg-black transition-all">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// ——————————————————————————————
// Redesigned "Marketed" Smart Add-ons Component
// ——————————————————————————————
const SmartAddons = ({ testId, patientId, isHome, sharedAddress, addToCart, updateUserCenter, updateAllHomeItems, updateCartItem, bulkUpdateItems, allHomeAddresses, slots }) => {
  const currentTest = mockTests.find(t => t.id === testId);
  if (!currentTest?.smartOptions) return null;

  return (
    <div className={`mt-3 mb-4 rounded-[16px] overflow-hidden border border-dashed ${isHome ? 'border-[#0f766e]/30 bg-[#f0fdf9]/30' : 'border-[#dc2626]/20 bg-[#fef2f2]/30'}`}>
      <div className={`px-3 py-2 flex items-center justify-between ${isHome ? 'bg-[#0f766e]/5' : 'bg-[#dc2626]/5'}`}>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></path></svg>
          </div>
          <span className={`text-[0.65rem] font-[900] uppercase tracking-wider ${isHome ? 'text-[#0f766e]' : 'text-[#dc2626]'}`}>Exclusive Flash Offers</span>
        </div>
        <span className="bg-red-500 text-white text-[0.55rem] font-[1000] px-1.5 py-0.5 rounded-full animate-pulse">LIMITED TIME</span>
      </div>
      
      <div className="p-2.5 flex flex-col gap-2">
        {currentTest.smartOptions.map(optId => {
          const optTest = mockTests.find(t => t.id === optId);
          if (!optTest) return null;
          
          const canDoHome = optTest.isHomePickup;
          const discountedPrice = parseInt(optTest.b2b.replace(/\D/g, ''));
          const mrpPrice = parseInt(optTest.mrp.replace(/\D/g, ''));
          const discountPercent = Math.round(((mrpPrice-discountedPrice)/mrpPrice) * 100);

          return (
            <div
              key={optId}
              className="bg-white border border-gray-100 rounded-[12px] p-2.5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                   <h5 className="m-0 text-[0.75rem] font-[800] text-[#111827] truncate">{optTest.name}</h5>
                   <span className="bg-orange-100 text-orange-600 text-[0.55rem] font-[900] px-1 rounded-[4px]">{discountPercent}% OFF</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#0f766e] font-[1000] text-[0.8rem]">{optTest.b2b}</span>
                  <span className="text-gray-400 line-through text-[0.6rem] font-[600]">{optTest.mrp}</span>
                </div>
                {isHome && !canDoHome && <span className="text-[0.55rem] font-[700] text-gray-400 flex items-center gap-0.5 mt-0.5"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path></svg> Center Only</span>}
              </div>
              
              <button
                onClick={() => {
                  const testToAdd = { 
                    ...optTest, 
                    isStorePickup: !isHome || !canDoHome, 
                    isHomePickup: isHome && canDoHome 
                  };
                  addToCart(testToAdd, [patientId], mockUser.profiles);
                }}
                className="bg-[#111827] text-white px-3 py-1.5 rounded-[10px] text-[0.7rem] font-[900] hover:bg-black transition-all flex items-center gap-1 shrink-0"
              >
                <span>Add</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ——————————————————————————————
// Cart Page
// ——————————————————————————————
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem, updateUserCenter, updateAllHomeItems, bulkUpdateItems, addToCart } = useCart();
  
  const [isSectionOpen, setIsSectionOpen] = useState(null); // profileId for which inline selection is open
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const homeItems = cartItems.filter(i => i.isHomePickup);
  const centerItems = cartItems.filter(i => i.isStorePickup);

  const allHomeAddresses = mockUser.profiles.flatMap(p => p.addresses).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

  // Ensure all items have slots if an address is selected
  useEffect(() => {
    const itemsWithoutSlots = cartItems.filter(item => item.selectedAddress && !item.appointmentSlot);
    if (itemsWithoutSlots.length > 0) {
      const updatesMap = {};
      itemsWithoutSlots.forEach(item => {
        updatesMap[item.cartItemId] = { appointmentSlot: slots[0] };
      });
      bulkUpdateItems(updatesMap);
    }
  }, [cartItems, slots, bulkUpdateItems]);

  // Default address selection for home items
  useEffect(() => {
    if (homeItems.length > 0 && allHomeAddresses.length > 0) {
      if (!homeItems[0].selectedAddress) {
        updateAllHomeItems({ selectedAddress: `${allHomeAddresses[0].tag} - ${allHomeAddresses[0].line1}` });
      }
    }
  }, [homeItems, allHomeAddresses, updateAllHomeItems]);

  const centerItemsByProfile = centerItems.reduce((acc, item) => {
    if (!acc[item.profile.id]) acc[item.profile.id] = [];
    acc[item.profile.id].push(item);
    return acc;
  }, {});

  const profileIds = Object.keys(centerItemsByProfile);
  const currentProfileId = (selectedProfileId && profileIds.includes(selectedProfileId)) 
    ? selectedProfileId 
    : (profileIds[0] || null);


  const totalB2B = cartItems.reduce((sum, item) => {
    if (item.isStorePickup && !item.selectedAddress) return sum;
    return sum + parseInt((item.b2b || '₹0').replace(/[^0-9]/g, ''), 10);
  }, 0);
  const homeTrips = homeItems.length > 0 ? 1 : 0;
  const totalAmount = totalB2B + (homeTrips * 50);

  const allCentersSelected = centerItems.every(item => !!item.selectedAddress);
  const allSlotsSelected = cartItems.every(item => !!item.appointmentSlot);
  
  const showAddressWarning = centerItems.length > 0 && !allCentersSelected;
  const showSlotWarning = !allSlotsSelected && (homeItems.length > 0 || (centerItems.length > 0 && allCentersSelected));
  const disableCheckout = showAddressWarning || showSlotWarning;

  return (
    <div className="app-shell min-h-screen bg-[#f1f3f6] pb-[160px] font-sans text-gray-800">
      <CommonHeader />

      <main className="max-w-[800px] mx-auto w-full px-4 md:px-5">
        <button
          className="flex items-center gap-1.5 text-[#111827] font-[700] text-[0.9rem] py-2.5 mt-1 bg-transparent border-none cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back
        </button>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[16px] p-8 text-center shadow-sm">
            <svg className="mx-auto mb-3 text-[#9ca3af]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <h3 className="m-0 text-[#374151] font-[700] text-[1rem]">Your cart is empty</h3>
            <p className="mt-1.5 text-[#6b7280] text-[0.85rem]">Add tests from the search page to get started.</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-5 bg-[#111827] text-white px-6 py-2.5 rounded-[12px] font-[800] hover:bg-black transition-all"
            >
              Search Tests
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-1">
            {showAddressWarning && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded-[10px] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span className="text-[#92400e] text-[0.8rem] font-[700]">Center Visit orders require a location.</span>
              </div>
            )}
            {showSlotWarning && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded-[10px] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span className="text-[#92400e] text-[0.8rem] font-[700]">Please select appointment slots for all items.</span>
              </div>
            )}
            <h2 className="m-0 text-[#111827] font-[900] text-[1.4rem]">Checkout</h2>

            {/* Home Pickup */}
            {homeItems.length > 0 && (
              <section className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-[#e5e7eb]">
                <div className="bg-[#f0fdf9] border-b border-[#ccfbf1] px-4 py-3 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <h3 className="m-0 text-[#0f766e] font-[800] text-[1rem]">Home Sample Collection</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {homeItems.map(item => (
                    <div key={item.cartItemId} className="border-b border-[#f3f4f6] pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="m-0 text-[0.9rem] font-[800] text-[#111827]">{item.testName}</h4>
                          <p className="m-0 text-[#6b7280] text-[0.75rem] mt-0.5">Patient: <span className="font-[600] text-[#374151]">{item.profile.name}</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-[800] text-[#111827] text-[0.95rem]">{item.b2b}</span>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-[#ef4444] text-[0.7rem] font-[700] hover:underline bg-transparent border-none p-0">Remove</button>
                        </div>
                      </div>
                      <SmartAddons 
                        testId={item.testId} 
                        patientId={item.profile.id} 
                        isHome={true} 
                        addToCart={addToCart} 
                        updateAllHomeItems={updateAllHomeItems}
                        updateCartItem={updateCartItem}
                        bulkUpdateItems={bulkUpdateItems}
                        allHomeAddresses={allHomeAddresses}
                        slots={slots}
                      />
                    </div>
                  ))}
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-3.5 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#6b7280] text-[0.65rem] font-[800] uppercase tracking-wider">Address</label>
                        <select 
                          className="bg-white border border-[#d1d5db] rounded-[8px] px-2.5 py-2 text-[0.85rem] font-[700] focus:ring-2 focus:ring-[#0f766e]/20 outline-none"
                          value={homeItems[0]?.selectedAddress || ''}
                          onChange={(e) => {
                            const updates = { selectedAddress: e.target.value };
                            if (e.target.value && !homeItems[0]?.appointmentSlot) {
                              updates.appointmentSlot = slots[0];
                            }
                            updateAllHomeItems(updates);
                          }}
                        >
                        <option value="">Select Address</option>
                        {allHomeAddresses.map(a => <option key={a.id} value={`${a.tag} - ${a.line1}`}>{a.tag} - {a.line1}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#6b7280] text-[0.65rem] font-[800] uppercase tracking-wider">Slot</label>
                      <select
                        className="bg-white border border-[#d1d5db] rounded-[8px] px-2.5 py-2 text-[0.85rem] font-[700] outline-none disabled:bg-gray-50"
                        disabled={!homeItems[0]?.selectedAddress}
                        value={homeItems[0]?.appointmentSlot || ''}
                        onChange={e => updateAllHomeItems({ appointmentSlot: e.target.value })}
                      >
                        <option value="">Select Slot</option>
                        {slots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Center Visit */}
            {profileIds.length > 0 && (
              <section className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-[#e5e7eb]">
                <div className="bg-[#fef2f2] border-b border-[#fecaca] px-4 py-3 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path></svg>
                  <h3 className="m-0 text-[#dc2626] font-[800] text-[1rem]">Center Visit</h3>
                </div>
                
                {/* Horizontal Tab Switcher */}
                <div className="flex border-b border-[#f3f4f6] overflow-x-auto no-scrollbar bg-[#fcfcfc]">
                  {profileIds.map(pid => {
                    const isActive = currentProfileId === pid;
                    const patientName = centerItemsByProfile[pid][0].profile.name;
                    const testCount = centerItemsByProfile[pid].length;
                    return (
                      <button
                        key={pid}
                        onClick={() => setSelectedProfileId(pid)}
                        className={`flex items-center gap-2 px-5 py-3 transition-all border-b-2 font-[800] text-[0.85rem] whitespace-nowrap cursor-pointer ${
                          isActive 
                            ? 'border-[#dc2626] text-[#dc2626] bg-white' 
                            : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:bg-gray-50'
                        }`}
                      >
                        <span>{patientName}</span>
                        <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[0.6rem] font-[900] ${isActive ? 'bg-[#dc2626] text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {testCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 flex flex-col gap-4">

                  {currentProfileId && (() => {
                    const items = centerItemsByProfile[currentProfileId];
                    const sharedAddress = items[0].selectedAddress;
                    return (
                      <div className="flex flex-col gap-3">
                        <div className="bg-[#f9fafb] p-3 rounded-[12px] border border-[#f0f0f0]">
                          <div className="space-y-3">
                            {items.map(item => (
                              <React.Fragment key={item.cartItemId}>
                                <div className="flex justify-between items-start pt-2.5 first:pt-0 border-t border-[#f0f0f0] first:border-0">
                                  <div>
                                    <h4 className="m-0 text-[0.9rem] font-[800] text-[#111827]">{item.testName}</h4>
                                    <span className="text-[0.65rem] font-[700] text-[#6b7280]">{item.b2b}</span>
                                  </div>
                                  <button onClick={() => removeFromCart(item.cartItemId)} className="text-[#ef4444] text-[0.7rem] font-[700] hover:underline bg-transparent border-none p-0 mt-0.5">Remove</button>
                                </div>
                                <SmartAddons 
                                  testId={item.testId} 
                                  patientId={currentProfileId} 
                                  isHome={false} 
                                  sharedAddress={sharedAddress}
                                  addToCart={addToCart}
                                  updateUserCenter={updateUserCenter}
                                  updateCartItem={updateCartItem}
                                  bulkUpdateItems={bulkUpdateItems}
                                  slots={slots}
                                />
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#f0fdf9] border border-[#ccfbf1] rounded-[12px] p-3">
                          <label className="text-[#0f766e] text-[0.65rem] font-[800] uppercase tracking-wider block mb-1.5">Collection Centre</label>
                          {sharedAddress && isSectionOpen !== currentProfileId ? (
                            <div className="flex items-start justify-between gap-2 bg-white p-3 rounded-[10px] border border-[#ccfbf1]">
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="font-[900] text-[#111827] text-[0.9rem]">{sharedAddress.name}</span>
                                  <div className="flex items-center gap-0.5 bg-[#fef9c3] px-1 py-0.5 rounded-[4px] text-[0.65rem] font-[800]">
                                    <span className="text-[#a16207]">{sharedAddress.rating}</span>
                                  </div>
                                  {sharedAddress.isNablCertified && <span className="bg-[#dcfce7] text-[#15803d] px-1 py-0.5 rounded-[4px] text-[0.55rem] font-[900]">NABL</span>}
                                </div>
                                <p className="m-0 text-[#6b7280] text-[0.75rem]">{sharedAddress.address} · <span className="text-[#0f766e] font-[800]">{sharedAddress.distance}</span></p>
                              </div>
                              <button onClick={() => setIsSectionOpen(currentProfileId)} className="bg-[#ccfbf1] text-[#0f766e] h-max px-3 py-1.5 rounded-[8px] font-[800] text-[0.75rem] border-none transition-all hover:bg-[#99f6e4]">Change</button>
                            </div>
                          ) : (
                            <CenterSelectionInline 
                              currentSelectedId={sharedAddress?.id}
                              onSelect={loc => {
                                updateUserCenter(currentProfileId, loc);
                                // Default slot if none set
                                if (!items[0]?.appointmentSlot) {
                                  items.forEach(i => updateCartItem(i.cartItemId, { appointmentSlot: slots[0] }));
                                }
                                setIsSectionOpen(null);
                              }}
                            />
                          )}
                          <div className="mt-3">
                            <label className="text-[#0f766e] text-[0.65rem] font-[800] uppercase tracking-wider block mb-1.5">Visit Slot</label>
                            <select
                              className="w-full bg-white border border-[#ccfbf1] rounded-[10px] px-3 py-2 text-[0.85rem] font-[800] outline-none disabled:opacity-50"
                              disabled={!sharedAddress}
                              value={items[0]?.appointmentSlot || ''}
                              onChange={e => items.forEach(i => updateCartItem(i.cartItemId, { appointmentSlot: e.target.value }))}
                            >
                              <option value="">Select Slot</option>
                              {slots.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>
            )}
          </div>
        )}
      </main>


      {/* FIXED BOTTOM SUMMARY BAR - Shifted above bottom navbar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-[65px] left-0 right-0 z-[150] bg-white border-t border-[#e5e7eb] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] rounded-t-[20px] pb-safe">
          {isSummaryExpanded && (
            <div className="max-w-[800px] mx-auto px-5 py-4 animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h4 className="m-0 font-[900] text-[1.1rem] text-[#111827]">Order Breakdown</h4>
                <button onClick={() => setIsSummaryExpanded(false)} className="bg-[#f3f4f6] text-[#6b7280] w-7 h-7 rounded-full flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
              </div>
              <div className="space-y-2.5">
                {Object.entries(cartItems.reduce((acc, item) => {
                  // Skip cost for center items without a selected address to match payable total
                  if (item.isStorePickup && !item.selectedAddress) return acc;
                  
                  if (!acc[item.profile.id]) acc[item.profile.id] = { name: item.profile.name, count: 0, cost: 0 };
                  acc[item.profile.id].count += 1;
                  acc[item.profile.id].cost += parseInt((item.b2b || '₹0').replace(/[^0-9]/g, ''), 10);
                  return acc;
                }, {})).map(([id, data]) => (
                  <div key={id} className="flex justify-between items-center py-2.5 px-3.5 bg-[#f9fafb] rounded-[12px]">
                    <div className="flex flex-col">
                      <span className="font-[800] text-[#111827] text-[0.95rem]">{data.name}</span>
                      <span className="text-[0.7rem] text-[#6b7280] font-[600]">{data.count} test{data.count > 1 ? 's' : ''}</span>
                    </div>
                    <span className="font-[900] text-[#111827]">₹{data.cost}</span>
                  </div>
                ))}
                {homeTrips > 0 && (
                  <div className="flex justify-between items-center py-2.5 px-3.5 bg-[#f0fdf9] border border-[#ccfbf1] rounded-[12px]">
                    <span className="font-[800] text-[#0f766e] text-[0.9rem]">Home Collection</span>
                    <span className="font-[900] text-[#0f766e]">₹50</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="max-w-[800px] mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
              <div className="flex flex-col">
                <span className="text-[#6b7280] text-[0.6rem] font-[900] uppercase tracking-widest">Payable Amount</span>
                <span className="text-[#111827] text-[1.2rem] font-[1000] leading-none mt-1">₹{totalAmount}</span>
              </div>
              <div className={`w-7 h-7 rounded-full border-2 border-[#e5e7eb] flex items-center justify-center transition-all group-hover:bg-[#f3f4f6] ${isSummaryExpanded ? 'rotate-180 bg-[#111827] border-[#111827] text-white' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            
            <button
              onClick={() => setIsReviewOpen(true)}
              disabled={disableCheckout}
              className={`flex-1 rounded-[14px] py-3.5 font-[900] text-[1rem] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] ${
                disableCheckout 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-[#111827] text-white hover:bg-black'
              }`}
            >
              Review Details
            </button>
          </div>
        </div>
      )}

      {isReviewOpen && (
        <ReviewModal 
          cartItems={cartItems} 
          totalAmount={totalAmount} 
          homeTrips={homeTrips} 
          onClose={() => setIsReviewOpen(false)} 
        />
      )}
    </div>
  );
};

export default CartPage;
