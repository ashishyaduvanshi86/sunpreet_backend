import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const EMPTY = {
  id: '', status: 'live', level: '', name: '', tagline: '', shortDesc: '',
  duration: '', sessions: '', setting: '', primaryFocus: [],
  image: '', programLink: '', price: '',
  bullets: [],
  faq: [],
};

const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function ProgramEditor({ program, onSave, onClose }) {
  const [p, setP] = useState(program ? { ...EMPTY, ...program } : EMPTY);
  const [tab, setTab] = useState('card');
  const [saving, setSaving] = useState(false);
  const isNew = !program;

  const upd = (k, v) => setP(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalP = { ...p, id: p.id || slugify(p.level || p.name) || `program-${Date.now()}` };
      await onSave(finalP);
    } finally { setSaving(false); }
  };

  const tabs = [
    { key: 'card', label: 'Program Details' },
    { key: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()} data-testid="program-editor">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4]">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">{isNew ? 'New Program' : `Edit · ${p.level || p.name}`}</h2>
          <button onClick={onClose} className="text-[#57534E] hover:text-[#1C1917]"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-0 px-6 border-b border-[#E7E5E4] bg-[#FBFBF9]">
          {tabs.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-6 py-4 text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? 'border-[#1C1917] text-[#1C1917] bg-white'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
              data-testid={`prog-tab-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'card' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Level" value={p.level} onChange={v => upd('level', v)} placeholder="Beginner / Intermediate" required />
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Status</label>
                  <select value={p.status || 'live'} onChange={e => upd('status', e.target.value)} className="w-full bg-transparent border-b border-[#1C1917]/30 py-2 outline-none">
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="archived">Past Program</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <Field label="Full Name" value={p.name} onChange={v => upd('name', v)} placeholder="Strong & Mobile — Beginner" />
              <Field label="Tagline" value={p.tagline} onChange={v => upd('tagline', v)} />
              <TextArea label="Short Description" value={p.shortDesc} onChange={v => upd('shortDesc', v)} rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Duration" value={p.duration} onChange={v => upd('duration', v)} placeholder="4 Weeks" />
                <Field label="Price" value={p.price} onChange={v => upd('price', v)} placeholder="₹2999" />
              </div>
              <Field label="Sessions" value={p.sessions} onChange={v => upd('sessions', v)} placeholder="4x per week · 40–60 mins" />
              <Field label="Setting / Strength Base" value={p.setting} onChange={v => upd('setting', v)} placeholder="Build foundational strength & body control" />
              <StringList label="Primary Focus Tags" items={p.primaryFocus} onChange={v => upd('primaryFocus', v)} placeholder="e.g. Pull-ups" />
              <Field label="Image URL" value={p.image} onChange={v => upd('image', v)} />
              {p.image && <img src={p.image} alt="" className="max-h-32 border border-[#E7E5E4]" />}
              <Field label="Spur.fit Program Link" value={p.programLink} onChange={v => upd('programLink', v)} />
              <StringList label="Card Bullet Points (What's Included)" items={p.bullets} onChange={v => upd('bullets', v)} />
            </>
          )}

          {tab === 'faq' && (
            <FAQEditor items={p.faq} onChange={v => upd('faq', v)} />
          )}
        </form>

        <div className="border-t border-[#E7E5E4] p-6 flex gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs uppercase tracking-[0.2em] border border-[#1C1917]">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#1C1917] text-[#FBFBF9] py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60" data-testid="program-save-btn">
            {saving ? 'Saving…' : 'Save Program'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}{required && ' *'}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} className="w-full border border-[#E7E5E4] focus:border-[#1C1917] p-3 outline-none text-sm" />
    </div>
  );
}

function StringList({ label, items, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <div className="space-y-2">
        {(items || []).map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={item} onChange={e => { const next = [...items]; next[idx] = e.target.value; onChange(next); }} className="flex-1 bg-transparent border-b border-[#1C1917]/30 py-2 outline-none text-sm" placeholder={placeholder} />
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), ''])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
      </div>
    </div>
  );
}

function FAQEditor({ items, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Frequently Asked Questions</label>
      <div className="space-y-3">
        {(items || []).map((item, idx) => (
          <div key={idx} className="border border-[#E7E5E4] p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[#57534E]">Q{idx + 1}</span>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
            </div>
            <input value={item.q || ''} onChange={e => { const next = [...items]; next[idx] = { ...item, q: e.target.value }; onChange(next); }} placeholder="Question" className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm" />
            <textarea value={item.a || ''} onChange={e => { const next = [...items]; next[idx] = { ...item, a: e.target.value }; onChange(next); }} placeholder="Answer" rows={4} className="w-full border border-[#E7E5E4] p-2 outline-none text-sm" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), { q: '', a: '' }])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"><Plus className="w-3 h-3" /> Add FAQ</button>
      </div>
    </div>
  );
}
