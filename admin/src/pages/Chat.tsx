import { useState, useEffect, useRef } from "react";
import { Send, Smile, Users } from "lucide-react";
import { messages as initialMessages, Message, users } from "../data/mockData"; // Assuming users array in mockData
import { useAuth } from "../stores/auth";
import { getInitials } from "../lib/utils";
import Button from "../components/ui/Button";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !selectedContact) return;

    const message: Message = {
      id: `m${messages.length + 1}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleSelectContact = (contact: User) => {
    setSelectedContact(contact);
    // Filter messages for the selected contact
    const filteredMessages = initialMessages.filter(
      (msg) =>
        (msg.senderId === user?.id && msg.recipientId === contact.id) ||
        (msg.senderId === contact.id && msg.recipientId === user?.id)
    );
    setMessages(filteredMessages);
  };

  // Group messages by date
  const groupedMessages: Record<string, Message[]> = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

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
          {users
            .filter((contact) => contact.id !== user?.id)
            .map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-accent ${
                  selectedContact?.id === contact.id ? "bg-accent" : ""
                }`}
                onClick={() => handleSelectContact(contact)}
              >
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium mr-3">
                    {getInitials(contact.name)}
                  </div>
                )}
                <span className="text-sm font-medium">{contact.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        <div className="flex-none p-4 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {selectedContact
              ? `Chat with ${selectedContact.name}`
              : "Team Chat"}
          </h1>
          <p className="text-muted-foreground">
            {selectedContact
              ? "Communicate with your team member"
              : "Select a contact to start chatting"}
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto rounded-t-lg border border-border bg-background p-4">
            {selectedContact ? (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-4 text-xs text-muted-foreground bg-background px-2">
                      {date === new Date().toLocaleDateString()
                        ? "Today"
                        : date}
                    </span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start mb-4 ${
                        message.senderId === user?.id ? "justify-end" : ""
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <div className="flex-shrink-0 mr-3">
                          {message.senderAvatar ? (
                            <img
                              src={message.senderAvatar}
                              alt={message.senderName}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
                              {getInitials(message.senderName)}
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] ${
                          message.senderId === user?.id ? "order-1" : "order-2"
                        }`}
                      >
                        <div className="flex items-end mb-1">
                          {message.senderId !== user?.id && (
                            <span className="text-xs font-medium mr-2">
                              {message.senderName}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.senderId === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
};

export default Chat;
