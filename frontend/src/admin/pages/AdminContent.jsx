import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';
import { invalidateContent } from '../../hooks/useContent';
import { Plus, Minus } from 'lucide-react';

const KEYS = ['home', 'about', 'coaching', 'testimonials'];

export default function AdminContent() {
  const [active, setActive] = useState('home');
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(KEYS.map(k => adminApi().get(`/content/${k}`).then(r => [k, r.data?.data]))).then(results => {
      const map = {};
      for (const [k, v] of results) map[k] = v || {};
      setDocs(map);
    }).finally(() => setLoading(false));
  }, []);

  const upd = (key, data) => setDocs(d => ({ ...d, [key]: data }));

  const save = async () => {
    setSaving(true);
    try {
      await adminApi().put(`/admin/content/${active}`, { data: docs[active] });
      invalidateContent(active);
      alert('Saved');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-10">Loading…</div>;

  return (
    <div className="p-8 md:p-12 max-w-4xl" data-testid="admin-content">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Site Content</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-6">Page Content</h1>

      <div className="flex gap-1 border-b border-[#E7E5E4] mb-8 overflow-x-auto">
        {KEYS.map(k => (
          <button key={k} onClick={() => setActive(k)}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] capitalize ${active === k ? 'border-b-2 border-[#1C1917] text-[#1C1917]' : 'text-[#57534E] hover:text-[#1C1917]'}`}
            data-testid={`content-tab-${k}`}>
            {k === 'testimonials' ? 'Testimonials' : k}
          </button>
        ))}
      </div>

      {active === 'home' && <HomeEditor data={docs.home || {}} onChange={d => upd('home', d)} />}
      {active === 'about' && <AboutEditor data={docs.about || {}} onChange={d => upd('about', d)} />}
      {active === 'coaching' && <CoachingEditor data={docs.coaching || {}} onChange={d => upd('coaching', d)} />}
      {active === 'testimonials' && <TestimonialsEditor data={docs.testimonials || {}} onChange={d => upd('testimonials', d)} />}

      <button onClick={save} disabled={saving} className="mt-6 bg-[#1C1917] text-[#FBFBF9] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60" data-testid={`save-${active}`}>
        {saving ? 'Saving…' : `Save ${active}`}
      </button>
    </div>
  );
}

function HomeEditor({ data, onChange }) {
  const u = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
      <Field label="Hero Headline" value={data.hero_headline} onChange={v => u('hero_headline', v)} />
      <Field label="Hero Sub-headline" value={data.hero_sub} onChange={v => u('hero_sub', v)} />
      <Field label="Hero Background Image URL" value={data.hero_image} onChange={v => u('hero_image', v)} />
      <Field label="Learning Library Video URL" value={data.video_url} onChange={v => u('video_url', v)} />
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const u = (k, v) => onChange({ ...data, [k]: v });
  const updPhilosophy = (k, v) => u('philosophy', { ...(data.philosophy || {}), [k]: v });
  return (
    <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
      <Field label="Hero Title" value={data.hero_title} onChange={v => u('hero_title', v)} />
      <StringList label="Gallery Images (3 URLs)" items={data.gallery || []} onChange={v => u('gallery', v)} />
      <Field label="Years Counter (e.g. 9+)" value={data.years} onChange={v => u('years', v)} />

      <div className="border-t border-[#E7E5E4] pt-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-3">Story Section (Bio Paragraphs)</p>
        <StringList
          label="Bio Paragraphs (one per item)"
          items={data.bio_paragraphs || []}
          onChange={v => u('bio_paragraphs', v)}
          placeholder="Each item becomes a paragraph on the About page"
        />
        <Field label="Story Closing Italic Quote" value={data.bio_closing} onChange={v => u('bio_closing', v)} placeholder="I will walk alongside you…" />
      </div>

      <div className="border-t border-[#E7E5E4] pt-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-3">Philosophy Section</p>
        <Field label="Philosophy Eyebrow" value={data.philosophy?.eyebrow} onChange={v => updPhilosophy('eyebrow', v)} placeholder="Philosophy" />
        <Field label="Philosophy Headline" value={data.philosophy?.headline} onChange={v => updPhilosophy('headline', v)} placeholder="A journey of movement…" />
        <Field label="Philosophy Image URL" value={data.philosophy?.image} onChange={v => updPhilosophy('image', v)} />
        <StringList
          label="Philosophy Paragraphs"
          items={data.philosophy?.paragraphs || []}
          onChange={v => updPhilosophy('paragraphs', v)}
        />
      </div>
    </div>
  );
}

function CoachingEditor({ data, onChange }) {
  const u = (k, v) => onChange({ ...data, [k]: v });
  const updateTier = (idx, key, val) => {
    const next = [...(data.tiers || [])];
    next[idx] = { ...next[idx], [key]: val };
    u('tiers', next);
  };
  return (
    <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
      <Field label="Hero Headline" value={data.hero_headline} onChange={v => u('hero_headline', v)} />
      <TextArea label="Intro Paragraph" value={data.intro} onChange={v => u('intro', v)} rows={4} />
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Pricing Tiers</label>
        <div className="space-y-3">
          {(data.tiers || []).map((tier, idx) => (
            <div key={idx} className="border border-[#E7E5E4] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs uppercase text-[#57534E]">Tier {idx + 1}</span>
                <button type="button" onClick={() => u('tiers', (data.tiers || []).filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
              </div>
              <input value={tier.name || ''} onChange={e => updateTier(idx, 'name', e.target.value)} placeholder="Tier name" className="w-full border-b border-[#E7E5E4] py-1 text-sm outline-none" />
              <input value={tier.price || ''} onChange={e => updateTier(idx, 'price', e.target.value)} placeholder="Price" className="w-full border-b border-[#E7E5E4] py-1 text-sm outline-none" />
              <input value={tier.duration || ''} onChange={e => updateTier(idx, 'duration', e.target.value)} placeholder="Duration" className="w-full border-b border-[#E7E5E4] py-1 text-sm outline-none" />
              <textarea value={tier.description || ''} onChange={e => updateTier(idx, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full border border-[#E7E5E4] p-2 text-sm outline-none" />
              <textarea value={(tier.features || []).join('\n')} onChange={e => updateTier(idx, 'features', e.target.value.split('\n').filter(Boolean))} placeholder="Features (one per line)" rows={4} className="w-full border border-[#E7E5E4] p-2 text-sm outline-none" />
            </div>
          ))}
          <button type="button" onClick={() => u('tiers', [...(data.tiers || []), { name: '', price: '', duration: '', description: '', features: [] }])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"><Plus className="w-3 h-3" /> Add Tier</button>
        </div>
      </div>
      <StringList label="What's Included" items={data.included || []} onChange={v => u('included', v)} />
    </div>
  );
}

function TestimonialsEditor({ data, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
      <p className="text-sm text-[#57534E]">Each section below corresponds to a testimonial type on the public site.</p>
      <StringList
        label="Quotes (text testimonials — one per line)"
        items={data.quotes || []}
        onChange={v => update('quotes', v)}
        placeholder="It changed my life — Hamsa"
      />
      <StringList
        label="Feedback Screenshot URLs (Coaching page masonry)"
        items={data.feedback_screenshots || []}
        onChange={v => update('feedback_screenshots', v)}
      />
      <StringList
        label="Video Testimonial URLs (Home page)"
        items={data.video_testimonials || []}
        onChange={v => update('video_testimonials', v)}
      />
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none" />
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
            <input value={item} onChange={e => { const next = [...items]; next[idx] = e.target.value; onChange(next); }} placeholder={placeholder} className="flex-1 bg-transparent border-b border-[#1C1917]/30 py-2 outline-none text-sm" />
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), ''])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
      </div>
    </div>
  );
}
