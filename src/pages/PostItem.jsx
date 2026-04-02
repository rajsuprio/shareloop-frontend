import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";

export default function PostItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");

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

  useEffect(() => {
    if (editId) {
      const items = JSON.parse(localStorage.getItem("shareloopItems")) || [];
      const existingItem = items.find((item) => String(item.id) === editId);

      if (existingItem) {
        setFormData({
          title: existingItem.title || "",
          category: existingItem.category || "",
          type: existingItem.type || "",
          price: existingItem.price || "",
          location: existingItem.location || "",
          image: existingItem.image || "",
        });
      }
    }
  }, [editId]);

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

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const items = JSON.parse(localStorage.getItem("shareloopItems")) || [];

    if (editId) {
      const updatedItems = items.map((item) =>
        String(item.id) === editId
          ? {
              ...item,
              ...formData,
              image:
                formData.image ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
            }
          : item
      );

      localStorage.setItem("shareloopItems", JSON.stringify(updatedItems));
      setBanner({ type: "success", message: "Item updated successfully." });

      setTimeout(() => navigate(`/item/${editId}`), 900);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      };

      localStorage.setItem("shareloopItems", JSON.stringify([newItem, ...items]));
      setBanner({ type: "success", message: "Item submitted successfully." });

      setFormData({
        title: "",
        category: "",
        type: "",
        price: "",
        location: "",
        image: "",
      });

      setTimeout(() => navigate("/browse"), 900);
    }
  }

  function inputClass(name) {
    return `w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 ${
      errors[name]
        ? "border-red-400 focus:ring-red-300"
        : "border-zinc-200 focus:ring-green-500"
    }`;
  }

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
            placeholder="Paste image link here"
            className={inputClass("image")}
          />
          {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
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