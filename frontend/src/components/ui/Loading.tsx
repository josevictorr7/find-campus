import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-navy animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 bg-brand-yellow rounded-full animate-ping opacity-75" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-xs z-50 flex items-center justify-center">{content}</div>;
  }

  return content;
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-6 bg-slate-200 rounded-full w-20" />
    </div>
    <div className="h-10 bg-slate-100 rounded-xl" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="h-3 bg-slate-200 rounded w-1/4" />
    </div>
  </div>
);
