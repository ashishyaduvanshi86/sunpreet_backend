import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const EMPTY = { id: '', title: '', name: '', tagline: '', price: '', currency: 'INR', image: '', images: [], description: '', features: [], specs: {}, total_stock: 20 };
const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function ProductEditor({ product, onSave, onClose }) {
  const [p, setP] = useState(product ? { ...EMPTY, ...product } : EMPTY);
  const [saving, setSaving] = useState(false);
  const isNew = !product;

  const upd = (k, v) => setP(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalP = { ...p, id: p.id || slugify(p.title || p.name) || `product-${Date.now()}`, name: p.name || p.title };
      await onSave(finalP);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()} data-testid="product-editor">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4]">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">{isNew ? 'New Product' : `Edit · ${p.title || p.name}`}</h2>
          <button onClick={onClose} className="text-[#57534E] hover:text-[#1C1917]"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <Field label="Title" value={p.title} onChange={v => upd('title', v)} required testid="title" />
          <Field label="Tagline" value={p.tagline} onChange={v => upd('tagline', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" value={p.price} onChange={v => upd('price', v)} placeholder="₹6,499" />
            <Field label="Total Stock" type="number" value={p.total_stock} onChange={v => upd('total_stock', parseInt(v) || 0)} />
          </div>
          <Field label="Main Image URL" value={p.image} onChange={v => upd('image', v)} />
          {p.image && <img src={p.image} alt="" className="max-h-32 border border-[#E7E5E4]" />}
          <StringList label="Gallery Images" items={p.images || []} onChange={v => upd('images', v)} />
          <TextArea label="Description" value={p.description} onChange={v => upd('description', v)} rows={4} />
          <StringList label="Features" items={p.features || []} onChange={v => upd('features', v)} />
        </form>

        <div className="border-t border-[#E7E5E4] p-6 flex gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs uppercase tracking-[0.2em] border border-[#1C1917]">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#1C1917] text-[#FBFBF9] py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60" data-testid="product-save-btn">
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required, testid }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}{required && ' *'}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none"
        data-testid={`product-field-${testid || label}`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows}
        className="w-full border border-[#E7E5E4] focus:border-[#1C1917] p-3 outline-none text-sm" />
    </div>
  );
}

function StringList({ label, items, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <div className="space-y-2">
        {(items || []).map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={item} onChange={e => { const next = [...items]; next[idx] = e.target.value; onChange(next); }} className="flex-1 bg-transparent border-b border-[#1C1917]/30 py-2 outline-none text-sm" />
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), ''])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
      </div>
    </div>
  );
}
