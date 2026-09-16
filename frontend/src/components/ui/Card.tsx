import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'gradient' | 'highlight';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-xs',
    flat: 'bg-slate-100 border border-slate-200/60',
    gradient: 'bg-gradient-to-br from-brand-dark via-brand-navy to-brand-blue text-white shadow-md',
    highlight: 'bg-white border-2 border-brand-yellow/60 shadow-sm',
  };

  const hoverStyles = hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300' : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-5 border-b border-slate-100 ${className}`}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 bg-slate-50/70 border-t border-slate-100 ${className}`}>{children}</div>
);
