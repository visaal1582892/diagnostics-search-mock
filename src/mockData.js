// Complex Mock Test Data with variants
export const mockTests = [
  { 
    id: "TEST-CBP-STORE", 
    name: "CBP (Complete Blood Picture)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹120", 
    mrp: "₹600",
    isStorePickup: true,
    smartOptions: ["TEST-LIP-STORE", "TEST-THY-STORE"]
  },
  { 
    id: "TEST-CBP-HOME", 
    name: "CBP (Complete Blood Picture)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹170", 
    mrp: "₹650",
    isHomePickup: true,
    smartOptions: ["TEST-LIP-HOME", "TEST-THY-HOME"]
  },
  { 
    id: "TEST-LIP-STORE", 
    name: "Lipid Profile, Serum", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹200", 
    mrp: "₹800",
    isStorePickup: true,
    smartOptions: ["TEST-HBA-STORE", "TEST-LFT-STORE"]
  },
  { 
    id: "TEST-LIP-HOME", 
    name: "Lipid Profile, Serum", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹250", 
    mrp: "₹850",
    isHomePickup: true,
    smartOptions: ["TEST-HBA-HOME", "TEST-LFT-HOME"]
  },
  { 
    id: "TEST-THY-STORE", 
    name: "Thyroid Profile (T3, T4, TSH)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹300", 
    mrp: "₹750",
    isStorePickup: true,
    smartOptions: ["TEST-CBP-STORE", "TEST-LIP-STORE"]
  },
  { 
    id: "TEST-THY-HOME", 
    name: "Thyroid Profile (T3, T4, TSH)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹350", 
    mrp: "₹800",
    isHomePickup: true,
    smartOptions: ["TEST-CBP-HOME", "TEST-LIP-HOME"]
  },
  { 
    id: "TEST-HBA-STORE", 
    name: "HbA1c (Glycosylated Haemoglobin)", 
    tag: "Pathology",
    collectionType: "Center Visit Only",
    b2b: "₹150", 
    mrp: "₹450",
    isStorePickup: true,
    smartOptions: ["TEST-CBP-STORE"]
  },
  { 
    id: "TEST-HBA-HOME", 
    name: "HbA1c (Glycosylated Haemoglobin)", 
    tag: "Pathology",
    collectionType: "Home Sample Pickup",
    b2b: "₹200", 
    mrp: "₹500",
    isHomePickup: true,
    smartOptions: ["TEST-CBP-HOME"]
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
    isHomePickup: true,
    smartOptions: ["TEST-HBA-STORE", "TEST-CBP-STORE"]
  },
  { 
    id: "TEST-MRI-BRAIN", 
    name: "MRI Brain (Plain)", 
    tag: "Imaging",
    collectionType: "Center Visit Only",
    b2b: "₹3500", 
    mrp: "₹5000",
    isHomePickup: false,
    isStorePickup: true,
    smartOptions: ["TEST-CBP-STORE", "TEST-THY-STORE"]
  },
  { 
    id: "TEST-CT-CHEST", 
    name: "CT Chest (Plain)", 
    tag: "Imaging",
    collectionType: "Center Visit Only",
    b2b: "₹2800", 
    mrp: "₹4500",
    isHomePickup: false,
    isStorePickup: true,
    smartOptions: ["TEST-CBP-STORE", "TEST-LFT-STORE"]
  },
  { 
    id: "TEST-XRAY-CHEST", 
    name: "X-Ray Chest PA View", 
    tag: "Radiology",
    collectionType: "Center Visit Only",
    b2b: "₹400", 
    mrp: "₹650",
    isHomePickup: false,
    isStorePickup: true,
    smartOptions: ["TEST-CBP-STORE"]
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
    { 
      id: "L1", 
      name: "Vijaya Diagnostic Centre", 
      company: "Vijaya Group", 
      isMedplusCollaborated: true, 
      address: "Plot 9, Software Units Layout, Madhapur", 
      city: "Hyderabad", pincode: "500081", 
      distance: "2.4 km", 
      price: "₹120", 
      mrp: "₹600", 
      rating: 4.5, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST", "TEST-XRAY-CHEST"]
    },
    { 
      id: "L2", 
      name: "Tulip Laboratory", 
      company: "Tulip Health", 
      isMedplusCollaborated: false, 
      address: "6-3-248, Begumpet", 
      city: "Hyderabad", pincode: "500016", 
      distance: "5.1 km", 
      price: "₹125", 
      mrp: "₹620", 
      rating: 4.2, 
      isNablCertified: false,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE"] // No imaging/radiology
    },
    { 
      id: "L3", 
      name: "Medlife Labs", 
      company: "Medlife", 
      isMedplusCollaborated: true, 
      address: "Plot 23, Kondapur Main Road", 
      city: "Hyderabad", pincode: "500084", 
      distance: "3.8 km", 
      price: "₹130", 
      mrp: "₹640", 
      rating: 4.0, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST"] // No X-Ray
    },
    { 
      id: "L4", 
      name: "Apollo Diagnostics", 
      company: "Apollo", 
      isMedplusCollaborated: true, 
      address: "Road No 36, Jubilee Hills", 
      city: "Hyderabad", pincode: "500033", 
      distance: "7.2 km", 
      price: "₹145", 
      mrp: "₹680", 
      rating: 4.7, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST", "TEST-XRAY-CHEST"]
    },
    { 
      id: "L5", 
      name: "Dr Lal PathLabs", 
      company: "Dr Lal PathLabs", 
      isMedplusCollaborated: false, 
      address: "Flat 2, Ameerpet X Roads", 
      city: "Hyderabad", pincode: "500016", 
      distance: "6.4 km", 
      price: "₹150", 
      mrp: "₹700", 
      rating: 4.3, 
      isNablCertified: false,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-XRAY-CHEST"] // No MRI/CT
    }
  ],
  nearestFirst: [
    { 
      id: "L1", 
      name: "Vijaya Diagnostic Centre", 
      company: "Vijaya Group", 
      isMedplusCollaborated: true, 
      address: "Plot 9, Software Units Layout, Madhapur", 
      city: "Hyderabad", pincode: "500081", 
      distance: "2.4 km", 
      price: "₹120", 
      mrp: "₹600", 
      rating: 4.5, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST", "TEST-XRAY-CHEST"]
    },
    { 
      id: "L3", 
      name: "Medlife Labs", 
      company: "Medlife", 
      isMedplusCollaborated: true, 
      address: "Plot 23, Kondapur Main Road", 
      city: "Hyderabad", pincode: "500084", 
      distance: "3.8 km", 
      price: "₹130", 
      mrp: "₹640", 
      rating: 4.0, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST"]
    },
    { 
      id: "L2", 
      name: "Tulip Laboratory", 
      company: "Tulip Health", 
      isMedplusCollaborated: false, 
      address: "6-3-248, Begumpet", 
      city: "Hyderabad", pincode: "500016", 
      distance: "5.1 km", 
      price: "₹125", 
      mrp: "₹620", 
      rating: 4.2, 
      isNablCertified: false,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE"]
    },
    { 
      id: "L5", 
      name: "Dr Lal PathLabs", 
      company: "Dr Lal PathLabs", 
      isMedplusCollaborated: false, 
      address: "Flat 2, Ameerpet X Roads", 
      city: "Hyderabad", pincode: "500016", 
      distance: "6.4 km", 
      price: "₹150", 
      mrp: "₹700", 
      rating: 4.3, 
      isNablCertified: false,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-XRAY-CHEST"]
    },
    { 
      id: "L4", 
      name: "Apollo Diagnostics", 
      company: "Apollo", 
      isMedplusCollaborated: true, 
      address: "Road No 36, Jubilee Hills", 
      city: "Hyderabad", pincode: "500033", 
      distance: "7.2 km", 
      price: "₹145", 
      mrp: "₹680", 
      rating: 4.7, 
      isNablCertified: true,
      supportedTests: ["TEST-CBP-STORE", "TEST-LIP-STORE", "TEST-THY-STORE", "TEST-HBA-STORE", "TEST-LFT-STORE", "TEST-MRI-BRAIN", "TEST-CT-CHEST", "TEST-XRAY-CHEST"]
    }
  ]
};
