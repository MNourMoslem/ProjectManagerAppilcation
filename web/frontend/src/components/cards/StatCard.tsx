import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ 
  label, 
  value, 
  icon, 
  trend,
  className = '' 
}: StatCardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md p-4 ${className}`}>      <div className="flex items-center justify-between">
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      
      {trend && (        <div className={`flex items-center mt-2 text-xs md:text-sm ${
          trend.isPositive 
            ? 'text-green-500 dark:text-green-400' 
            : 'text-red-500 dark:text-red-400'
        }`}>
          {trend.isPositive ? (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          )}          <span>{Math.abs(trend.value)}%</span>
          <span className="ml-1 text-gray-400 dark:text-gray-500 text-[10px] md:text-xs">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
