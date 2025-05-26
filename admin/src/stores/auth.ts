import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'cashier' | 'waiter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@hotel.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin' as UserRole,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
  {
    id: '2',
    email: 'cashier@hotel.com',
    name: 'Cashier User',
    password: 'cashier123',
    role: 'cashier' as UserRole,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    id: '3',
    email: 'waiter@hotel.com',
    name: 'Waiter User',
    password: 'waiter123',
    role: 'waiter' as UserRole,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'hotel-auth-storage',
    }
  )
);