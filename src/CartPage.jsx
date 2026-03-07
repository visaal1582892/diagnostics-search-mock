import React, { useState, useEffect, useMemo } from 'react';
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
const CenterSelectionInline = ({ onSelect, currentSelectedId, globalFilters, patientTests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get filtered base locations based on global filters
  let baseLocations = globalFilters.sortBy === 'cheapest' ? mockPickupLocations.cheapestFirst : mockPickupLocations.nearestFirst;
  
  if (globalFilters.nablOnly) {
    baseLocations = baseLocations.filter(l => l.isNablCertified);
  }
  
  if (globalFilters.collaboratedOnly) {
    baseLocations = baseLocations.filter(l => l.isMedplusCollaborated);
  }
  
  if (globalFilters.selectedCompanies.length > 0) {
    baseLocations = baseLocations.filter(l => globalFilters.selectedCompanies.includes(l.company));
  }

  // Multi-Center Logic
  // patientTests is an array of test objects: { id (cartItemId), testId (mockTest ID), name }
  const requiredTestIds = patientTests.map(t => t.testId);

  // 1. Find centers that support ALL tests
  const fullSupportCenters = baseLocations.filter(loc => 
    requiredTestIds.every(tid => loc.supportedTests.includes(tid))
  ).map(loc => ({ ...loc, type: 'single', supportedCount: requiredTestIds.length }));

  // 2. If some tests are missing or if we want to show combinations even when single centers exist
  let combinations = [];
  if (requiredTestIds.length > 1) {
    // Highly simplified: Find pairs that together cover all tests
    // In a real app, this would be a more complex constraint solver
    for (let i = 0; i < baseLocations.length; i++) {
      for (let j = i + 1; j < baseLocations.length; j++) {
        const locA = baseLocations[i];
        const locB = baseLocations[j];
        const combinedSupported = new Set([...locA.supportedTests, ...locB.supportedTests]);
        
        if (requiredTestIds.every(tid => combinedSupported.has(tid))) {
          // Check if either alone can't do it (to avoid redundant combos if single is enough)
          const locACanDoAll = requiredTestIds.every(tid => locA.supportedTests.includes(tid));
          const locBCanDoAll = requiredTestIds.every(tid => locB.supportedTests.includes(tid));
          
          if (true) {
             let testsForA = patientTests.filter(t => locA.supportedTests.includes(t.testId));
             let testsForB = patientTests.filter(t => locB.supportedTests.includes(t.testId) && !locA.supportedTests.includes(t.testId));
             
             // If locA supports EVERYTHING and locB supports something already in testsForA,
             // let's split them to make a "real" combination
             if (testsForB.length === 0 && testsForA.length > 1) {
                const moveableToB = testsForA.filter(t => locB.supportedTests.includes(t.testId));
                if (moveableToB.length > 0) {
                   const testForB = moveableToB[0];
                   testsForB = [testForB];
                   testsForA = testsForA.filter(t => t.cartItemId !== testForB.cartItemId);
                }
             }

             if (testsForA.length > 0 && testsForB.length > 0) {
               combinations.push({
                 id: `combo-${locA.id}-${locB.id}`,
                 type: 'combo',
                 centers: [locA, locB],
                 testsByCenter: [testsForA, testsForB],
                 price: `₹${parseInt(locA.price.replace(/\D/g,'')) + parseInt(locB.price.replace(/\D/g,''))}`,
                 mrp: `₹${parseInt(locA.mrp.replace(/\D/g,'')) + parseInt(locB.mrp.replace(/\D/g,''))}`,
                 name: `${locA.name} + ${locB.name}`,
                 rating: (locA.rating + locB.rating) / 2,
                 distance: `${locA.distance} & ${locB.distance}`,
                 isNablCertified: locA.isNablCertified && locB.isNablCertified
               });
             }
          }
        }
      }
    }
  }

  // Prioritize single centers that support all tests, then combinations
  const allOptions = [...fullSupportCenters, ...combinations];

  // Pagination logic
  const totalPages = Math.ceil(allOptions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOptions = allOptions.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [globalFilters, patientTests.length]);

  return (
    <div className="bg-white border border-[#ccfbf1] rounded-[16px] overflow-hidden shadow-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-4 bg-[#f0fdf9]/50 border-b border-[#ccfbf1] flex lg:hidden flex-wrap items-center justify-between gap-3">
        <span className="text-[0.7rem] font-[800] text-[#0f766e] uppercase tracking-wider">Filters Active</span>
      </div>

      <div className="flex flex-col">
        {currentOptions.length === 0 ? (
          <div className="p-8 text-center text-[#6b7280]">
            <p className="m-0 font-[700] text-[0.85rem]">No centers found for this combination of tests.</p>
            <p className="m-0 text-[0.75rem] mt-1">Try relaxing filters or removing some tests.</p>
          </div>
        ) : currentOptions.map(opt => (
          <div
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={`p-4 border-b border-[#f0fdf9] flex items-start gap-3 cursor-pointer transition-all hover:bg-[#f0fdf9]/30 ${currentSelectedId === opt.id ? 'bg-[#f0fdf9]' : ''}`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${currentSelectedId === opt.id ? 'border-[#0f766e]' : 'border-gray-300'}`}>
              {currentSelectedId === opt.id && <div className="w-2 h-2 rounded-full bg-[#0f766e]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  {opt.type === 'combo' ? (
                    <div className="flex flex-col gap-1">
                      <span className="bg-[#111827] text-white text-[0.55rem] font-[900] px-1.5 py-0.5 rounded-full w-fit uppercase tracking-tighter mb-1">Center Combination</span>
                      <h4 className="m-0 text-[0.85rem] font-[900] text-[#111827] leading-tight">{opt.centers[0].name}</h4>
                      <div className="flex items-center gap-1.5 text-[0.7rem] text-[#6b7280] font-[600]">
                         <span className="text-[#0f766e] font-[800]">Fits:</span> {opt.testsByCenter[0].map(t => t.testName).join(', ')}
                      </div>
                      <h4 className="m-0 mt-1.5 text-[0.85rem] font-[900] text-[#111827] leading-tight">{opt.centers[1].name}</h4>
                      <div className="flex items-center gap-1.5 text-[0.7rem] text-[#6b7280] font-[600]">
                         <span className="text-[#0f766e] font-[800]">Fits:</span> {opt.testsByCenter[1].map(t => t.testName).join(', ')}
                      </div>
                    </div>
                  ) : (
                    <h4 className="m-0 text-[0.85rem] font-[800] text-[#111827] leading-tight">{opt.name}</h4>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-[#fef9c3] text-[#a16207] px-1.5 py-0.5 rounded-[4px] text-[0.6rem] font-[900] flex items-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {opt.rating.toFixed(1)}
                    </span>
                    {opt.isNablCertified && <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded-[4px] text-[0.55rem] font-[900] uppercase">NABL</span>}
                    <span className="text-[#6b7280] text-[0.7rem] font-[600]">{opt.distance}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#111827] font-[900] text-[1.1rem] leading-none">{opt.price}</div>
                  <div className="text-[#9ca3af] line-through text-[0.7rem] mt-1">{opt.mrp}</div>
                  <div className="text-[#0f766e] text-[0.6rem] font-[800] mt-1 whitespace-nowrap">Total Center Fee</div>
                </div>
              </div>
              {opt.type !== 'combo' && <p className="m-0 mt-2 text-[#6b7280] text-[0.7rem] line-clamp-1">{opt.address}</p>}
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
                className={`w-8 h-8 rounded-[8px] text-[0.75rem] font-[900] transition-all ${currentPage === i + 1
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
const SmartAddons = ({ testId, patientId, isHome, sharedAddress, addToCart, updateUserCenter, updateAllHomeItems, updateCartItem, bulkUpdateItems, allHomeAddresses, slots, cartItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentTest = mockTests.find(t => t.id === testId);
  if (!currentTest?.smartOptions) return null;

  // Filter out options that are already in the cart for THIS patient
  const availableOptions = currentTest.smartOptions.filter(optId => {
    return !cartItems.some(item => item.testId === optId && item.profile.id === patientId);
  });

  if (availableOptions.length === 0) return null;

  return (
    <div className={`mt-3 mb-4 rounded-[16px] overflow-hidden border border-dashed transition-all duration-300 ${isHome ? 'border-[#0f766e]/30 bg-[#f0fdf9]/30' : 'border-[#dc2626]/20 bg-[#fef2f2]/30'}`}>
      <div 
        className={`px-3 py-2 flex items-center justify-between cursor-pointer select-none ${isHome ? 'bg-[#0f766e]/5' : 'bg-[#dc2626]/5'}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></path></svg>
          </div>
          <span className={`text-[0.65rem] font-[900] uppercase tracking-wider ${isHome ? 'text-[#0f766e]' : 'text-[#dc2626]'}`}>Exclusive Flash Offers ({availableOptions.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && <span className="bg-red-500 text-white text-[0.55rem] font-[1000] px-1.5 py-0.5 rounded-full animate-pulse">LIMITED TIME</span>}
          <svg 
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-2.5 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
          {availableOptions.map(optId => {
            const optTest = mockTests.find(t => t.id === optId);
            if (!optTest) return null;

          const canDoHome = optTest.isHomePickup;
          const discountedPrice = parseInt(optTest.b2b.replace(/\D/g, ''));
          const mrpPrice = parseInt(optTest.mrp.replace(/\D/g, ''));
          const discountPercent = Math.round(((mrpPrice - discountedPrice) / mrpPrice) * 100);

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
      )}
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
  
  // Global Filters for Centers
  const [globalFilters, setGlobalFilters] = useState({
    sortBy: 'cheapest',
    nablOnly: false,
    collaboratedOnly: false,
    selectedCompanies: []
  });

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


  const totalB2BTests = cartItems.reduce((sum, item) => {
    if (item.isStorePickup && !item.selectedAddress) return sum;
    return sum + parseInt((item.b2b || '₹0').replace(/[^0-9]/g, ''), 10);
  }, 0);

  const centerFees = Object.values(centerItemsByProfile).reduce((sum, items) => {
    const selectedAddress = items[0]?.selectedAddress;
    if (selectedAddress) {
      return sum + parseInt((selectedAddress.price || '₹0').replace(/[^0-9]/g, ''), 10);
    }
    return sum;
  }, 0);

  const homeTrips = homeItems.length > 0 ? 1 : 0;
  const totalAmount = totalB2BTests + (homeTrips * 50) + centerFees;

  const allCentersSelected = centerItems.every(item => !!item.selectedAddress);
  const allSlotsSelected = cartItems.every(item => !!item.appointmentSlot);

  const showAddressWarning = centerItems.length > 0 && !allCentersSelected;
  const showSlotWarning = !allSlotsSelected && (cartItems.length > 0 || (centerItems.length > 0 && allCentersSelected));
  const disableCheckout = useMemo(() => showAddressWarning || showSlotWarning, [showAddressWarning, showSlotWarning]);

  return (
    <div className="app-shell min-h-screen bg-[#f1f3f6] pb-[280px] lg:pb-24 font-sans text-gray-800">
      <CommonHeader />

      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-24 bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path></svg>
            <h3 className="m-0 font-[900] text-[1.1rem] text-[#111827]">Filter Centers</h3>
          </div>

          <div className="space-y-8">
             {/* Sort Optimization */}
             <div>
                <label className="text-[0.65rem] font-[900] text-gray-400 uppercase tracking-widest block mb-3">Sort By</label>
                <div className="flex flex-col gap-2">
                  {['cheapest', 'nearest'].map(s => (
                    <button
                      key={s}
                      onClick={() => setGlobalFilters(f => ({ ...f, sortBy: s }))}
                      className={`px-4 py-2.5 rounded-[12px] text-[0.85rem] font-[800] transition-all text-left border-2 ${
                        globalFilters.sortBy === s ? 'bg-[#111827] text-white border-[#111827]' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)} First
                    </button>
                  ))}
                </div>
             </div>

             {/* Dynamic Filter Toggles */}
             <div className="space-y-3">
                <label className="text-[0.65rem] font-[900] text-gray-400 uppercase tracking-widest block mb-1">Preferences</label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[0.85rem] font-[700] text-gray-700 group-hover:text-black">NABL Certified</span>
                  <input 
                    type="checkbox" 
                    checked={globalFilters.nablOnly}
                    onChange={e => setGlobalFilters(f => ({ ...f, nablOnly: e.target.checked }))}
                    className="w-5 h-5 rounded-[6px] border-gray-300 text-[#0f766e] focus:ring-[#0f766e]" 
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[0.85rem] font-[700] text-gray-700 group-hover:text-black">Medplus Collaborated</span>
                  <input 
                    type="checkbox" 
                    checked={globalFilters.collaboratedOnly}
                    onChange={e => setGlobalFilters(f => ({ ...f, collaboratedOnly: e.target.checked }))}
                    className="w-5 h-5 rounded-[6px] border-gray-300 text-[#0f766e] focus:ring-[#0f766e]" 
                  />
                </label>
             </div>

             {/* Company Multi-select */}
             <div>
                <label className="text-[0.65rem] font-[900] text-gray-400 uppercase tracking-widest block mb-3">Companies</label>
                <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {[...new Set(mockPickupLocations.cheapestFirst.map(l => l.company))].map(comp => (
                    <label key={comp} className="flex items-center gap-3 py-2 px-3 rounded-[10px] hover:bg-gray-50 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={globalFilters.selectedCompanies.includes(comp)}
                        onChange={e => {
                          const checked = e.target.checked;
                          setGlobalFilters(f => ({
                            ...f,
                            selectedCompanies: checked 
                              ? [...f.selectedCompanies, comp]
                              : f.selectedCompanies.filter(c => c !== comp)
                          }));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#111827] focus:ring-[#111827]"
                      />
                      <span className="text-[0.8rem] font-[700] text-gray-600 group-hover:text-black">{comp}</span>
                    </label>
                  ))}
                </div>
             </div>
          </div>
        </aside>

        {/* Cart Main Area */}
        <div className="flex flex-col min-w-0">
          <button
            className="flex items-center gap-1.5 text-[#111827] font-[700] text-[0.9rem] py-2.5 bg-transparent border-none cursor-pointer w-fit"
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
                        cartItems={cartItems}
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
                        className={`flex items-center gap-2 px-5 py-3 transition-all border-b-2 font-[800] text-[0.85rem] whitespace-nowrap cursor-pointer ${isActive
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
                                <div className="flex justify-between items-stretch pt-3 pb-2 first:pt-0 border-t border-[#f0f0f0] first:border-0 w-full">
                                  <div className="flex flex-col justify-start">
                                    <h4 className="m-0 text-[1.1rem] md:text-[1.15rem] font-[900] text-[#111827] leading-tight">{item.testName}</h4>
                                    <p className="m-0 text-[#6b7280] text-[0.8rem] mt-1 font-[600]">Patient: <span className="text-[#111827]">{item.profile.name}</span></p>
                                    {sharedAddress?.type === 'combo' && (
                                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span className="bg-[#ccfbf1]/50 border border-[#99f6e4] text-[#0f766e] text-[0.55rem] font-[900] px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider">Assigned Center</span>
                                        <span className="text-[#111827] text-[0.75rem] font-[800] line-clamp-1">
                                          {sharedAddress.testsByCenter[0].some(t => t.cartItemId === item.cartItemId) ? sharedAddress.centers[0].name : sharedAddress.centers[1].name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end shrink-0 pl-4 text-right">
                                    <div className="mb-2 min-h-[1.5rem] flex items-end">
                                      {sharedAddress && (
                                        <span className="font-[900] text-[#111827] text-[1.2rem] md:text-[1.3rem] block leading-none">
                                          {item.b2b}
                                        </span>
                                      )}
                                    </div>
                                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-[#ef4444] text-[0.75rem] font-[800] hover:underline bg-transparent border-none p-0 mt-auto uppercase tracking-widest transition-all hover:text-red-600">Remove Test</button>
                                  </div>
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
                                  cartItems={cartItems}
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
                              globalFilters={globalFilters}
                              patientTests={items}
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
        </div>
      </main>


      {/* FIXED BOTTOM SUMMARY BAR - Responsive layout */}
      {cartItems.length > 0 && (
        <div className={`fixed z-[150] bg-white transition-all duration-300 ease-in-out
          ${isSummaryExpanded ? 'shadow-[0_-20px_50px_rgba(0,0,0,0.15)]' : 'shadow-[0_-10px_30px_rgba(0,0,0,0.08)]'}
          /* Mobile: fixed bottom above nav */
          bottom-[65px] left-0 right-0 border-t border-[#e5e7eb] rounded-t-[24px] pb-safe
          /* Desktop: centered and stuck to bottom */
          md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-[800px] md:border-x md:border-t md:rounded-t-[24px] md:rounded-b-0 md:pb-0
        `}>
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

                {/* Center Fees in Breakdown */}
                {Object.values(centerItemsByProfile).map((items, idx) => {
                  const addr = items[0]?.selectedAddress;
                  if (!addr) return null;
                  return (
                    <div key={`cf-${idx}`} className="flex justify-between items-center py-2.5 px-3.5 bg-[#f9fafb] rounded-[12px] border border-gray-100 italic">
                      <span className="font-[700] text-gray-500 text-[0.8rem]">Center Visit Fee ({items[0].profile.name})</span>
                      <span className="font-[800] text-gray-600 text-[0.85rem]">{addr.price}</span>
                    </div>
                  );
                })}

                {homeTrips > 0 && (
                  <div className="flex justify-between items-center py-2.5 px-3.5 bg-[#f0fdf9] border border-[#ccfbf1] rounded-[12px]">
                    <span className="font-[800] text-[#0f766e] text-[0.9rem]">Home Collection Charges</span>
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
              className={`flex-1 rounded-[14px] py-3.5 font-[900] text-[1rem] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] ${disableCheckout
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
