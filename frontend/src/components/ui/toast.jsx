// frontend/src/components/ui/toast.jsx
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import useStore from '@/store/useStore';

const TOAST_DURATION = 5000;

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const styles = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
};

function ToastItem({ toast, onClose }) {
  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles[toast.type] || styles.info} min-w-[300px] max-w-[500px]`}
    >
      <Icon className="size-5 shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm mb-1">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm opacity-90">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { notifications, removeNotification } = useStore((state) => ({
    notifications: state.notifications,
    removeNotification: state.removeNotification
  }));

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const addNotification = useStore((state) => state.addNotification);

  return {
    success: (message, title = 'Success') => {
      addNotification({ type: 'success', title, message });
    },
    error: (message, title = 'Error') => {
      addNotification({ type: 'error', title, message });
    },
    warning: (message, title = 'Warning') => {
      addNotification({ type: 'warning', title, message });
    },
    info: (message, title = 'Info') => {
      addNotification({ type: 'info', title, message });
    },
    custom: (options) => {
      addNotification(options);
    }
  };
}