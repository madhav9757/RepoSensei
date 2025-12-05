import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Toast store
let toastId = 0;
const toastListeners = new Set();
const toasts = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export const useToast = () => {
  const [, setToastList] = useState([]);

  useEffect(() => {
    const listener = setToastList;
    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  return {
    success: (title, description) => addToast("success", title, description),
    error: (title, description) => addToast("error", title, description),
    info: (title, description) => addToast("info", title, description),
  };
};

function addToast(type, title, description) {
  const id = toastId++;
  const toast = { id, type, title, description };
  toasts.push(toast);
  notifyListeners();

  // Auto remove after 5 seconds
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    notifyListeners();
  }
}

export function ToastContainer() {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    toastListeners.add(setToastList);
    return () => toastListeners.delete(setToastList);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      <AnimatePresence>
        {toastList.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ id, type, title, description, onClose }) {
  const config = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-50 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const { icon: Icon, bg, border, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`${bg} ${border} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
    >
      <Icon className={`size-5 ${iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}