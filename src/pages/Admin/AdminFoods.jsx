import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const API = import.meta.env.VITE_API_URL;

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  isAvailable: true,
  image: null,
};

const AdminFoods = () => {
  const { token } = useContext(StoreContext);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [preview, setPreview] = useState("");

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [f, c] = await Promise.all([
      fetch(`${API}/admin/foods`, { headers: authHeader }).then((r) =>
        r.json(),
      ),
      fetch(`${API}/admin/categories`, { headers: authHeader }).then((r) =>
        r.json(),
      ),
    ]);
    setFoods(f);
    setCategories(c);
    setLoading(false);
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Valid price is required.";
    if (!form.categoryId) e.categoryId = "Category is required.";
    if (!editItem && !form.image) e.image = "Image is required.";
    return e;
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setPreview("");
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditItem(food);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      categoryId: food.categoryId,
      isAvailable: food.isAvailable,
      image: null,
    });
    setPreview(food.imageUrl);
    setErrors({});
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("categoryId", form.categoryId);
    fd.append("isAvailable", form.isAvailable);
    if (form.image) fd.append("image", form.image);

    const url = editItem
      ? `${API}/admin/foods/${editItem.id}`
      : `${API}/admin/foods`;
    const method = editItem ? "PUT" : "POST";

    await fetch(url, { method, headers: authHeader, body: fd });
    setSaving(false);
    setShowModal(false);
    loadData();
  };

  const handleDelete = async () => {
    await fetch(`${API}/admin/foods/${deleteId}`, {
      method: "DELETE",
      headers: authHeader,
    });
    setDeleteId(null);
    loadData();
  };

  if (loading)
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        Loading...
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Food Items</h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          + Add Food Item
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="admin-food-thumb"
                    onError={(e) => (e.target.src = "")}
                  />
                </td>
                <td>{food.name}</td>
                <td>{food.categoryName}</td>
                <td>${food.price.toFixed(2)}</td>
                <td>
                  <span
                    className={`admin-status-badge ${food.isAvailable ? "delivered" : "cancelled"}`}
                  >
                    {food.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="admin-actions">
                  <button
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={() => openEdit(food)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => setDeleteId(food.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editItem ? "Edit Food Item" : "Add Food Item"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  rows={3}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className={errors.description ? "input-error" : ""}
                />
                {errors.description && (
                  <span className="field-error">{errors.description}</span>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    className={errors.price ? "input-error" : ""}
                  />
                  {errors.price && (
                    <span className="field-error">{errors.price}</span>
                  )}
                </div>

                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className={errors.categoryId ? "input-error" : ""}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <span className="field-error">{errors.categoryId}</span>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isAvailable: e.target.checked }))
                    }
                  />{" "}
                  Available
                </label>
              </div>

              <div className="admin-form-group">
                <label>
                  Image {editItem && "(leave empty to keep current)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <span className="field-error">{errors.image}</span>
                )}
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="admin-img-preview"
                  />
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm">
            <div className="admin-modal-header">
              <h3>Delete Food Item</h3>
              <button onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete this food item? This cannot be
                undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;
