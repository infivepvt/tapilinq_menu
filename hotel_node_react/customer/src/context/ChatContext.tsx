import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '../types';
import { chatMessages as initialMessages } from '../data/mockData';

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: string) => void;
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const addMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate staff response
    setTimeout(() => {
      const staffResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'staff',
        message: 'Thank you for your message. A staff member will assist you shortly.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, staffResponse]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      addMessage, 
      isOpen,
      toggleChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};