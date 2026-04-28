import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import {
  API_BASE_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

export default function PostItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const editId = searchParams.get("edit");

  const widgetRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    price: "",
    location: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!editId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/items/${editId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load item");
        }

        setFormData({
          title: data.title || "",
          category: data.category || "",
          type: data.type || "",
          price: data.price || "",
          location: data.location || "",
          image: data.image || "",
        });
      } catch (error) {
        setBanner({
          type: "error",
          message: "Failed to load item data.",
        });
      }
    }

    fetchItem();
  }, [editId]);

  useEffect(() => {
    if (!window.cloudinary || widgetRef.current) return;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        folder: "shareloop-items",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          setUploading(false);
          setBanner({
            type: "error",
            message: "Image upload failed.",
          });
          return;
        }

        if (result?.event === "upload-added") {
          setUploading(true);
        }

        if (result?.event === "success") {
          setUploading(false);
          setPreviewError(false);
          setFormData((prev) => ({
            ...prev,
            image: result.info.secure_url,
          }));
          setBanner({
            type: "success",
            message: "Image uploaded successfully.",
          });
        }

        if (result?.event === "close") {
          setUploading(false);
        }
      }
    );
  }, []);

  function openUploadWidget() {
    if (!widgetRef.current) {
      setBanner({
        type: "error",
        message: "Upload widget is not ready yet.",
      });
      return;
    }

    widgetRef.current.open();
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "image") {
      setPreviewError(false);
    }

    if (banner.message) {
      setBanner({ type: "", message: "" });
    }
  }

  function isValidImageUrl(url) {
    if (!url.trim()) return true;
    return /^https?:\/\/.+/i.test(url.trim());
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Item title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.type) newErrors.type = "Please select a type.";

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters.";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
    } else {
      if (formData.type === "Donate" && formData.price.trim().toLowerCase() !== "free") {
        newErrors.price = 'Donate items should use "Free" as price.';
      }
      if (formData.type === "Borrow" && formData.price.trim().toLowerCase() !== "borrow") {
        newErrors.price = 'Borrow items should use "Borrow" as price.';
      }
      if (formData.type === "Sell" && !/[0-9]/.test(formData.price.trim())) {
        newErrors.price = "Sell items should have a numeric price like ৳500.";
      }
    }

    if (!isValidImageUrl(formData.image)) {
      newErrors.image = "Please enter a valid image URL starting with http or https.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setBanner({
        type: "error",
        message: "Please fix the highlighted fields before submitting.",
      });
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to post or edit an item.",
      });
      return;
    }

    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        image: formData.image.trim() || DEFAULT_IMAGE,
      };

      if (editId) {
        const res = await fetch(`${API_BASE_URL}/api/items/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update item");
        }

        setBanner({ type: "success", message: "Item updated successfully." });

        setTimeout(() => {
          navigate(`/item/${editId}`);
        }, 900);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to create item");
        }

        setBanner({ type: "success", message: "Item submitted successfully." });

        setFormData({
          title: "",
          category: "",
          type: "",
          price: "",
          location: "",
          image: "",
        });
        setPreviewError(false);

        setTimeout(() => {
          navigate("/browse");
        }, 900);
      }
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    }
  }

  function inputClass(name) {
    return `w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 ${
      errors[name]
        ? "border-red-400 focus:ring-red-300"
        : "border-zinc-200 focus:ring-green-500"
    }`;
  }

  const previewImage = useMemo(() => {
    if (formData.image.trim() && !previewError) {
      return formData.image.trim();
    }
    return DEFAULT_IMAGE;
  }, [formData.image, previewError]);

  return (
    <AppShell>
      <PageHeader
        title={editId ? "Edit Item" : "Post an Item"}
        description={
          editId
            ? "Update the details of your item."
            : "Share an item for donation, sale, or borrowing."
        }
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
      >
        {banner.message && (
          <div
            className={`rounded-2xl p-4 text-sm font-medium ${
              banner.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {banner.message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Study Lamp"
                className={inputClass("title")}
              />
              {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass("category")}
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Books">Books</option>
                  <option value="Essentials">Essentials</option>
                </select>
                {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass("type")}
                >
                  <option value="">Select type</option>
                  <option value="Donate">Donate</option>
                  <option value="Sell">Sell</option>
                  <option value="Borrow">Borrow</option>
                </select>
                {errors.type && <p className="mt-2 text-sm text-red-500">{errors.type}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Free / ৳500 / Borrow"
                  className={inputClass("price")}
                />
                {errors.price && <p className="mt-2 text-sm text-red-500">{errors.price}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhanmondi"
                  className={inputClass("location")}
                />
                {errors.location && <p className="mt-2 text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste image link here or use Upload"
                className={inputClass("image")}
              />
              {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openUploadWidget}
                  disabled={uploading}
                  className="rounded-2xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload with Cloudinary"}
                </button>

                {formData.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: "" }));
                      setPreviewError(false);
                    }}
                    className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                You can either paste a direct image URL or use the Cloudinary upload button.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-zinc-700">Image Preview</p>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm">
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => setPreviewError(true)}
                />
              </div>

              <div className="border-t border-zinc-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {formData.title.trim() || "Your item preview"}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      📍 {formData.location.trim() || "Location preview"}
                    </p>
                  </div>
                  <span className="font-bold text-zinc-900">
                    {formData.price.trim() || "Price"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                    {formData.type || "Type"}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {formData.category || "Category"}
                  </span>
                </div>

                {previewError && formData.image.trim() && (
                  <p className="mt-4 text-sm text-amber-600">
                    Preview failed for this image. A default image will be used instead.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
              <p className="font-medium text-zinc-800">Real upload is now enabled</p>
              <p className="mt-1">
                This uses Cloudinary’s upload widget for browser-side image upload.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
        >
          {editId ? "Update Item" : "Submit Item"}
        </button>
      </form>
    </AppShell>
  );
}