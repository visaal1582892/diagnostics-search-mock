import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('medplus_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('medplus_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add items to cart - one per selected patient
  const addToCart = (test, selectedPatientIds, allProfiles) => {
    // Filter out patient IDs who already have this testId in the cart
    const patientsToAdd = selectedPatientIds.filter(profileId => {
      const alreadyHasTest = cartItems.some(item => item.testId === test.id && item.profile.id === profileId);
      return !alreadyHasTest;
    });

    if (patientsToAdd.length === 0) return;

    const newItems = patientsToAdd.map(profileId => {
      const profile = allProfiles.find(p => p.id === profileId);
      return {
        cartItemId: `${test.id}-${profileId}-${Date.now()}`,
        testId: test.id,
        testName: test.name,
        collectionType: test.collectionType,
        isHomePickup: test.isHomePickup || false,
        isStorePickup: test.isStorePickup || false,
        b2b: test.b2b,
        mrpPrice: test.mrp,
        profile: {
          id: profile.id,
          name: profile.name,
          relation: profile.relation,
        },
        selectedAddress: null,
        appointmentDate: '',
        appointmentSlot: '',
      };
    });

    setCartItems(prev => [...prev, ...newItems]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartItem = (cartItemId, updates) => {
    setCartItems(prev =>
      prev.map(item => item.cartItemId === cartItemId ? { ...item, ...updates } : item)
    );
  };

  // Bulk update all store-pickup tests for a specific profile when a center is selected
  const updateUserCenter = (profileId, location) => {
    setCartItems(prev => prev.map(item => {
      if (item.isStorePickup && item.profile.id === profileId) {
        return {
          ...item,
          selectedAddress: location,
          b2b: location.price, // dynamic center-specific pricing
          mrpPrice: location.mrp
        };
      }
      return item;
    }));
  };

  // Bulk update all home-pickup tests with a common address/date/slot
  const updateAllHomeItems = (updates) => {
    setCartItems(prev => prev.map(item => {
      if (item.isHomePickup) {
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  // Update multiple items at once to avoid race conditions
  const bulkUpdateItems = (updatesMap) => {
    // updatesMap: { [cartItemId]: { ...updates } }
    setCartItems(prev => prev.map(item => {
      if (updatesMap[item.cartItemId]) {
        return { ...item, ...updatesMap[item.cartItemId] };
      }
      return item;
    }));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, updateUserCenter, updateAllHomeItems, bulkUpdateItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
