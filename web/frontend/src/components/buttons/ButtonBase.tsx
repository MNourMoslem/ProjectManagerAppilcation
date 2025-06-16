import type { ReactNode } from 'react';

export interface BaseButtonProps {
  icon?: ReactNode;
  text?: string;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

// Common button style configurations
export const buttonSizes = {
  xs: 'text-[10px] py-0.5 px-1.5',
  sm: 'text-xs py-1 px-2',
  md: 'text-sm py-1.5 px-2.5',
  lg: 'text-base py-2 px-3',
};

// Common focus and disabled states
export const buttonStates = {
  focus: 'focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-400 dark:focus:ring-gray-600',
  disabled: 'opacity-50 cursor-not-allowed',
};

// Font styling for that tiny, fancy look inspired by Linear
export const buttonFont = 'font-medium tracking-tight';
