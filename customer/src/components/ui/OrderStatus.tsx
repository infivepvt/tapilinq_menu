import React from "react";

interface OrderStatusProps {
  status:
    | "pending"
    | "preparing"
    | "prepared"
    | "served"
    | "completed"
    | "cancelled";
  design?: "default" | "gradient" | "minimal";
  customText?: string;
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
            <div className="relative w-100">
              <img
                src="/pending.gif"
                className="w-100 md:w-50 lg:w-25"
                alt=""
              />
            </div>
          ),
          text: customText || "Pending",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50"
              : design === "minimal"
              ? "bg-transparent border border-orange-300 dark:border-orange-600"
              : "bg-orange-100 dark:bg-orange-900/50",
          textColor: "text-orange-800 dark:text-orange-300",
          containerClass: "px-4 py-3",
        };
      case "preparing":
        return {
          icon: (
            <div className="relative w-100">
              <img
                src="/preparing.gif"
                className="w-100 md:w-50 lg:w-25"
                alt=""
              />
            </div>
          ),
          text: "Your foods are getting ready...",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50"
              : design === "minimal"
              ? "bg-transparent border border-blue-300 dark:border-blue-600"
              : "bg-blue-100 dark:bg-blue-900/50",
          textColor: "text-blue-800 dark:text-blue-300",
          containerClass: "px-4 py-3",
        };
      case "prepared":
        return {
          icon: (
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                {/* Plate */}
                <circle
                  cx="12"
                  cy="13"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {/* Food */}
                <ellipse cx="12" cy="10" rx="4" ry="2" fill="currentColor" />
                {/* Checkmark animation */}
                <path
                  d="M8 12L11 15L16 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                  className="animate-[drawCheck_0.5s_0.2s_ease-out_forwards]"
                />
              </svg>
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
          containerClass: "px-4 py-3",
        };
      case "served":
        return {
          icon: (
            <div className="relative w-100">
              <img
                src="/deliver.gif"
                className="w-100 md:w-50 lg:w-25"
                alt=""
              />
            </div>
          ),
          text: "Order delivered..",
          bgColor:
            design === "gradient"
              ? "bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50"
              : design === "minimal"
              ? "bg-transparent border border-teal-300 dark:border-teal-600"
              : "bg-teal-100 dark:bg-teal-900/50",
          textColor: "text-teal-800 dark:text-teal-300",
          containerClass: "px-4 py-3",
        };
      case "completed":
        return {
          icon: (
            <div className="relative w-12 h-12">
              {/* Animated circle */}
              <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-20" />
              {/* Checkmark */}
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 12L11 15L16 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
          containerClass: "px-4 py-3",
        };
      case "cancelled":
        return {
          icon: (
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {/* Animated X mark */}
                <path
                  d="M8 8L16 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                  className="animate-[drawX_0.4s_ease-out_forwards]"
                />
                <path
                  d="M16 8L8 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                  className="animate-[drawX_0.4s_0.2s_ease-out_forwards]"
                />
              </svg>
              {/* Pulsing dot */}
              <span className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-0.75 -ml-0.75 rounded-full bg-current animate-pulse" />
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
          containerClass: "px-4 py-3",
        };
      default:
        return {
          icon: (
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ?
                </text>
              </svg>
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
          containerClass: "px-4 py-3",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`flex flex-col items-center justify-center w-full rounded-lg ${config.bgColor} ${config.containerClass} transition-all duration-300 shadow-sm hover:shadow-lg`}
      role="status"
      aria-label={`Order status: ${config.text}`}
    >
      {config.icon}
      <span
        className={`text-base md:text-lg font-medium ${config.textColor} mt-2 text-center`}
      >
        {config.text}
      </span>
    </div>
  );
};

export default OrderStatus;
