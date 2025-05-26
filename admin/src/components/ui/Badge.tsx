import React from "react";
import { cn } from "../../lib/utils";
import {
  Clock,
  RotateCw,
  ChefHat,
  Utensils,
  CheckCircle,
  XCircle,
} from "lucide-react";

type BadgeVariant =
  | "pending"
  | "preparing"
  | "prepairing"
  | "prepared"
  | "served"
  | "completed"
  | "cancelled";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const Badge = ({
  className,
  variant = "pending",
  children,
  ...props
}: BadgeProps) => {
  const variantConfig: Record<
    BadgeVariant,
    { styles: string; icon: JSX.Element }
  > = {
    pending: {
      styles:
        "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-800/20 dark:text-orange-300 dark:border-orange-700/30",
      icon: <Clock className="w-4 h-4" />,
    },
    preparing: {
      styles:
        "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-800/20 dark:text-blue-300 dark:border-blue-700/30",
      icon: <RotateCw className="w-4 h-4 animate-spin-slow" />,
    },
    prepairing: {
      styles:
        "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-800/20 dark:text-indigo-300 dark:border-indigo-700/30",
      icon: <ChefHat className="w-4 h-4" />,
    },
    prepared: {
      styles:
        "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-800/20 dark:text-purple-300 dark:border-purple-700/30",
      icon: <Utensils className="w-4 h-4" />,
    },
    served: {
      styles:
        "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-800/20 dark:text-teal-300 dark:border-teal-700/30",
      icon: <Utensils className="w-4 h-4" />,
    },
    completed: {
      styles:
        "bg-green-100 text-green-800 border-green-300 dark:bg-green-800/20 dark:text-green-300 dark:border-green-700/30",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    cancelled: {
      styles:
        "bg-red-100 text-red-800 border-red-300 dark:bg-red-800/20 dark:text-red-300 dark:border-red-700/30",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  // Fallback for invalid variants
  const config = variantConfig[variant] || variantConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium space-x-1",
        config.styles,
        className
      )}
      {...props}
    >
      {config.icon}
      {children}
    </span>
  );
};

export default Badge;
