import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("categories/");
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const initialValues = {
    name: "",
    brand: "",
    description: "",
    price: "",
    originalPrice: "",
    discountPercentage: "",
    count: "",
    sizes: [""],
    shoeType: "",
    color: "",
    material: "",
    weight: "",
    category: "",
    images: [""],
    isActive: true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    brand: Yup.string().required("Brand is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0).required("Price is required"),
    count: Yup.number().min(0).required("Stock count is required"),
    category: Yup.string().required("Category is required"),
    images: Yup.array()
      .of(Yup.string().required("Image URL is required"))
      .min(1, "At least one image required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        brand: values.brand,
        description: values.description,
        price: values.price,
        original_price: values.originalPrice,
        discount_percentage: values.discountPercentage,
        stock: values.count,
        sizes: values.sizes.filter((s) => s.trim() !== ""),
        shoe_type: values.shoeType,
        color: values.color,
        material: values.material,
        weight: values.weight,
        is_active: values.isActive,
        category_id: values.category,
        images: values.images
          .map((img) => img.trim())
          .filter((img) => img)
          .map((img) => {
            if (img.startsWith("http")) return img;
            if (img.startsWith("/media"))
              return `http://127.0.0.1:8000${img}`;
            return `http://127.0.0.1:8000/media/${img.replace(/^\/+/, "")}`;
          }),
      };

      console.log("🟢 Add Product Payload:", payload);

      await api.post("products/", payload);
      toast.success("✅ Product added successfully!");
      resetForm();
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Failed to add product:", err.response?.data || err);
      toast.error(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add Product
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter product details below to add a new item
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h2 className="text-xl font-bold">Product Information</h2>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Product Name *
                      </label>
                      <Field name="name" className="w-full border p-3 rounded" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Brand *</label>
                      <Field name="brand" className="w-full border p-3 rounded" />
                      <ErrorMessage
                        name="brand"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Description *
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="3"
                        className="w-full border p-3 rounded"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Category *
                      </label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full border p-3 rounded"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Price *</label>
                        <Field
                          name="price"
                          type="number"
                          className="w-full border p-3 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">
                          Original Price
                        </label>
                        <Field
                          name="originalPrice"
                          type="number"
                          className="w-full border p-3 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Discount %</label>
                      <Field
                        name="discountPercentage"
                        type="number"
                        className="w-full border p-3 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Stock Count *
                      </label>
                      <Field
                        name="count"
                        type="number"
                        className="w-full border p-3 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Sizes</label>
                      {values.sizes.map((size, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <Field
                            name={`sizes[${i}]`}
                            className="w-full border p-2 rounded"
                            placeholder="Enter size"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...values.sizes];
                              arr.splice(i, 1);
                              setFieldValue("sizes", arr);
                            }}
                            className="text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue("sizes", [...values.sizes, ""])
                        }
                        className="text-blue-600 text-sm"
                      >
                        + Add Size
                      </button>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Shoe Type</label>
                      <Field
                        name="shoeType"
                        className="w-full border p-3 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Color</label>
                      <Field name="color" className="w-full border p-3 rounded" />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Material</label>
                      <Field
                        name="material"
                        className="w-full border p-3 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Weight</label>
                      <Field
                        name="weight"
                        className="w-full border p-3 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Images *</label>
                      {values.images.map((img, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                          <Field
                            name={`images[${i}]`}
                            className="w-full border p-2 rounded"
                            placeholder="Image URL or /media/... path"
                          />
                          {img && (
                            <img
                              src={img}
                              alt="preview"
                              className="w-14 h-14 object-cover rounded border"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/80?text=No+Image")
                              }
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...values.images];
                              arr.splice(i, 1);
                              setFieldValue("images", arr);
                            }}
                            className="text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue("images", [...values.images, ""])
                        }
                        className="text-blue-600"
                      >
                        + Add Image
                      </button>
                      <ErrorMessage
                        name="images"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="isActive"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Active Product
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    {isSubmitting ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
