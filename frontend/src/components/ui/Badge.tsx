import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lost' | 'found' | 'returned' | 'default' | 'admin' | 'aluno';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  const variantStyles = {
    lost: 'bg-amber-100 text-amber-900 border border-amber-300/80',
    found: 'bg-blue-100 text-blue-900 border border-blue-300/80',
    returned: 'bg-emerald-100 text-emerald-900 border border-emerald-300/80',
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    admin: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
    aluno: 'bg-slate-100 text-slate-800 border border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === 'lost'
            ? 'bg-amber-500'
            : variant === 'found'
            ? 'bg-blue-600'
            : variant === 'returned'
            ? 'bg-emerald-500'
            : 'bg-slate-400'
        }`}
      />
      {children}
    </span>
  );
};
