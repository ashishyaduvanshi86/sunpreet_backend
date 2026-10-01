import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';

export default function AdminSettings() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi().get('/content/settings').then(r => setData(r.data.data || {})).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi().put('/admin/content/settings', { data });
      alert('Settings saved');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-10">Loading…</div>;

  const fields = [
    { key: 'phone', label: 'Phone Number' },
    { key: 'email', label: 'Contact Email' },
    { key: 'whatsapp', label: 'WhatsApp Number (digits only, with country code)' },
    { key: 'instagram_personal', label: 'Instagram (Sunpreet Personal)' },
    { key: 'instagram_brand', label: 'Instagram (Movement Shala)' },
    { key: 'spurfit_url', label: 'Spur.fit Default URL' },
  ];

  return (
    <div className="p-8 md:p-12 max-w-2xl" data-testid="admin-settings">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Site Settings</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-8">Brand & Contact</h1>

      <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">{f.label}</label>
            <input
              value={data[f.key] || ''}
              onChange={e => setData({ ...data, [f.key]: e.target.value })}
              className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none"
              data-testid={`settings-${f.key}`}
            />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="mt-6 bg-[#1C1917] text-[#FBFBF9] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60" data-testid="save-settings-btn">
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
}
