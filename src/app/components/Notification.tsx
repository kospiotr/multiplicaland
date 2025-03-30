'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

export default function Notification({ message, type }: NotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
} 