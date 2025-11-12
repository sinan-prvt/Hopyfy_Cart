import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2 bg-gradient-to-br from-black to-gray-800 text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-300 mb-6">We’d love to hear from you. Please fill out the form and we’ll get back to you soon.</p>
          <div className="text-sm space-y-2">
            <p><strong>📍 Address:</strong> 123 Hopyfy Street, India</p>
            <p><strong>📞 Phone:</strong> +91 9876543210</p>
            <p><strong>✉️ Email:</strong> hopyfycart@gmail.com</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
