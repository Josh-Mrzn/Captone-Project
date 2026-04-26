import React, { useState } from 'react';

const EMPTY_PRODUCT = { name: '', category: '', price: '', stock: '', status: 'Active' };

export default function ProductListTab() {
  const [products, setProducts]         = useState([]);
  const [prodForm, setProdForm]         = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId]       = useState(null);
  const [showProdForm, setShowProdForm] = useState(false);

  const handleProdSubmit = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;
    if (editingId !== null) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...prodForm, id: editingId } : p));
      setEditingId(null);
    } else {
      setProducts(prev => [...prev, { ...prodForm, id: Date.now() }]);
    }
    setProdForm(EMPTY_PRODUCT);
    setShowProdForm(false);
  };

  const handleProdEdit = (prod) => {
    setProdForm({ name: prod.name, category: prod.category, price: prod.price, stock: prod.stock, status: prod.status });
    setEditingId(prod.id);
    setShowProdForm(true);
  };

  const handleProdDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const cancelProdForm = () => {
    setProdForm(EMPTY_PRODUCT);
    setEditingId(null);
    setShowProdForm(false);
  };

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <h2>Product List</h2>
        {!showProdForm && (
          <button className="ap-btn-primary" onClick={() => setShowProdForm(true)}>+ Add Product</button>
        )}
      </div>

      {showProdForm && (
        <div className="ap-panel ap-form-panel">
          <h3>{editingId !== null ? 'Edit Product' : 'New Product'}</h3>
          <form className="ap-prod-form" onSubmit={handleProdSubmit}>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Rice"
                  value={prodForm.name}
                  onChange={e => setProdForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="ap-form-field">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Grains"
                  value={prodForm.category}
                  onChange={e => setProdForm(p => ({ ...p, category: e.target.value }))}
                />
              </div>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Price (₱)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={prodForm.price}
                  onChange={e => setProdForm(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="ap-form-field">
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={prodForm.stock}
                  onChange={e => setProdForm(p => ({ ...p, stock: e.target.value }))}
                />
              </div>
              <div className="ap-form-field">
                <label>Status</label>
                <select
                  value={prodForm.status}
                  onChange={e => setProdForm(p => ({ ...p, status: e.target.value }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="ap-form-actions">
              <button type="button" className="ap-btn-ghost" onClick={cancelProdForm}>Cancel</button>
              <button type="submit" className="ap-btn-primary">
                {editingId !== null ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="ap-panel">
        {products.length === 0 ? (
          <p className="ap-empty-state">No products yet. Click <strong>+ Add Product</strong> to get started.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Category</th>
                  <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td className="ap-td-name">{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td>{p.price ? `₱${parseFloat(p.price).toLocaleString()}` : '—'}</td>
                    <td>{p.stock || '—'}</td>
                    <td>
                      <span className={`ap-badge ap-badge-${p.status.toLowerCase().replace(/ /g, '-')}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="ap-row-actions">
                        <button className="ap-icon-btn edit" onClick={() => handleProdEdit(p)} title="Edit">✏️</button>
                        <button className="ap-icon-btn delete" onClick={() => handleProdDelete(p.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
