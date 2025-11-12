import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 min-w-[300px] text-center`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{message}</span>
          <button 
            onClick={onClose} 
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;