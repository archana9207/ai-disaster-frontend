'use client';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Temporarily remove auth check to see if page renders
  return (
    <div className="p-4">
      {children}
    </div>
  );
}