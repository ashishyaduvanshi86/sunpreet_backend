import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const EMPTY_RETREAT = {
  id: '', status: 'draft', title: '', tagline: '', location: '', date: '', duration: '',
  icon: 'waves', heroImage: '', description: '', longDescription: '',
  atAGlance: [], yourStay: { title: 'Your Stay', text: [], image: '' },
  rooms: [], inclusions: [], exclusions: [], itinerary: [], gallery: [],
  pricing: { twinSharing: { price: '', note: '' }, singleOccupancy: { price: '', note: '' }, balanceDue: '' },
  attendeeCount: null,
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function RetreatEditor({ retreat, onSave, onClose }) {
  const [r, setR] = useState(retreat ? { ...EMPTY_RETREAT, ...retreat } : EMPTY_RETREAT);
  const [tab, setTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const isNew = !retreat;

  const update = (key, val) => setR(prev => ({ ...prev, [key]: val }));
  const updateNested = (path, val) => {
    setR(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] = { ...cur[keys[i]] };
      cur[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!r.id) update('id', slugify(r.title) + '-' + new Date().getFullYear());
    setSaving(true);
    try {
      const finalRetreat = { ...r, id: r.id || slugify(r.title) + '-' + new Date().getFullYear() };
      await onSave(finalRetreat);
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const tabs = ['basic', 'content', 'glance', 'rooms', 'pricing', 'gallery', 'itinerary'];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()} data-testid="retreat-editor">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4] flex-shrink-0">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">{isNew ? 'New Retreat' : `Edit · ${r.title}`}</h2>
          <button onClick={onClose} className="text-[#57534E] hover:text-[#1C1917]"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-1 px-6 pt-4 border-b border-[#E7E5E4] flex-shrink-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors capitalize ${
                tab === t ? 'border-b-2 border-[#1C1917] text-[#1C1917]' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
              data-testid={`editor-tab-${t}`}
            >{t}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'basic' && (
            <>
              <Field label="Title" value={r.title} onChange={v => update('title', v)} required testid="title" />
              <Field label="Tagline" value={r.tagline} onChange={v => update('tagline', v)} testid="tagline" />
              <Field label="Location" value={r.location} onChange={v => update('location', v)} testid="location" />
              <Field label="Date" value={r.date} onChange={v => update('date', v)} placeholder="e.g. 1st – 6th September 2026" testid="date" />
              <Field label="Duration" value={r.duration} onChange={v => update('duration', v)} placeholder="e.g. 6 Days / 5 Nights" testid="duration" />
              <Field label="Hero Image URL" value={r.heroImage} onChange={v => update('heroImage', v)} testid="heroImage" />
              {r.heroImage && <img src={r.heroImage} alt="Hero preview" className="max-h-48 object-cover border border-[#E7E5E4]" />}
              <SelectField label="Status" value={r.status} onChange={v => update('status', v)} options={[
                { value: 'live', label: 'Live (Booking Open)' },
                { value: 'coming_soon', label: 'Coming Soon' },
                { value: 'sold_out', label: 'Sold Out' },
                { value: 'past', label: 'Past Experience' },
                { value: 'draft', label: 'Draft (Hidden)' },
              ]} />
              {r.status === 'past' && (
                <Field label="Attendees" value={r.attendeeCount || ''} onChange={v => update('attendeeCount', parseInt(v) || null)} placeholder="e.g. 12" type="number" testid="attendeeCount" />
              )}
            </>
          )}

          {tab === 'content' && (
            <>
              <TextArea label="Short Description" value={r.description} onChange={v => update('description', v)} rows={3} />
              <TextArea label="Long Description ('What Awaits You' section)" value={r.longDescription} onChange={v => update('longDescription', v)} rows={6} />
              <Field label="Your Stay — Image URL" value={r.yourStay?.image || ''} onChange={v => updateNested('yourStay.image', v)} />
              {r.yourStay?.image && <img src={r.yourStay.image} alt="Your Stay preview" className="max-h-32 object-cover border border-[#E7E5E4]" />}
              <StringList label="Your Stay — Paragraphs" items={r.yourStay?.text || []} onChange={v => updateNested('yourStay.text', v)} />
              <StringList label="Inclusions" items={r.inclusions || []} onChange={v => update('inclusions', v)} />
              <StringList label="Exclusions" items={r.exclusions || []} onChange={v => update('exclusions', v)} />
            </>
          )}

          {tab === 'glance' && (
            <AtAGlanceEditor items={r.atAGlance || []} onChange={v => update('atAGlance', v)} />
          )}

          {tab === 'rooms' && (
            <RoomsEditor items={r.rooms || []} onChange={v => update('rooms', v)} />
          )}

          {tab === 'pricing' && (
            <>
              <h3 className="font-['Playfair_Display'] text-lg text-[#1C1917]">Twin Sharing</h3>
              <Field label="Price" value={r.pricing?.twinSharing?.price || ''} onChange={v => updateNested('pricing.twinSharing', { ...r.pricing?.twinSharing, price: v })} />
              <Field label="Note" value={r.pricing?.twinSharing?.note || ''} onChange={v => updateNested('pricing.twinSharing', { ...r.pricing?.twinSharing, note: v })} />
              <h3 className="font-['Playfair_Display'] text-lg text-[#1C1917] mt-4">Single Occupancy</h3>
              <Field label="Price" value={r.pricing?.singleOccupancy?.price || ''} onChange={v => updateNested('pricing.singleOccupancy', { ...r.pricing?.singleOccupancy, price: v })} />
              <Field label="Note" value={r.pricing?.singleOccupancy?.note || ''} onChange={v => updateNested('pricing.singleOccupancy', { ...r.pricing?.singleOccupancy, note: v })} />
              <Field label="Balance Due Terms" value={r.pricing?.balanceDue || ''} onChange={v => updateNested('pricing.balanceDue', v)} />
            </>
          )}

          {tab === 'gallery' && (
            <StringList label="Gallery Image URLs" items={r.gallery || []} onChange={v => update('gallery', v)} placeholder="Paste image URL" />
          )}

          {tab === 'itinerary' && (
            <ItineraryEditor items={r.itinerary || []} onChange={v => update('itinerary', v)} />
          )}
        </form>

        <div className="border-t border-[#E7E5E4] p-6 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs uppercase tracking-[0.2em] border border-[#1C1917]">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#1C1917] text-[#FBFBF9] py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60" data-testid="retreat-save-btn">
            {saving ? 'Saving…' : 'Save Retreat'}
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
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none"
        data-testid={`field-${testid || label}`}
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

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
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
            <input
              value={item}
              onChange={e => {
                const next = [...items]; next[idx] = e.target.value; onChange(next);
              }}
              className="flex-1 bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none text-sm"
              placeholder={placeholder}
            />
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600 hover:text-red-800">
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), ''])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#D6C0A6] flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
}

function ItineraryEditor({ items, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Itinerary</label>
      <div className="space-y-3">
        {(items || []).map((item, idx) => (
          <div key={idx} className="border border-[#E7E5E4] p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[#57534E]">Day {idx + 1}</span>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
            </div>
            <input value={item.day || ''} onChange={e => { const next = [...items]; next[idx] = { ...item, day: e.target.value }; onChange(next); }} placeholder="Day label" className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm" />
            <input value={item.title || ''} onChange={e => { const next = [...items]; next[idx] = { ...item, title: e.target.value }; onChange(next); }} placeholder="Title" className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm" />
            <textarea value={item.details || ''} onChange={e => { const next = [...items]; next[idx] = { ...item, details: e.target.value }; onChange(next); }} placeholder="Details" rows={2} className="w-full border border-[#E7E5E4] p-2 outline-none text-sm" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), { day: '', title: '', details: '' }])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Day
        </button>
      </div>
    </div>
  );
}

const GLANCE_ICONS = ['calendar', 'utensils', 'activity', 'map', 'heart', 'users', 'plane', 'star', 'dumbbell'];

function AtAGlanceEditor({ items, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">At a Glance Cards</label>
      <p className="text-xs text-[#57534E] mb-3">8 cards typically render in a 4-column grid. Each card has an icon, title, and short description.</p>
      <div className="space-y-3">
        {(items || []).map((item, idx) => (
          <div key={idx} className="border border-[#E7E5E4] p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[#57534E]">Card #{idx + 1}</span>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={item.icon || 'star'}
                onChange={e => { const next = [...items]; next[idx] = { ...item, icon: e.target.value }; onChange(next); }}
                className="bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
              >
                {GLANCE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input
                value={item.title || ''}
                onChange={e => { const next = [...items]; next[idx] = { ...item, title: e.target.value }; onChange(next); }}
                placeholder="Title (e.g. 6 Days / 5 Nights)"
                className="col-span-2 bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
              />
            </div>
            <input
              value={item.desc || ''}
              onChange={e => { const next = [...items]; next[idx] = { ...item, desc: e.target.value }; onChange(next); }}
              placeholder="Description (e.g. Immersive stay in Bali)"
              className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
            />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(items || []), { icon: 'star', title: '', desc: '' }])} className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Card
        </button>
      </div>
    </div>
  );
}

function RoomsEditor({ items, onChange }) {
  const upd = (idx, patch) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Rooms / Accommodation</label>
      <p className="text-xs text-[#57534E] mb-3">Each room has a photo, name, description, and amenities list.</p>
      <div className="space-y-4">
        {(items || []).map((room, idx) => (
          <div key={idx} className="border border-[#E7E5E4] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[#57534E]">Room #{idx + 1}</span>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-600"><Minus className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#57534E] mb-1">Photo URL</label>
              <input
                value={room.image || ''}
                onChange={e => upd(idx, { image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
              />
              {room.image && <img src={room.image} alt="Room preview" className="mt-2 max-h-32 object-cover border border-[#E7E5E4]" />}
            </div>
            <input
              value={room.title || ''}
              onChange={e => upd(idx, { title: e.target.value })}
              placeholder="Room name (e.g. Garden Suite)"
              className="w-full bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
            />
            <textarea
              value={room.description || ''}
              onChange={e => upd(idx, { description: e.target.value })}
              placeholder="Room description"
              rows={2}
              className="w-full border border-[#E7E5E4] p-2 outline-none text-sm"
            />
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#57534E] mb-1">Amenities</label>
              <div className="space-y-1.5">
                {(room.amenities || []).map((a, aIdx) => (
                  <div key={aIdx} className="flex gap-2">
                    <input
                      value={a}
                      onChange={e => {
                        const next = [...(room.amenities || [])];
                        next[aIdx] = e.target.value;
                        upd(idx, { amenities: next });
                      }}
                      className="flex-1 bg-transparent border-b border-[#E7E5E4] py-1 outline-none text-sm"
                      placeholder="e.g. King bed, AC, Private bath"
                    />
                    <button
                      type="button"
                      onClick={() => upd(idx, { amenities: (room.amenities || []).filter((_, i) => i !== aIdx) })}
                      className="text-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => upd(idx, { amenities: [...(room.amenities || []), ''] })}
                  className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Amenity
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...(items || []), { image: '', title: '', description: '', amenities: [] }])}
          className="text-xs uppercase tracking-[0.2em] text-[#1C1917] flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Room
        </button>
      </div>
    </div>
  );
}
