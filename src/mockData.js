// Complex Mock Test Data with variants
export const mockTests = [
  { 
    id: "TEST-CBP-STORE", 
    name: "CBP (Complete Blood Picture)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹120", 
    mrp: "₹600",
    isStorePickup: true
  },
  { 
    id: "TEST-CBP-HOME", 
    name: "CBP (Complete Blood Picture)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹170", 
    mrp: "₹650",
    isHomePickup: true
  },
  { 
    id: "TEST-LIP-STORE", 
    name: "Lipid Profile, Serum", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹200", 
    mrp: "₹800",
    isStorePickup: true
  },
  { 
    id: "TEST-LIP-HOME", 
    name: "Lipid Profile, Serum", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹250", 
    mrp: "₹850",
    isHomePickup: true
  },
  { 
    id: "TEST-THY-STORE", 
    name: "Thyroid Profile (T3, T4, TSH)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹300", 
    mrp: "₹750",
    isStorePickup: true
  },
  { 
    id: "TEST-THY-HOME", 
    name: "Thyroid Profile (T3, T4, TSH)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹350", 
    mrp: "₹800",
    isHomePickup: true
  },
  { 
    id: "TEST-HBA-STORE", 
    name: "HbA1c (Glycosylated Haemoglobin)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹150", 
    mrp: "₹450",
    isStorePickup: true
  },
  { 
    id: "TEST-HBA-HOME", 
    name: "HbA1c (Glycosylated Haemoglobin)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹200", 
    mrp: "₹500",
    isHomePickup: true
  },
  { 
    id: "TEST-LFT-STORE", 
    name: "Liver Function Test (LFT), Serum", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹210", 
    mrp: "₹750",
    isStorePickup: true
  },
  { 
    id: "TEST-LFT-HOME", 
    name: "Liver Function Test (LFT), Serum", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹260", 
    mrp: "₹800",
    isHomePickup: true
  }
];

// Complex Mock User Data matching screenshots
export const mockUser = {
  internalId: "USR-998877",
  name: "Sameer",
  phone: "+91 9876543210",
  email: "sameer@corporate.com",
  profiles: [
    {
      id: "P1",
      name: "Sameer",
      relation: "Self",
      age: 34,
      gender: "Male",
      addresses: [
        { id: "A1", tag: "Home", line1: "Apt 4B, Sunshine Towers", line2: "Madhapur, Hyderabad", pincode: "500081", isDefault: true }
      ]
    },
    {
      id: "P2",
      name: "Riya",
      relation: "Dependent",
      age: 32,
      gender: "Female",
      addresses: [
        { id: "A1", tag: "Home", line1: "Apt 4B, Sunshine Towers", line2: "Madhapur, Hyderabad", pincode: "500081", isDefault: true }
      ]
    },
    {
      id: "P3",
      name: "Akash",
      relation: "Dependent",
      age: 8,
      gender: "Male",
      addresses: [
        { id: "A1", tag: "Home", line1: "Apt 4B, Sunshine Towers", line2: "Madhapur, Hyderabad", pincode: "500081", isDefault: true }
      ]
    }
  ]
};

// Mock collection centers / pickup addresses for address selection modal
export const mockPickupLocations = {
  cheapestFirst: [
    { id: "L1", name: "Vijaya Diagnostic Centre", address: "Plot 9, Software Units Layout, Madhapur", city: "Hyderabad", pincode: "500081", distance: "2.4 km", price: "₹120", mrp: "₹600" },
    { id: "L2", name: "Tulip Laboratory", address: "6-3-248, Begumpet", city: "Hyderabad", pincode: "500016", distance: "5.1 km", price: "₹125", mrp: "₹620" },
    { id: "L3", name: "Medlife Labs", address: "Plot 23, Kondapur Main Road", city: "Hyderabad", pincode: "500084", distance: "3.8 km", price: "₹130", mrp: "₹640" },
    { id: "L4", name: "Apollo Diagnostics", address: "Road No 36, Jubilee Hills", city: "Hyderabad", pincode: "500033", distance: "7.2 km", price: "₹145", mrp: "₹680" },
    { id: "L5", name: "Dr Lal PathLabs", address: "Flat 2, Ameerpet X Roads", city: "Hyderabad", pincode: "500016", distance: "6.4 km", price: "₹150", mrp: "₹700" }
  ],
  nearestFirst: [
    { id: "L1", name: "Vijaya Diagnostic Centre", address: "Plot 9, Software Units Layout, Madhapur", city: "Hyderabad", pincode: "500081", distance: "2.4 km", price: "₹120", mrp: "₹600" },
    { id: "L3", name: "Medlife Labs", address: "Plot 23, Kondapur Main Road", city: "Hyderabad", pincode: "500084", distance: "3.8 km", price: "₹130", mrp: "₹640" },
    { id: "L2", name: "Tulip Laboratory", address: "6-3-248, Begumpet", city: "Hyderabad", pincode: "500016", distance: "5.1 km", price: "₹125", mrp: "₹620" },
    { id: "L5", name: "Dr Lal PathLabs", address: "Flat 2, Ameerpet X Roads", city: "Hyderabad", pincode: "500016", distance: "6.4 km", price: "₹150", mrp: "₹700" },
    { id: "L4", name: "Apollo Diagnostics", address: "Road No 36, Jubilee Hills", city: "Hyderabad", pincode: "500033", distance: "7.2 km", price: "₹145", mrp: "₹680" }
  ]
};
