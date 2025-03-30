'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
        <nav className="container mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            MultiplicaLand
          </Link>
          <div>
            <Link href="/progress" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Progress
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 