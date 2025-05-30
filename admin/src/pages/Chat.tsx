import { useState, useEffect, useRef } from "react";
import { Send, Smile, Users } from "lucide-react";
import { Message } from "../data/mockData";
import { useAuth } from "../stores/auth";
import { getInitials } from "../lib/utils";
import Button from "../components/ui/Button";
import useLoadChats from "../hooks/useLoadChats";
import useGetMessages from "../hooks/useGetMessages";
import { useAuthContext } from "../context/AuthContext";
import useSendMsg from "../hooks/useSendMsg";
import socket from "../socket";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState([]);

  const { user, unreadChats, setUnreadChats } = useAuthContext();

  const { loadChats } = useLoadChats();
  const { getMessages } = useGetMessages();

  // useEffect(() => {
  //   socket.on("newMessage", (data) => {
  //     let newUnreadChats = unreadChats.filter((c) => c !== data.chatId);
  //     setUnreadChats([...newUnreadChats, data.chatId]);
  //   });

  //   return () => {
  //     socket.off("newMessage");
  //   };
  // }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await loadChats();
        setUsers(data.chats);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [unreadChats]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMessages(
          selectedContact?.username,
          selectedContact?.tableId
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedContact) load();
  }, [selectedContact, users]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { sendMsg } = useSendMsg();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendMsg({
        username: selectedContact?.username,
        tableId: selectedContact?.tableId,
        message: newMessage,
      });
      setMessages([
        ...messages,
        { sender: "cashier", message: newMessage, createdAt: new Date() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectContact = (contact: User) => {
    setSelectedContact(contact);
    if (unreadChats.includes(contact.id)) {
      let newUnreadChats = unreadChats.filter((id) => id !== contact.id);
      setUnreadChats(newUnreadChats);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Contacts panel */}
      <div className="w-64 flex-none border-r border-border bg-background">
        <div className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> Contacts
          </h2>
        </div>
        <div className="overflow-y-auto">
          {users.map((contact, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 cursor-pointer hover:bg-accent ${
                selectedContact?.id === contact.id ? "bg-accent" : ""
              }`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="flex items-center">
                <img
                  src={`https://avatar.iran.liara.run/username?username=${
                    contact.username.split("est")[0]
                  }+${contact.username.split("est")[1]}`}
                  alt={contact.username}
                  className="h-8 w-8 rounded-full object-cover mr-3"
                />
                <div className="">
                  <p className="text-sm font-medium">{contact.username}</p>
                  <p className="text-sm font-medium">
                    <span className="text-green-600">Table : </span>
                    {contact.table?.name}
                  </p>
                </div>
              </div>
              {unreadChats.includes(contact.id) && (
                <div>
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        <div className="flex-none p-4 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {selectedContact
              ? `Chat with ${selectedContact.username}`
              : "Chat"}
          </h1>
          <div className="text-muted-foreground">
            {selectedContact ? (
              <div>
                <span>Table : </span>
                <span>{selectedContact?.table?.name}</span>
              </div>
            ) : (
              "Select a contact to start chatting"
            )}
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto rounded-t-lg border border-border bg-background p-4">
          {selectedContact ? (
            messages.map((message, index) => (
              <div key={index} className="mb-6">
                <div
                  className={`flex items-start mb-4 ${
                    message.sender === "cashier" ? "justify-end" : ""
                  }`}
                >
                  {message.sender !== "cashier" && (
                    <div className="flex-shrink-0 mr-3">
                      <img
                        src={`https://avatar.iran.liara.run/username?username=${
                          selectedContact.username.split("est")[0]
                        }+${selectedContact.username.split("est")[1]}`}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] ${
                      message.sender === "cashier" ? "order-1" : "order-2"
                    }`}
                  >
                    <div className="flex items-end mb-1">
                      {message.senderId !== user?.id && (
                        <span className="text-xs font-medium mr-2">
                          {message.sender === "cashier"
                            ? "Admin / Cashier"
                            : selectedContact.username}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a contact to view messages
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        {selectedContact && (
          <div className="flex-none border-t-0 border rounded-b-lg border-border bg-card">
            <form onSubmit={handleSendMessage} className="flex p-2">
              <button
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-foreground"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                size="sm"
                className="w-10 h-10"
                leftIcon={<Send className="h-4 w-4" />}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
