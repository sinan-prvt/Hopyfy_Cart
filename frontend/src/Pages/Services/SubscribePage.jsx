import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SubscribePage = () => {
  const [email, setEmail] = useState("");
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("subscribedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setTimeout(() => setShowLink(true), 1500);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-bold mb-3 text-green-700">Thank You!</h1>
        <p className="text-gray-700 mb-4">
          {email ? `You’ve successfully subscribed with ${email}.` : "Subscription successful!"}
        </p>

        {showLink ? (
          <>
            <p className="text-gray-800 mb-4">Join our WhatsApp community for special offers 👇</p>
            <a
              href="https://chat.whatsapp.com/JTxF7NCVtNK1qehODEUn69?mode=ems_copy_t"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg inline-block font-semibold transition duration-200"
            >
              Join on WhatsApp
            </a>
          </>
        ) : (
          <p className="text-gray-500 italic mt-4 animate-pulse">Preparing your link...</p>
        )}

        <Link to="/" className="block mt-6 text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SubscribePage;
