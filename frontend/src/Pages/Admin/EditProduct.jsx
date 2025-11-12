import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get(`products/${id}/`),
          api.get("categories/"),
        ]);

        const p = productRes.data;
        setCategories(categoryRes.data);

        const normalizedImages =
          p.images && p.images.length
            ? p.images.map((img) => {
                if (typeof img === "string") {
                  if (img.startsWith("http")) return img;
                  if (img.startsWith("/media"))
                    return `http://127.0.0.1:8000${img}`;
                  return `http://127.0.0.1:8000/media/${img.replace(
                    /^\/+/,
                    ""
                  )}`;
                }
                return "";
              })
            : [""];

        setInitialValues({
          name: p.name || "",
          brand: p.brand || "",
          description: p.description || "",
          price: p.price || 0,
          originalPrice: p.original_price || 0,
          discountPercentage: p.discount_percentage || 0,
          count: p.stock || 0,
          sizes: p.sizes?.length ? p.sizes : [""],
          shoeType: p.shoe_type || "",
          color: p.color || "",
          material: p.material || "",
          weight: p.weight || "",
          category: p.category?.id?.toString() || "",
          images: normalizedImages,
          isActive: p.is_active !== false,
        });
      } catch (err) {
        console.error("❌ Failed to fetch product", err);
        setSubmitError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    brand: Yup.string().required("Brand is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0).required("Price is required"),
    count: Yup.number().min(0).required("Stock count required"),
    category: Yup.string().required("Category is required"),
    images: Yup.array()
      .of(Yup.string().required("Image URL is required"))
      .min(1, "At least one image required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");
    try {
      const payload = {
        name: values.name,
        brand: values.brand,
        description: values.description,
        price: values.price,
        original_price: values.originalPrice,
        discount_percentage: values.discountPercentage,
        stock: values.count,
        sizes: values.sizes,
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

      console.log("🟢 Update Payload:", payload);

      await api.put(`products/${id}/`, payload);
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Update failed", err.response?.data || err);
      setSubmitError("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialValues)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading product details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Product
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Update the product information below
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
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Product Name *
                      </label>
                      <Field
                        name="name"
                        className="w-full border p-3 rounded"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Brand *</label>
                      <Field
                        name="brand"
                        className="w-full border p-3 rounded"
                      />
                      <ErrorMessage
                        name="brand"
                        component="div"
                        className="text-red-500 text-sm mt-1"
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
                        className="text-red-500 text-sm mt-1"
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
                        className="text-red-500 text-sm mt-1"
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
                      <label className="block mb-1 font-medium">Images *</label>
                      {values.images.map((img, i) => (
                        <div
                          key={i}
                          className="flex gap-2 mb-2 items-center"
                        >
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
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80?text=No+Image";
                              }}
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

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
