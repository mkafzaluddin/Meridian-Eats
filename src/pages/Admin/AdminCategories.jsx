import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const API = import.meta.env.VITE_API_URL;

const AdminCategories = () => {
  const { token } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState({ name: "", image: null });
  const [errors,     setErrors]     = useState({});
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [preview,    setPreview]    = useState("");
  const [apiError,   setApiError]   = useState("");

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await fetch(`${API}/admin/categories`, { headers: authHeader }).then(r => r.json());
    setCategories(data);
    setLoading(false);
  }

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", image: null });
    setPreview(""); setErrors({}); setApiError("");
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, image: null });
    setPreview(cat.imageUrl); setErrors({}); setApiError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!editItem && !form.image) e.image = "Image is required.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSaving(true);
    const fd = new FormData();
    fd.append("name", form.name);
    if (form.image) fd.append("image", form.image);

    const url    = editItem ? `${API}/admin/categories/${editItem.id}` : `${API}/admin/categories`;
    const method = editItem ? "PUT" : "POST";
    const res    = await fetch(url, { method, headers: authHeader, body: fd });
    const data   = await res.json();

    if (!res.ok) { setApiError(data.message || "Failed to save."); setSaving(false); return; }
    setSaving(false);
    setShowModal(false);
    loadData();
  };

  const handleDelete = async () => {
    const res  = await fetch(`${API}/admin/categories/${deleteId}`, {
      method: "DELETE", headers: authHeader,
    });
    const data = await res.json();
    if (!res.ok) { setApiError(data.message || "Failed to delete."); setDeleteId(null); return; }
    setDeleteId(null);
    loadData();
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" />Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          + Add Category
        </button>
      </div>

      {apiError && <div className="admin-error">{apiError}</div>}

      <div className="admin-categories-grid">
        {categories.map(cat => (
          <div className="admin-category-card" key={cat.id}>
            <img src={cat.imageUrl} alt={cat.name}
              onError={e => e.target.style.display = "none"} />
            <div className="admin-category-info">
              <span>{cat.name}</span>
              <div className="admin-actions">
                <button className="admin-btn admin-btn-sm admin-btn-secondary"
                  onClick={() => openEdit(cat)}>Edit</button>
                <button className="admin-btn admin-btn-sm admin-btn-danger"
                  onClick={() => setDeleteId(cat.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm">
            <div className="admin-modal-header">
              <h3>{editItem ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Name</label>
                <input value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={errors.name ? "input-error" : ""} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="admin-form-group">
                <label>Image {editItem && "(leave empty to keep current)"}</label>
                <input type="file" accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setForm(p => ({ ...p, image: file }));
                    setPreview(URL.createObjectURL(file));
                  }} />
                {errors.image && <span className="field-error">{errors.image}</span>}
                {preview && <img src={preview} alt="preview" className="admin-img-preview" />}
              </div>
              {apiError && <p className="field-error">{apiError}</p>}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary"
                onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary"
                onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm">
            <div className="admin-modal-header">
              <h3>Delete Category</h3>
              <button onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>Are you sure? This will fail if the category has food items.</p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger"
                onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;