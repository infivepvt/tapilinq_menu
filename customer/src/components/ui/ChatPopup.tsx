import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ShoppingCart } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { format } from "../../utils/dateUtils";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useSendMessage from "../../hooks/useSendMessage";
import useLoadMessages from "../../hooks/useLoadMessages";
import socket from "../../socket";

const ChatPopup: React.FC = () => {
  const { isOpen, toggleChat, setIsOpen } = useChat();
  const { totalAmount, subTotal } = useCart();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tableId, setTableId] = useState(null);
  const [username, setUsername] = useState(null);

  const { loadMessages } = useLoadMessages();
  const [unreadChats, setUnreadChats] = useState(null);

  useEffect(() => {
    let tbl = localStorage.getItem("table");
    setTableId(tbl);
    let uname = localStorage.getItem("username") || null;
    setUsername(uname);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await loadMessages(username, tableId);
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (tableId && username) load();
  }, [tableId, username, unreadChats]);

  const { sendMessage } = useSendMessage();

  const [messages, setMessages] = useState([
    {
      sender: "cashier",
      message: "Hello how can i help you today ?",
      createdAt: new Date(),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadChats(null);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    socket.emit("updateCustomer", { username, tableId });
  }, [username, tableId, messages]);

  useEffect(() => {
    socket.on("receivemsg", (data) => {
      // console.log(data);
      setUnreadChats(Date.now());
    });

    return () => {
      socket.off("receivemsg");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await sendMessage({
        message: newMessage,
        username,
        tableId,
      });

      localStorage.setItem("username", data.username);
      setUsername(data.username);

      setMessages([
        ...messages,
        {
          sender: "user",
          message: newMessage,
          createdAt: new Date(),
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = () => {
    navigate("/cart");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`fixed bottom-[100px] right-4 z-50 p-4 rounded-full shadow-lg transition-all duration-300 md:bottom-8 md:right-6 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}

        {unreadChats && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full" />
        )}
      </button>

      {/* Place Order Button (Visible only on '/' path) */}
      {location.pathname === "/" && (
        <button
          className={`
            fixed z-40 px-6 py-5 rounded-full bg-green-600 hover:bg-green-700 
            shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
            bottom-6 left-4 right-4 mx-auto
            md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-64
          `}
          onClick={handlePlaceOrder}
          aria-label="Place order"
        >
          <ShoppingCart size={24} className="text-white" />
          <span className="text-base font-semibold text-white">
            Place Order {subTotal > 0 ? `($${subTotal.toFixed(2)})` : ""}
          </span>
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-[180px] right-4 z-40 w-80 md:bottom-24 md:right-6 md:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        {/* Chat Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h3 className="font-semibold">Chat with Cashier</h3>
          <p className="text-xs text-blue-100">
            We typically reply in a few minutes
          </p>
        </div>

        {/* Chat Messages */}
        <div className="p-4 h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Send a message to start chatting</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === "user"
                        ? "text-blue-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {format(new Date(msg.createdAt))}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 dark:border-gray-700 p-3 flex"
        >
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
