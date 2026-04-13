// ─── Mock data returned in Demo Mode (Bypass Login) ───────────────────────────

export const DEMO_TOKEN = 'DEMO_MODE';

export const mockAnalytics = {
  totalShops: 24,
  pendingShops: 5,
  totalUsers: 312,
  totalOrders: 1847,
};

export const mockShops = [
  {
    id: 'shop-1',
    name: 'The Spice Route',
    location: 'Block A, Ground Floor',
    lat: 28.6139,
    lng: 77.2090,
    isVerified: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'shop-2',
    name: 'Burger Barn',
    location: 'Food Court, Level 2',
    lat: 28.6145,
    lng: 77.2095,
    isVerified: true,
    isActive: false,
    createdAt: '2024-02-20T09:30:00Z',
  },
  {
    id: 'shop-3',
    name: 'Green Bowl',
    location: 'Block C, First Floor',
    lat: 28.6150,
    lng: 77.2080,
    isVerified: false,
    isActive: true,
    createdAt: '2024-03-05T11:15:00Z',
  },
  {
    id: 'shop-4',
    name: 'Chai & Snacks',
    location: 'Near Main Gate',
    lat: 28.6132,
    lng: 77.2088,
    isVerified: true,
    isActive: true,
    createdAt: '2024-01-28T08:00:00Z',
  },
  {
    id: 'shop-5',
    name: 'Rolls & Wraps',
    location: 'Block B, Ground Floor',
    lat: 28.6142,
    lng: 77.2100,
    isVerified: false,
    isActive: false,
    createdAt: '2024-04-01T14:00:00Z',
  },
];

export const mockPendingShops = [
  {
    id: 'pending-1',
    name: 'Pizza Palace',
    ownerName: 'Rahul Mehta',
    location: 'Block D, Level 1',
    lat: 28.6155,
    lng: 77.2075,
    createdAt: '2024-04-10T09:00:00Z',
  },
  {
    id: 'pending-2',
    name: 'South Indian Corner',
    ownerName: 'Priya Nair',
    location: 'Food Court, Level 1',
    lat: 28.6148,
    lng: 77.2092,
    createdAt: '2024-04-09T12:30:00Z',
  },
  {
    id: 'pending-3',
    name: 'Noodle House',
    ownerName: 'Wei Zhang',
    location: 'Block A, Level 3',
    lat: 28.6140,
    lng: 77.2085,
    createdAt: '2024-04-08T16:00:00Z',
  },
  {
    id: 'pending-4',
    name: 'Fresh Juice Bar',
    ownerName: 'Aisha Khan',
    location: 'Near Parking Lot',
    lat: 28.6128,
    lng: 77.2098,
    createdAt: '2024-04-07T10:45:00Z',
  },
  {
    id: 'pending-5',
    name: 'Biryani Express',
    ownerName: 'Mohammed Ali',
    location: 'Block E, Ground Floor',
    lat: 28.6160,
    lng: 77.2070,
    createdAt: '2024-04-06T08:00:00Z',
  },
];

export const mockUsers = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@kanteen.com',
    role: 'admin',
    createdAt: '2023-11-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Rahul Mehta',
    email: 'rahul@pizzapalace.com',
    role: 'shopOwner',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    role: 'shopOwner',
    createdAt: '2024-01-22T00:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Arjun Singh',
    email: 'arjun.singh@student.edu',
    role: 'user',
    createdAt: '2024-02-05T00:00:00Z',
  },
  {
    id: 'user-5',
    name: 'Sneha Patel',
    email: 'sneha.p@student.edu',
    role: 'user',
    createdAt: '2024-02-14T00:00:00Z',
  },
  {
    id: 'user-6',
    name: 'Vikram Rao',
    email: 'vikram.rao@company.com',
    role: 'user',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'user-7',
    name: 'Aisha Khan',
    email: 'aisha.khan@gmail.com',
    role: 'shopOwner',
    createdAt: '2024-03-18T00:00:00Z',
  },
  {
    id: 'user-8',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@student.edu',
    role: 'user',
    createdAt: '2024-04-02T00:00:00Z',
  },
];

export const mockOrders = [
  {
    id: 'order-a1b2c3d4',
    shop: { id: 'shop-1', name: 'The Spice Route' },
    items: [
      { name: 'Paneer Tikka', quantity: 2 },
      { name: 'Butter Naan', quantity: 3 },
    ],
    total: 450,
    status: 'completed',
    createdAt: '2024-04-12T09:15:00Z',
  },
  {
    id: 'order-e5f6g7h8',
    shop: { id: 'shop-2', name: 'Burger Barn' },
    items: [
      { name: 'Cheese Burger', quantity: 1 },
      { name: 'Fries', quantity: 1 },
      { name: 'Coke', quantity: 1 },
    ],
    total: 320,
    status: 'pending',
    createdAt: '2024-04-12T10:30:00Z',
  },
  {
    id: 'order-i9j0k1l2',
    shop: { id: 'shop-1', name: 'The Spice Route' },
    items: [{ name: 'Dal Makhani', quantity: 1 }, { name: 'Rice', quantity: 1 }],
    total: 180,
    status: 'preparing',
    createdAt: '2024-04-12T11:00:00Z',
  },
  {
    id: 'order-m3n4o5p6',
    shop: { id: 'shop-4', name: 'Chai & Snacks' },
    items: [{ name: 'Masala Chai', quantity: 2 }, { name: 'Samosa', quantity: 4 }],
    total: 120,
    status: 'ready',
    createdAt: '2024-04-12T11:45:00Z',
  },
  {
    id: 'order-q7r8s9t0',
    shop: { id: 'shop-3', name: 'Green Bowl' },
    items: [{ name: 'Caesar Salad', quantity: 1 }, { name: 'Smoothie', quantity: 1 }],
    total: 290,
    status: 'cancelled',
    createdAt: '2024-04-12T08:00:00Z',
  },
  {
    id: 'order-u1v2w3x4',
    shop: { id: 'shop-2', name: 'Burger Barn' },
    items: [{ name: 'Veggie Burger', quantity: 2 }],
    total: 260,
    status: 'completed',
    createdAt: '2024-04-11T13:20:00Z',
  },
  {
    id: 'order-y5z6a7b8',
    shop: { id: 'shop-4', name: 'Chai & Snacks' },
    items: [{ name: 'Cold Coffee', quantity: 1 }, { name: 'Biscuit', quantity: 2 }],
    total: 95,
    status: 'completed',
    createdAt: '2024-04-11T15:00:00Z',
  },
];

// Simulates a network delay for realism
export const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// Returns a fake axios-like response object
export const mockResponse = (data) => ({ data });
