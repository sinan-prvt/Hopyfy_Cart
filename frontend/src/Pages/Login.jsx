import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message, type) => {
    toast.dismiss();
    if (type === "success") toast.success(message);
    else toast.error(message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-teal-500 to-indigo-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Welcome Back
          </h2>
          <p className="text-sm text-white/90 mt-1">
            Login to continue your journey
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            const res = await login(values.email, values.password);
            setIsSubmitting(false);

            if (res.success && res.user) {
              showToast("Login successful!", "success");
              const loggedUser = res.user;
              setTimeout(() => {
                if (loggedUser.is_staff || loggedUser.is_superuser) {
                  navigate("/admin/dashboard");
                } else {
                  navigate("/");
                }
              }, 600);
            } else {
              showToast("Invalid email or password!", "error");
            }
          }}
        >
          {({ touched, errors }) => (
            <Form className="p-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-700 ${
                      touched.email && errors.email
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    } transition-all`}
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1 font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border text-gray-700 ${
                      touched.password && errors.password
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    } transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-teal-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1 font-medium"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 
                        0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 
                        014 12H0c0 3.042 
                        1.135 5.824 3 
                        7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Sign In
                  </span>
                )}
              </motion.button>

              <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span>or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Create one
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;
