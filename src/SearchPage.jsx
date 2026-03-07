import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonHeader from './CommonHeader';
import { mockTests, mockUser } from './mockData';
import { useCart } from './CartContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);

  // Handle opening the modal specifically for CBP
  const handleAddToCartClick = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
    // Auto-select "Self" profile by default if desired, or leave empty
    const selfProfile = mockUser.profiles.find(p => p.relation === 'Self');
    if (selfProfile) {
      setSelectedPatients([selfProfile.id]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
    setSelectedPatients([]);
  };

  const togglePatientSelection = (profileId) => {
    setSelectedPatients(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const toggleAllPatients = () => {
    if (selectedPatients.length === mockUser.profiles.length) {
      setSelectedPatients([]); // Deselect all
    } else {
      setSelectedPatients(mockUser.profiles.map(p => p.id)); // Select all
    }
  };

  const proceedToCart = () => {
    // Add one cart item per selected patient
    addToCart(selectedTest, selectedPatients, mockUser.profiles);
    closeModal();
    navigate('/cart');
  };

  const filteredTests = mockTests.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-shell min-h-screen bg-[#f1f3f6] pb-24 font-sans text-gray-800 selection:bg-red-200">
      <CommonHeader />

      <main className="w-full mx-auto px-4 py-4 md:px-5 md:py-6">
        {/* Search Input Block */}
        <div className="bg-white border border-[#e8eaf0] rounded-[0.8rem] p-4 shadow-[0_10px_24px_rgba(16,24,40,0.08)] mb-[14px]">
          <div className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search for tests or profiles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#d2d8e5] rounded-[0.8rem] py-[12px] pr-[14px] pl-[38px] text-[0.95rem] outline-none transition-colors focus:border-[#d9232d]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 flex items-center justify-center w-6 h-6 border-none rounded-full bg-[#e5e7eb] text-[#6b7280] cursor-pointer hover:bg-[#d1d5db]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white border border-[#e8eaf0] rounded-[0.8rem] shadow-[0_10px_24px_rgba(16,24,40,0.08)] overflow-hidden">
          {!searchTerm ? (
            <div className="p-8 text-center text-[#6b7280] font-medium text-[0.9rem]">
              Start typing to search for tests or profiles.
            </div>
          ) : filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test.id} className="flex flex-col gap-3 px-[14px] py-[16px] bg-white border-b border-[#f0f0f0] last:border-b-0 cursor-pointer hover:bg-[#f8f9fd] transition-colors">
                
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col gap-[4px] min-w-0">
                    <h3 className="m-0 text-[0.95rem] font-[700] leading-tight text-[#131728] tracking-tight text-left">{test.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mt-1 justify-start">
                      <span className="bg-[#e6fcf5] text-[#0f766e] px-2 py-0.5 rounded-[4px] text-[0.7rem] font-[700]">{test.tag}</span>
                      <span className="bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-[4px] text-[0.7rem] font-[700]">{test.collectionType}</span>
                    </div>

                    {/* Show price under name for Home Pickup */}
                    {test.isHomePickup && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-[800] text-[1.1rem] text-[#111827]">{test.b2b}</span>
                        <span className="text-[#6b7280] line-through text-[0.85rem] font-[500]">{test.mrp}</span>
                      </div>
                    )}
                  </div>

                   <div className="flex flex-col items-end shrink-0 gap-2">
                    {/* Render specific UI for variants */}
                    {test.isStorePickup ? (
                      <div className="flex flex-col items-end gap-2 h-full justify-center mt-2.5">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleAddToCartClick(test); }}
                           className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] flex items-center justify-center px-5 py-2 rounded-[6px] font-[700] text-[0.85rem] hover:bg-[#c8e6c9] transition-colors h-[32px] min-w-[70px] shadow-sm"
                         >
                           Add
                         </button>
                      </div>
                    ) : test.isHomePickup ? (
                      <div className="flex flex-col items-end gap-2 h-full justify-center mt-2.5">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleAddToCartClick(test); }}
                           className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] flex items-center justify-center px-5 py-2 rounded-[6px] font-[700] text-[0.85rem] hover:bg-[#c8e6c9] transition-colors h-[32px] min-w-[70px] shadow-sm"
                         >
                           Add
                         </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col items-end">
                          <span className="font-[800] text-[1.1rem] text-[#111827]">{test.b2b}</span>
                          <span className="text-[#6b7280] line-through text-[0.8rem] font-[500]">{test.mrp}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddToCartClick(test); }}
                          className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] flex items-center justify-center px-5 py-2 rounded-[6px] font-[700] text-[0.85rem] hover:bg-[#c8e6c9] transition-colors h-[32px] min-w-[70px] shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#6b7280] font-medium text-[0.9rem]">
              No tests found. Try a different search.
            </div>
          )}
        </div>
      </main>
      {/* Patient Selection Bottom Sheet Modal */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
          {/* Modal Content */}
          <div className="bg-white w-full sm:w-[480px] sm:rounded-[20px] rounded-t-[20px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <h3 className="m-0 text-[1.25rem] font-[800] text-[#111827] mb-1">Book Test</h3>
                <p className="m-0 text-[#4b5563] text-[0.9rem]">{selectedTest.name}</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors self-start"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-2 overflow-y-auto">
              
              {/* Select Patients Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.8rem] font-[800] text-[#6b7280] tracking-wider uppercase">Select Patient(s)</span>
                  <button 
                    onClick={toggleAllPatients}
                    className="text-[0.85rem] font-[700] text-[#0f766e] bg-transparent border-none cursor-pointer p-0"
                  >
                    Select All
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {mockUser.profiles.map((profile) => (
                    <label key={profile.id} className="flex items-center gap-3 p-3 border border-[#e5e7eb] rounded-[10px] cursor-pointer hover:bg-[#f9fafb] transition-colors relative">
                      <input 
                        type="checkbox" 
                        className="absolute opacity-0 w-0 h-0"
                        checked={selectedPatients.includes(profile.id)}
                        onChange={() => togglePatientSelection(profile.id)}
                      />
                      <div className={`w-[20px] h-[20px] rounded-[6px] border flex items-center justify-center transition-colors ${selectedPatients.includes(profile.id) ? 'bg-[#111827] border-[#111827]' : 'border-[#d1d5db] bg-white'}`}>
                        {selectedPatients.includes(profile.id) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                      </div>
                      <span className="text-[#1f2937] font-[600] text-[0.95rem]">
                        {profile.name} <span className="text-[#6b7280] font-[500]">({profile.relation})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Collection Mode Section */}
              <div className="mb-4">
                <div className="mb-3">
                  <span className="text-[0.8rem] font-[800] text-[#6b7280] tracking-wider uppercase">Collection Mode</span>
                </div>
                
                {selectedTest.isStorePickup || selectedTest.collectionType === "Center Visit Only" ? (
                  <div className="border border-[#0f766e] bg-[#f0fdf9] rounded-[10px] p-3.5 flex items-start gap-3">
                     <div className="mt-0.5 text-[#0f766e]">
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <rect x="3" y="10" width="18" height="12" rx="2"></rect>
                         <path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                         <path d="M10 22v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"></path>
                         <path d="M8 10h8"></path>
                       </svg>
                     </div>
                     <div className="flex flex-col">
                       <span className="font-[800] text-[#0f766e] text-[0.95rem]">Center Visit Only</span>
                       <span className="text-[#4b5563] text-[0.85rem] mt-0.5">Visit the center to give the sample</span>
                     </div>
                  </div>
                ) : (
                  <div className="border border-[#0f766e] bg-[#f0fdf9] rounded-[10px] p-3.5 flex items-start gap-3">
                     <div className="mt-0.5 text-[#0f766e]">
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                     </div>
                     <div className="flex flex-col">
                       <span className="font-[800] text-[#0f766e] text-[0.95rem]">Home Sample Pickup</span>
                       <span className="text-[#4b5563] text-[0.85rem] mt-0.5">Sample picked from your home · +₹50 collection charges</span>
                     </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-4 border-t border-[#f0f0f0] flex items-center justify-end gap-3 bg-white mt-auto rounded-b-[20px]">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 rounded-[10px] border border-[#d1d5db] text-[#374151] font-[700] bg-white hover:bg-[#f9fafb] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={proceedToCart}
                disabled={selectedPatients.length === 0}
                className={`px-6 py-2.5 rounded-[10px] font-[800] text-white transition-colors ${selectedPatients.length > 0 ? 'bg-[#111827] hover:bg-black' : 'bg-[#e5e7eb] cursor-not-allowed'}`}
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
