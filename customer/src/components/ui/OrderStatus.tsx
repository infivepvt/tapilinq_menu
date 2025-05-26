import React from "react";
import {
  Clock,
  CheckCircle,
  RotateCw,
  Utensils,
  XCircle,
  ChefHat,
} from "lucide-react";

interface OrderStatusProps {
  status:
    | "pending"
    | "preparing"
    | "prepairing"
    | "prepared"
    | "served"
    | "completed"
    | "cancelled";
  design?: "default" | "gradient" | "minimal";
  customText?: string; // New prop for custom status text
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  design = "default",
  customText,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-orange-200 dark:border-orange-800 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-orange-500 dark:border-orange-400 rounded-full animate-spin"></div>
              <Clock className="relative text-orange-500 dark:text-orange-400 w-6 h-6" />
            </div>
          ),
          text: customText || "Pending", // Use customText if provided
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50"
              : design === "minimal"
              ? "bg-transparent border border-orange-300 dark:border-orange-600"
              : "bg-orange-100 dark:bg-orange-900/50",
          textColor: "text-orange-800 dark:text-orange-300",
          containerClass: "px-4 py-2",
          animation: design === "minimal" ? "animate-pulse" : "",
        };
      case "preparing":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800/30 rounded-full animate-ping"></div>
              <RotateCw className="relative text-blue-500 dark:text-blue-400 w-6 h-6 animate-spin-slow" />
            </div>
          ),
          text: customText || "Preparing",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50"
              : design === "minimal"
              ? "bg-transparent border border-blue-300 dark:border-blue-600"
              : "bg-blue-100 dark:bg-blue-900/50",
          textColor: "text-blue-800 dark:text-blue-300",
          containerClass: "px-4 py-2",
          animation: design === "gradient" ? "animate-pulse-slow" : "",
        };
      case "prepairing":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <ChefHat className="relative text-indigo-500 dark:text-indigo-400 w-6 h-6 animate-bounce" />
            </div>
          ),
          text: customText || "Prepairing",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50"
              : design === "minimal"
              ? "bg-transparent border border-indigo-300 dark:border-indigo-600"
              : "bg-indigo-100 dark:bg-indigo-900/50",
          textColor: "text-indigo-800 dark:text-indigo-300",
          containerClass: "px-4 py-2",
          animation: design === "minimal" ? "animate-pulse" : "",
        };
      case "prepared":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              {design === "gradient" && (
                <div className="absolute inset-0 bg-purple-200 dark:bg-purple-800/30 rounded-full animate-pulse"></div>
              )}
              <Utensils className="relative text-purple-500 dark:text-purple-400 w-6 h-6" />
            </div>
          ),
          text: customText || "Prepared",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50"
              : design === "minimal"
              ? "bg-transparent border border-purple-300 dark:border-purple-600"
              : "bg-purple-100 dark:bg-purple-900/50",
          textColor: "text-purple-800 dark:text-purple-300",
          containerClass: "px-4 py-2",
          animation: "",
        };
      case "served":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Utensils className="relative text-teal-500 dark:text-teal-400 w-6 h-6 animate-[wiggle_1s_ease-in-out_infinite]" />
            </div>
          ),
          text: customText || "Served",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50"
              : design === "minimal"
              ? "bg-transparent border border-teal-300 dark:border-teal-600"
              : "bg-teal-100 dark:bg-teal-900/50",
          textColor: "text-teal-800 dark:text-teal-300",
          containerClass: "px-4 py-2",
          animation: "",
        };
      case "completed":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              {design === "gradient" && (
                <div className="absolute inset-0 bg-green-200 dark:bg-green-800/30 rounded-full scale-0 animate-[pop_0.5s_ease-in-out]" />
              )}
              <CheckCircle className="relative text-green-500 dark:text-green-400 w-6 h-6" />
            </div>
          ),
          text: customText || "Completed",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50"
              : design === "minimal"
              ? "bg-transparent border border-green-300 dark:border-green-600"
              : "bg-green-100 dark:bg-green-900/50",
          textColor: "text-green-800 dark:text-green-300",
          containerClass: "px-4 py-2",
          animation: "",
        };
      case "cancelled":
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <XCircle className="relative text-red-500 dark:text-red-400 w-6 h-6 animate-[shake_0.5s_ease-in-out]" />
            </div>
          ),
          text: customText || "Cancelled",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50"
              : design === "minimal"
              ? "bg-transparent border border-red-300 dark:border-red-600"
              : "bg-red-100 dark:bg-red-900/50",
          textColor: "text-red-800 dark:text-red-300",
          containerClass: "px-4 py-2",
          animation: "",
        };
      default:
        return {
          icon: (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Clock className="relative text-gray-500 dark:text-gray-400 w-6 h-6" />
            </div>
          ),
          text: customText || "Unknown",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50"
              : design === "minimal"
              ? "bg-transparent border border-gray-300 dark:border-gray-600"
              : "bg-gray-100 dark:bg-gray-900/50",
          textColor: "text-gray-800 dark:text-gray-300",
          containerClass: "px-4 py-2",
          animation: "",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center space-x-3 rounded-full ${config.bgColor} ${config.containerClass} transition-all duration-300 shadow-sm hover:shadow-lg ${config.animation}`}
      role="status"
      aria-label={`Order status: ${config.text}`}
    >
      {config.icon}
      <span className={`text-base md:text-lg font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};

export default OrderStatus;
