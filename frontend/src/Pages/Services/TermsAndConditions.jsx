import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const TermsAndConditions = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link 
            to="/signup" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Sign Up
          </Link>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold mb-2"
            >
              Terms and Conditions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100 max-w-2xl"
            >
              Please read these terms carefully before using our service. By accessing or using our platform, you agree to be bound by these terms.
            </motion.p>
          </div>

          <div className="p-8">
            <div className="prose prose-blue max-w-none">
              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  1. Introduction
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Welcome to our platform. These terms and conditions outline the rules and regulations for the use of our website and services.
                  </p>
                  <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                    <strong>Important:</strong> By accessing this website, we assume you accept these terms and conditions. Do not continue to use our platform if you do not agree to all of the terms and conditions stated on this page.
                  </p>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  2. Intellectual Property Rights
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Unless otherwise stated, we own the intellectual property rights for all material on this platform. All intellectual property rights are reserved.
                  </p>
                  <p>
                    You may view and/or print pages for your own personal use subject to restrictions set in these terms and conditions.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                    <strong>Note:</strong> Unauthorized use, reproduction, or distribution of any content from this platform may give rise to a claim for damages and/or be a criminal offense.
                  </div>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  3. User Responsibilities
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>As a user of our platform, you agree to the following responsibilities:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You must not use this platform in any way that causes damage or impairs accessibility</li>
                    <li>You must not use this platform to copy, store, or transmit any material that is illegal or unlawful</li>
                    <li>You are responsible for maintaining the confidentiality of your account and password</li>
                    <li>You agree to accept responsibility for all activities that occur under your account</li>
                    <li>You must not conduct any systematic or automated data collection activities without our permission</li>
                  </ul>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  4. Privacy Policy
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    By using our platform, you consent to our collection and use of personal data as outlined in our Privacy Policy.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <strong>Your Rights:</strong> You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting us.
                  </div>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  5. Limitation of Liability
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We will not be liable for any direct, indirect, incidental, consequential, or exemplary damages resulting from your use of this platform.
                  </p>
                  <p>
                    We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.
                  </p>
                  <p>
                    The platform is provided "as is" and "as available" without any warranties, express or implied.
                  </p>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  6. Changes to Terms
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    Your continued use of the platform after any such changes constitutes your acceptance of the new terms.
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
                    <strong>Notification:</strong> For significant changes, we may also provide additional notice such as email notification or in-platform announcements.
                  </div>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-500 mr-2" />
                  7. Governing Law
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of [Your Country/State], and you submit to the non-exclusive jurisdiction of the courts located in [Your Country/State] for the resolution of any disputes.
                  </p>
                  <p>
                    If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions will remain in full force and effect.
                  </p>
                </div>
              </motion.section>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <Link 
                to="/signup" 
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                I Agree to These Terms
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;