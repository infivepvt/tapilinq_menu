import { Product, Category, Order, ChatMessage } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'All', icon: 'grid' },
  { id: 2, name: 'Breakfast', icon: 'coffee' },
  { id: 3, name: 'Lunch', icon: 'utensils' },
  { id: 4, name: 'Dinner', icon: 'soup' },
  { id: 5, name: 'Desserts', icon: 'cake' },
  { id: 6, name: 'Drinks', icon: 'wine' },
  { id: 7, name: 'Specials', icon: 'star' }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Breakfast',
    description: 'Eggs, bacon, toast, and hash browns. A perfect start to your day.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Breakfast',
    ingredients: ['Eggs', 'Bacon', 'Toast', 'Hash Browns']
  },
  {
    id: 2,
    name: 'Avocado Toast',
    description: 'Fresh avocado on artisan bread with cherry tomatoes and microgreens.',
    price: 10.99,
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Breakfast',
    ingredients: ['Avocado', 'Artisan Bread', 'Cherry Tomatoes', 'Microgreens', 'Olive Oil']
  },
  {
    id: 3,
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet grilled to perfection with seasonal vegetables and lemon herb sauce.',
    price: 22.99,
    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Dinner',
    ingredients: ['Salmon Fillet', 'Seasonal Vegetables', 'Lemon Herb Sauce', 'Garlic']
  },
  {
    id: 4,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 8.99,
    image: 'https://images.pexels.com/photos/6133458/pexels-photo-6133458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Desserts',
    ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa Powder']
  },
  {
    id: 5,
    name: 'Signature Burger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and our special sauce on a brioche bun.',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Lunch',
    ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Special Sauce', 'Brioche Bun']
  },
  {
    id: 6,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons, and our house Caesar dressing.',
    price: 11.99,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Lunch',
    ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing']
  },
  {
    id: 7,
    name: 'Mojito',
    description: 'Refreshing cocktail with rum, mint, lime, sugar, and soda water.',
    price: 9.99,
    image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Drinks',
    ingredients: ['Rum', 'Mint', 'Lime', 'Sugar', 'Soda Water']
  },
  {
    id: 8,
    name: 'Chef\'s Special Pasta',
    description: 'Handmade pasta with seasonal ingredients and the chef\'s special sauce.',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Specials',
    ingredients: ['Handmade Pasta', 'Seasonal Ingredients', 'Chef\'s Special Sauce', 'Parmesan']
  }
];

export const pastOrders: Order[] = [
  {
    id: 1001,
    items: [
      {
        product: products[0],
        quantity: 2,
        addedIngredients: ['Extra Bacon'],
        removedIngredients: [],
        specialNote: 'Toast well done, please'
      },
      {
        product: products[6],
        quantity: 2,
        addedIngredients: ['Extra Mint'],
        removedIngredients: [],
        specialNote: ''
      }
    ],
    tableNumber: 5,
    status: 'completed',
    totalAmount: 45.96,
    orderTime: '2025-07-10T09:30:00'
  },
  {
    id: 1002,
    items: [
      {
        product: products[4],
        quantity: 1,
        addedIngredients: ['Extra Cheese'],
        removedIngredients: ['Tomato'],
        specialNote: 'Medium rare please'
      }
    ],
    tableNumber: 8,
    status: 'preparing',
    totalAmount: 15.99,
    orderTime: '2025-07-10T12:45:00'
  },
  {
    id: 1003,
    items: [
      {
        product: products[2],
        quantity: 1,
        addedIngredients: [],
        removedIngredients: [],
        specialNote: ''
      },
      {
        product: products[3],
        quantity: 1,
        addedIngredients: [],
        removedIngredients: [],
        specialNote: ''
      }
    ],
    tableNumber: 3,
    status: 'pending',
    totalAmount: 31.98,
    orderTime: '2025-07-10T19:15:00'
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'user',
    message: 'Could I get some extra napkins please?',
    timestamp: '2025-07-10T10:05:00'
  },
  {
    id: 2,
    sender: 'staff',
    message: 'Of course! I\'ll bring them right over to your table.',
    timestamp: '2025-07-10T10:06:00'
  },
  {
    id: 3,
    sender: 'user',
    message: 'Thank you!',
    timestamp: '2025-07-10T10:06:30'
  }
];