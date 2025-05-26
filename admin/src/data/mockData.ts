import { format, subDays, addHours } from 'date-fns';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  features: string[];
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  waiterId: string | null;
  waiterName: string | null;
  waiterAvatar: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  features: ProductFeature[];
}

export interface ProductFeature {
  id: string;
  name: string;
  price: number;
  required: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  variants: ProductVariant[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'waiter';
  avatar: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
}

// Categories
export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Main Courses',
    description: 'Main dishes including steaks, fish, and chef specials',
    imageUrl: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'cat2',
    name: 'Appetizers',
    description: 'Starters and small plates to begin your meal',
    imageUrl: 'https://images.pexels.com/photos/6419713/pexels-photo-6419713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'cat3',
    name: 'Desserts',
    description: 'Sweet treats to finish your dining experience',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'cat4',
    name: 'Beverages',
    description: 'Refreshing drinks and cocktails',
    imageUrl: 'https://images.pexels.com/photos/2531188/pexels-photo-2531188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'cat5',
    name: 'Pizza',
    description: 'Freshly baked pizzas with various toppings',
    imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

// Products
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: 'cat5',
    variants: [
      {
        id: 'v1',
        name: 'Small (10")',
        price: 12.99,
        features: [
          { id: 'f1', name: 'Extra Cheese', price: 1.5, required: false },
          { id: 'f2', name: 'Garlic Crust', price: 0.99, required: false },
        ],
      },
      {
        id: 'v2',
        name: 'Medium (12")',
        price: 15.99,
        features: [
          { id: 'f3', name: 'Extra Cheese', price: 2.0, required: false },
          { id: 'f4', name: 'Garlic Crust', price: 1.49, required: false },
        ],
      },
      {
        id: 'v3',
        name: 'Large (14")',
        price: 18.99,
        features: [
          { id: 'f5', name: 'Extra Cheese', price: 2.5, required: false },
          { id: 'f6', name: 'Garlic Crust', price: 1.99, required: false },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet grilled to perfection with seasonal vegetables',
    imageUrl: 'https://images.pexels.com/photos/5907399/pexels-photo-5907399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: 'cat1',
    variants: [
      {
        id: 'v4',
        name: 'Regular',
        price: 24.99,
        features: [
          { id: 'f7', name: 'Lemon Butter Sauce', price: 1.99, required: false },
          { id: 'f8', name: 'Side Salad', price: 3.99, required: false },
        ],
      },
      {
        id: 'v5',
        name: 'Large Portion',
        price: 29.99,
        features: [
          { id: 'f9', name: 'Lemon Butter Sauce', price: 1.99, required: false },
          { id: 'f10', name: 'Side Salad', price: 3.99, required: false },
        ],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: 'cat3',
    variants: [
      {
        id: 'v6',
        name: 'Single',
        price: 8.99,
        features: [
          { id: 'f11', name: 'Extra Ice Cream', price: 1.5, required: false },
          { id: 'f12', name: 'Raspberry Sauce', price: 0.99, required: false },
        ],
      },
      {
        id: 'v7',
        name: 'To Share (2 pcs)',
        price: 15.99,
        features: [
          { id: 'f13', name: 'Extra Ice Cream', price: 2.5, required: false },
          { id: 'f14', name: 'Raspberry Sauce', price: 0.99, required: false },
        ],
      },
    ],
  },
];

// Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hotel.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    createdAt: format(subDays(new Date(), 120), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@hotel.com',
    role: 'cashier',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    createdAt: format(subDays(new Date(), 90), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@hotel.com',
    role: 'waiter',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.w@hotel.com',
    role: 'waiter',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    createdAt: format(subDays(new Date(), 45), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
];

// Orders
const today = new Date();

export const generateOrders = (): Order[] => {
  return [
    {
      id: 'order1',
      tableNumber: 5,
      customerName: 'John Doe',
      items: [
        {
          id: 'item1',
          productId: 'p1',
          productName: 'Margherita Pizza',
          variantName: 'Medium (12")',
          price: 15.99,
          quantity: 1,
          features: ['Extra Cheese'],
        },
        {
          id: 'item2',
          productId: 'p3',
          productName: 'Chocolate Lava Cake',
          variantName: 'Single',
          price: 8.99,
          quantity: 2,
          features: [],
        },
      ],
      status: 'completed',
      waiterId: '3',
      waiterName: 'Michael Johnson',
      waiterAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      totalAmount: 33.97,
      createdAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
    {
      id: 'order2',
      tableNumber: 3,
      customerName: 'Jane Smith',
      items: [
        {
          id: 'item3',
          productId: 'p2',
          productName: 'Grilled Salmon',
          variantName: 'Regular',
          price: 24.99,
          quantity: 2,
          features: ['Side Salad'],
        },
      ],
      status: 'pending',
      waiterId: null,
      waiterName: null,
      waiterAvatar: null,
      totalAmount: 49.98,
      createdAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
    {
      id: 'order3',
      tableNumber: 7,
      customerName: 'Robert Brown',
      items: [
        {
          id: 'item4',
          productId: 'p1',
          productName: 'Margherita Pizza',
          variantName: 'Large (14")',
          price: 18.99,
          quantity: 1,
          features: ['Extra Cheese', 'Garlic Crust'],
        },
      ],
      status: 'preparing',
      waiterId: '4',
      waiterName: 'Sarah Wilson',
      waiterAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      totalAmount: 18.99,
      createdAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
    {
      id: 'order4',
      tableNumber: 2,
      customerName: 'Emily Davis',
      items: [
        {
          id: 'item5',
          productId: 'p3',
          productName: 'Chocolate Lava Cake',
          variantName: 'To Share (2 pcs)',
          price: 15.99,
          quantity: 1,
          features: ['Extra Ice Cream'],
        },
      ],
      status: 'delivered',
      waiterId: '3',
      waiterName: 'Michael Johnson',
      waiterAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      totalAmount: 15.99,
      createdAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(subDays(today, 0), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
    {
      id: 'order5',
      tableNumber: 10,
      customerName: 'Michael Wilson',
      items: [
        {
          id: 'item6',
          productId: 'p2',
          productName: 'Grilled Salmon',
          variantName: 'Large Portion',
          price: 29.99,
          quantity: 1,
          features: [],
        },
        {
          id: 'item7',
          productId: 'p1',
          productName: 'Margherita Pizza',
          variantName: 'Small (10")',
          price: 12.99,
          quantity: 1,
          features: [],
        },
      ],
      status: 'cancelled',
      waiterId: '4',
      waiterName: 'Sarah Wilson',
      waiterAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      totalAmount: 42.98,
      createdAt: format(subDays(today, 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(subDays(today, 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
  ];
};

export const messages: Message[] = [
  {
    id: 'm1',
    senderId: '1',
    senderName: 'Admin User',
    senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    content: "Good morning team! Let's have a great day today.",
    timestamp: format(addHours(subDays(today, 1), 8), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'm2',
    senderId: '3',
    senderName: 'Michael Johnson',
    senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    content: "Good morning! Table 5 needs assistance with their order.",
    timestamp: format(addHours(subDays(today, 1), 9), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'm3',
    senderId: '2',
    senderName: 'Jane Smith',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    content: "We're running low on the house wine. Should I place an order?",
    timestamp: format(addHours(subDays(today, 1), 14), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'm4',
    senderId: '1',
    senderName: 'Admin User',
    senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    content: "Yes, please place the order. We have a full house tonight.",
    timestamp: format(addHours(subDays(today, 1), 14, 30), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'm5',
    senderId: '4',
    senderName: 'Sarah Wilson',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    content: "The kitchen is backed up with orders. Estimated 15-minute delay for new orders.",
    timestamp: format(addHours(today, 12), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
];

export const getDashboardStats = () => {
  const orders = generateOrders();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === today.toDateString();
  });
  
  const totalEarnings = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = todayOrders.filter(order => order.status === 'pending').length;
  const completedOrders = todayOrders.filter(order => order.status === 'completed').length;
  
  return {
    todayOrders: todayOrders.length,
    totalEarnings,
    pendingOrders,
    completedOrders,
  };
};