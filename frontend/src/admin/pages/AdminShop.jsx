import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';
import { invalidateContent } from '../../hooks/useContent';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ProductEditor from '../components/ProductEditor';

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [waitlist, setWaitlist] = useState([]);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi().get('/admin/products'),
      adminApi().get('/admin/submissions?source=waitlist'),
    ]).then(([p, w]) => {
      setProducts(p.data.products || []);
      setWaitlist(w.data.items || []);
    }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const saveAll = async (list) => {
    await adminApi().put('/admin/products', { products: list });
    invalidateContent('products');
    setProducts(list);
    setEditing(null);
    load();
  };

  const handleSave = async (product) => {
    let list;
    if (editing === 'new') list = [...products, product];
    else list = products.map(p => p.id === product.id ? { ...p, ...product } : p);
    await saveAll(list);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await saveAll(products.filter(p => p.id !== id));
  };

  const toggleComing = async (id, current) => {
    await adminApi().patch(`/admin/products/${id}/stock`, { coming_soon: !current });
    invalidateContent('products');
    load();
  };

  const updateStock = async (id, stock) => {
    await adminApi().patch(`/admin/products/${id}/stock`, { stock: parseInt(stock) || 0 });
    invalidateContent('products');
    load();
  };

  if (loading) return <div className="p-10">Loading…</div>;

  const waitlistByProduct = waitlist.reduce((acc, w) => {
    const pid = w.product_id || 'unknown';
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(w);
    return acc;
  }, {});

  return (
    <div className="p-8 md:p-12" data-testid="admin-shop">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Shop</p>
        <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917]">Manage Products</h1>
        <p className="text-sm text-[#57534E] mt-2">Live catalog on the website. Edit stock, launch, or add new products below.</p>
      </div>

      {/* CURRENT LIVE PRODUCTS */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-3">Current Live Catalog · {products.length} product{products.length === 1 ? '' : 's'}</p>
      <div className="space-y-3 mb-10">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-[#E7E5E4] p-4 md:p-6 flex flex-col md:flex-row gap-4" data-testid={`product-${p.id}`}>
            {p.image && <img src={p.image} alt={p.title} className="w-full md:w-32 h-28 object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{p.title || p.name || 'Untitled'}</h3>
                {p.coming_soon ? (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-amber-100 text-amber-800">Coming Soon</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-green-100 text-green-800">Live</span>
                )}
              </div>
              <p className="text-sm text-[#57534E]">{p.price ? (typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : p.price) : '—'}</p>
              <p className="text-xs text-[#57534E] mt-1 break-all">ID: <code className="bg-[#F5F5F4] px-1.5">{p.id}</code></p>
              <p className="text-xs text-[#57534E] mt-2">Waitlist: {(waitlistByProduct[p.id] || []).length}</p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <label className="text-xs uppercase tracking-wider text-[#57534E]">Stock:</label>
                <input
                  type="number"
                  defaultValue={p.stock ?? 0}
                  onBlur={(e) => updateStock(p.id, e.target.value)}
                  className="w-20 border border-[#E7E5E4] px-2 py-1 text-sm"
                  data-testid={`stock-${p.id}`}
                />
                <span className="text-xs text-[#57534E]">/ {p.total_stock || 0}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <button onClick={() => toggleComing(p.id, p.coming_soon)} className={`px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${p.coming_soon ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`} data-testid={`toggle-${p.id}`}>
                {p.coming_soon ? 'Launch Now' : 'Hide'}
              </button>
              <button onClick={() => setEditing(p)} className="px-3 py-2 text-xs uppercase tracking-[0.2em] border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] flex items-center gap-1" data-testid={`edit-${p.id}`}>
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="px-3 py-2 text-xs uppercase tracking-[0.2em] border border-red-300 text-red-700 hover:bg-red-50">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-[#57534E]">No products yet — click Add New Product below.</p>}
      </div>

      {/* ADD NEW PRODUCT */}
      <div className="border-2 border-dashed border-[#D6C0A6] bg-[#FBFBF9] p-6 md:p-8 mb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Catalog</p>
        <h2 className="font-['Playfair_Display'] text-xl text-[#1C1917] mb-3">Add a New Product</h2>
        <p className="text-sm text-[#57534E] mb-5 max-w-md mx-auto">Open the product editor to add a new item to the catalog with images, specs, and pricing.</p>
        <button
          onClick={() => setEditing('new')}
          className="bg-[#1C1917] text-[#FBFBF9] px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors inline-flex items-center gap-2"
          data-testid="add-product-btn"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-4">Waitlist Subscribers</h2>
      {waitlist.length === 0 ? <p className="text-[#57534E]">No subscribers yet.</p> : (
        <div className="bg-white border border-[#E7E5E4] max-h-96 overflow-y-auto">
          {waitlist.map((w, i) => (
            <div key={i} className="p-3 border-b border-[#E7E5E4] last:border-0 grid grid-cols-3 gap-3 text-sm">
              <span className="truncate">{w.email}</span>
              <span className="text-[#57534E]">{w.product_id}</span>
              <span className="text-[#57534E]">{new Date(w.subscribed_at || '').toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor product={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
