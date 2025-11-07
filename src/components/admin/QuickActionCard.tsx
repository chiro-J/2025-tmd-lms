import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "orange" | "green" | "blue" | "purple";
  isActive: boolean;
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  color,
  isActive,
  onClick,
}: QuickActionCardProps) {
  const colorClasses = {
    orange: {
      active: "border-orange-300 bg-orange-50",
      inactive: "border-gray-200 hover:border-orange-300",
      iconBg: isActive ? "bg-orange-200" : "bg-orange-100 group-hover:bg-orange-200",
      iconColor: "text-orange-600",
      arrowColor: isActive ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500",
    },
    green: {
      active: "border-green-300 bg-green-50",
      inactive: "border-gray-200 hover:border-green-300",
      iconBg: isActive ? "bg-green-200" : "bg-green-100 group-hover:bg-green-200",
      iconColor: "text-green-600",
      arrowColor: isActive ? "text-green-500" : "text-gray-400 group-hover:text-green-500",
    },
    blue: {
      active: "border-blue-300 bg-blue-50",
      inactive: "border-gray-200 hover:border-blue-300",
      iconBg: isActive ? "bg-blue-200" : "bg-blue-100 group-hover:bg-blue-200",
      iconColor: "text-blue-600",
      arrowColor: isActive ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500",
    },
    purple: {
      active: "border-purple-300 bg-purple-50",
      inactive: "border-gray-200 hover:border-purple-300",
      iconBg: isActive ? "bg-purple-200" : "bg-purple-100 group-hover:bg-purple-200",
      iconColor: "text-purple-600",
      arrowColor: isActive ? "text-purple-500" : "text-gray-400 group-hover:text-purple-500",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
        isActive ? classes.active : classes.inactive
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg flex-shrink-0 ${classes.iconBg}`}>
          <Icon className={`h-6 w-6 ${classes.iconColor}`} />
        </div>
        <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 break-words">{title}</h3>
          <p className="text-sm text-gray-600 break-words leading-tight">{description}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <ArrowRight className={`h-4 w-4 transition-colors ${classes.arrowColor}`} />
      </div>
    </div>
  );
}

