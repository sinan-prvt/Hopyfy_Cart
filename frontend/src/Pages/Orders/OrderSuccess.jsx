import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-orders");
    }, 5000);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-4 relative overflow-hidden">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md border-t-4 border-green-500"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-green-700 mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You will be redirected to your orders page shortly.
        </p>
        <p className="text-gray-400 text-sm">Redirecting in 3 seconds...</p>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
