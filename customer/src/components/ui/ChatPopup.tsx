import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ShoppingCart } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { format } from '../../utils/dateUtils';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatPopup: React.FC = () => {
  const { messages, addMessage, isOpen, toggleChat } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage(newMessage);
      setNewMessage('');
    }
  };

  const handlePlaceOrder = () => {
    navigate('/cart');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Place Order Button (Visible only on '/' path) */}
      {location.pathname === '/' && (
        <button
          className="fixed bottom-6 right-20 z-40 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 flex items-center space-x-2"
          onClick={handlePlaceOrder}
          aria-label="Place order"
        >
          <ShoppingCart size={28} className="text-white" />
          <span className="text-lg font-bold text-white">Place Order</span>
        </button>
      )}

      {/* Chat Window */}
      <div 
        className={`fixed bottom-20 right-6 z-40 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
          isOpen 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h3 className="font-semibold">Chat with Waiter</h3>
          <p className="text-xs text-blue-100">We typically reply in a few minutes</p>
        </div>

        {/* Chat Messages */}
        <div className="p-4 h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Send a message to start chatting</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(new Date(msg.timestamp))}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatPopup;
