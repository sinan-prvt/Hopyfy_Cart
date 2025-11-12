import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Name is Required"),
  email: Yup.string().email("Invalid Email").required("Email is Required"),
  password: Yup.string()
    .min(8, "Minimum 8 Characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex flex-col items-center justify-center text-center">
          <motion.h2 className="text-3xl font-bold">Create Account</motion.h2>
          <motion.p className="mt-2">Join us to get started</motion.p>
        </div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setErrors }) => {
            setIsSubmitting(true);
            const res = await signup({
              username: values.username,
              email: values.email,
              password: values.password,
              confirmPassword: values.confirmPassword,
            });
            setIsSubmitting(false);

            if (res.success) {
              toast.success("Account created and logged in!");
              navigate("/");
            } else if (res.errors) {
              const formErrors = {};
              Object.entries(res.errors).forEach(([field, messages]) => {
                if (field === "password2") field = "confirmPassword";
                formErrors[field] = messages.join(" ");
              });
              setErrors(formErrors);
            } else {
              toast.error("Signup failed");
            }
          }}
        >
          {({ touched, errors }) => (
            <Form className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <Field
                  name="username"
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.username && errors.username
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="./terms-and-conditions"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <ErrorMessage
                name="terms"
                component="div"
                className="text-red-600 text-sm mt-1"
              />

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </motion.button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;
