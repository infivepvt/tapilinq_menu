import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Utensils,
  Users,
  MessageSquare,
  X,
  HotelIcon,
  Table,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../stores/auth";
import socket from "../socket";
import { useAuthContext } from "../context/AuthContext";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user, unreadChats, setUnreadChats } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Products", href: "/products", icon: Package },
    { name: "Categories", href: "/categories", icon: Utensils },
    { name: "Tables", href: "/tables", icon: Table },
    { name: "Users", href: "/users", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    socket.on("newMessage", (data) => {
      let newUnreadChats = unreadChats.filter((c) => c !== data.chatId);
      setUnreadChats([...newUnreadChats, data.chatId]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        mobile
          ? "fixed inset-y-0 left-0 w-full max-w-xs z-50"
          : isOpen
          ? "w-64"
          : "w-16",
        !mobile && !isOpen && "items-center"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          {mobile && (
            <button onClick={onClose} className="mr-2 text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
          {!mobile && (
            <button onClick={onToggle} className="mr-2 text-muted-foreground">
              {isOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          )}
          {isOpen && (
            <>
              <HotelIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Hotel Admin</span>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                  !isOpen && !mobile && "justify-center"
                )}
                onClick={mobile ? onClose : undefined}
                title={!isOpen && !mobile ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive(item.href)
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                    !isOpen && !mobile && "mr-0"
                  )}
                  aria-hidden="true"
                />
                {isOpen && (
                  <span className={cn(!mobile && "ml-3")}>{item.name}</span>
                )}
                {isOpen && unreadChats.length > 0 && item.name === "Chat" && (
                  <div className="w-2 h-2 rounded-full bg-red-600 mx-5"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
