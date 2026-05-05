import React, { useMemo, useState } from 'react';

/**
 * WEB-03 Product Management
 * Create, edit, and delete rice product listings with variety specifications,
 * pricing, quantities, descriptions, and multiple images. Includes inventory
 * tracking with low-stock alerts and active/inactive status toggle.
 */

const RICE_VARIETIES = [
  'Jasmine Rice',
  'Brown Rice',
  'Sinandomeng',
  'Dinorado',
  'Milagrosa',
  'Black Rice',
  'Red Rice',
  'Glutinous Rice',
];

const LOW_STOCK_THRESHOLD = 20; // kg

const SAMPLE_PRODUCTS = [
  {
    id: 1, name: 'Premium Jasmine Rice', variety: 'Jasmine Rice',
    price: 65, stock: 120, unit: 'kg', status: 'Active',
    description: 'Aromatic long-grain jasmine rice harvested in Nueva Ecija.',
    images: ['🌾', '🍚'],
  },
  {
    id: 2, name: 'Organic Brown Rice', variety: 'Brown Rice',
    price: 80, stock: 12, unit: 'kg', status: 'Active',
    description: 'Whole-grain brown rice rich in fiber. Pesticide-free.',
    images: ['🌾'],
  },
  {
    id: 3, name: 'Sinandomeng Special', variety: 'Sinandomeng',
    price: 55, stock: 250, unit: 'kg', status: 'Active',
    description: 'Soft, fragrant table rice — a household favorite.',
    images: ['🍚', '🌾', '🥡'],
  },
  {
    id: 4, name: 'Heirloom Black Rice', variety: 'Black Rice',
    price: 140, stock: 0, unit: 'kg', status: 'Out of Stock',
    description: 'Antioxidant-rich pirurutong, sourced from Cordillera farmers.',
    images: ['🌾'],
  },
];

const EMPTY_PRODUCT = {
  name: '', variety: '', price: '', stock: '',
  unit: 'kg', status: 'Active', description: '',
  images: [],
};

export default function ProductListTab() {
  const [products, setProducts]         = useState(SAMPLE_PRODUCTS);
  const [prodForm, setProdForm]         = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId]       = useState(null);
  const [showProdForm, setShowProdForm] = useState(false);

  // Filters
  const [search, setSearch]             = useState('');
  const [filterVariety, setFilterVariety] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const lowStockCount = useMemo(
    () => products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (filterVariety !== 'All' && p.variety !== filterVariety) return false;
      if (filterStatus !== 'All' && p.status !== filterStatus) return false;
      if (search && !`${p.name} ${p.variety}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search, filterVariety, filterStatus]);

  const handleProdSubmit = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    const payload = {
      ...prodForm,
      price: prodForm.price === '' ? 0 : parseFloat(prodForm.price),
      stock: prodForm.stock === '' ? 0 : parseInt(prodForm.stock, 10),
    };

    if (editingId !== null) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...payload, id: editingId } : p));
      setEditingId(null);
    } else {
      setProducts(prev => [...prev, { ...payload, id: Date.now() }]);
    }
    setProdForm(EMPTY_PRODUCT);
    setShowProdForm(false);
  };

  const handleProdEdit = (prod) => {
    setProdForm({
      name: prod.name, variety: prod.variety,
      price: prod.price, stock: prod.stock, unit: prod.unit || 'kg',
      status: prod.status, description: prod.description || '',
      images: prod.images || [],
    });
    setEditingId(prod.id);
    setShowProdForm(true);
  };

  const handleProdDelete = (id) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
    ));
  };

  const cancelProdForm = () => {
    setProdForm(EMPTY_PRODUCT);
    setEditingId(null);
    setShowProdForm(false);
  };

  // Mock image picker — adds a placeholder "image" to the form
  const addPlaceholderImage = () => {
    const PLACEHOLDERS = ['🌾', '🍚', '🥡', '🌱', '🥗'];
    const next = PLACEHOLDERS[prodForm.images.length % PLACEHOLDERS.length];
    setProdForm(p => ({ ...p, images: [...p.images, next] }));
  };

  const removeImage = (idx) => {
    setProdForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { cls: 'ap-stock-out', label: 'Out of stock' };
    if (stock <= LOW_STOCK_THRESHOLD) return { cls: 'ap-stock-low', label: 'Low stock' };
    return { cls: 'ap-stock-ok', label: 'In stock' };
  };

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <div>
          <h2>Product List</h2>
          {lowStockCount > 0 && (
            <p className="ap-lowstock-banner">
              ⚠️ {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock.
            </p>
          )}
        </div>
        {!showProdForm && (
          <button className="ap-btn-primary" onClick={() => setShowProdForm(true)}>
            + Add Product
          </button>
        )}
      </div>

      {/* Filter bar */}
      {!showProdForm && (
        <div className="ap-filter-bar">
          <input
            type="text"
            className="ap-filter-input"
            placeholder="🔍 Search by name or variety…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="ap-filter-select"
            value={filterVariety}
            onChange={e => setFilterVariety(e.target.value)}
          >
            <option>All</option>
            {RICE_VARIETIES.map(v => <option key={v}>{v}</option>)}
          </select>
          <select
            className="ap-filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Out of Stock</option>
          </select>
        </div>
      )}

      {showProdForm && (
        <div className="ap-panel ap-form-panel">
          <h3>{editingId !== null ? 'Edit Product' : 'New Product'}</h3>
          <form className="ap-prod-form" onSubmit={handleProdSubmit}>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Jasmine Rice"
                  value={prodForm.name}
                  onChange={e => setProdForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="ap-form-field">
                <label>Rice Variety</label>
                <select
                  value={prodForm.variety}
                  onChange={e => setProdForm(p => ({ ...p, variety: e.target.value }))}
                >
                  <option value="">— Select variety —</option>
                  {RICE_VARIETIES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Price (₱ per {prodForm.unit})</label>
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
                <label>Unit</label>
                <select
                  value={prodForm.unit}
                  onChange={e => setProdForm(p => ({ ...p, unit: e.target.value }))}
                >
                  <option>kg</option>
                  <option>sack</option>
                  <option>cavan</option>
                </select>
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

            <div className="ap-form-field">
              <label>Description</label>
              <textarea
                rows="3"
                placeholder="Tell buyers about origin, taste, certifications…"
                value={prodForm.description}
                onChange={e => setProdForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="ap-form-field">
              <label>Product Images ({prodForm.images.length}/5)</label>
              <div className="ap-image-grid">
                {prodForm.images.map((img, i) => (
                  <div className="ap-image-tile" key={i}>
                    <span className="ap-image-emoji">{img}</span>
                    <button
                      type="button"
                      className="ap-image-remove"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                    >×</button>
                  </div>
                ))}
                {prodForm.images.length < 5 && (
                  <button
                    type="button"
                    className="ap-image-add"
                    onClick={addPlaceholderImage}
                  >
                    <span>+</span>
                    <small>Add image</small>
                  </button>
                )}
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
        {filtered.length === 0 ? (
          <p className="ap-empty-state">
            {products.length === 0
              ? <>No products yet. Click <strong>+ Add Product</strong> to get started.</>
              : 'No products match your filters.'}
          </p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Variety</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const badge = getStockBadge(p.stock);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="ap-thumb">{(p.images && p.images[0]) || '🌾'}</div>
                      </td>
                      <td className="ap-td-name">
                        {p.name}
                        {p.description && <div className="ap-td-sub">{p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}</div>}
                      </td>
                      <td>{p.variety || '—'}</td>
                      <td>{p.price ? `₱${parseFloat(p.price).toLocaleString()} / ${p.unit || 'kg'}` : '—'}</td>
                      <td>
                        <div className="ap-stock-cell">
                          <span className={`ap-stock-pill ${badge.cls}`}>{badge.label}</span>
                          <span className="ap-stock-num">{p.stock} {p.unit || 'kg'}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`ap-badge ap-badge-${p.status.toLowerCase().replace(/ /g, '-')} ap-badge-toggle`}
                          onClick={() => toggleStatus(p.id)}
                          title="Click to toggle"
                          type="button"
                        >
                          {p.status}
                        </button>
                      </td>
                      <td>
                        <div className="ap-row-actions">
                          <button className="ap-icon-btn edit" onClick={() => handleProdEdit(p)} title="Edit">✏️</button>
                          <button className="ap-icon-btn delete" onClick={() => handleProdDelete(p.id)} title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
