import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../AdminAuthContext';
import { Send, Users } from 'lucide-react';

const SEGMENT_META = [
  { key: 'contacts', label: 'All Contacts', desc: 'Anyone who submitted the Contact form' },
  { key: 'retreat_applicants', label: 'Retreat Applicants', desc: 'Brochure & registration leads' },
  { key: 'financial_aid_applicants', label: 'Financial Aid Applicants', desc: 'Discount / scholarship requests' },
  { key: 'waitlist', label: 'Notify Me Waitlist', desc: 'Shop product launch subscribers' },
];

export default function AdminNewsletter() {
  const [audiences, setAudiences] = useState(null);
  const [selected, setSelected] = useState({});
  const [productFilter, setProductFilter] = useState('');
  const [retreatFilter, setRetreatFilter] = useState('');
  const [customEmails, setCustomEmails] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [products, setProducts] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi().get('/admin/audiences'),
      adminApi().get('/admin/products'),
    ]).then(([a, p]) => {
      setAudiences(a.data.segments);
      setProducts(p.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  const toggleSegment = (key) => setSelected(prev => ({ ...prev, [key]: !prev[key] }));

  const recipients = useMemo(() => {
    if (!audiences) return [];
    const set = new Set();
    if (selected.contacts) audiences.contacts.forEach(c => set.add(c.email.toLowerCase()));
    if (selected.retreat_applicants) {
      audiences.retreat_applicants
        .filter(r => !retreatFilter || r.retreat_id === retreatFilter)
        .forEach(r => set.add(r.email.toLowerCase()));
    }
    if (selected.financial_aid_applicants) {
      audiences.financial_aid_applicants.forEach(f => set.add(f.email.toLowerCase()));
    }
    if (selected.waitlist) {
      audiences.waitlist
        .filter(w => !productFilter || w.product_id === productFilter)
        .forEach(w => set.add(w.email.toLowerCase()));
    }
    if (useCustom) {
      customEmails.split(/[\s,;\n]+/).filter(Boolean).forEach(e => set.add(e.trim().toLowerCase()));
    }
    return [...set].filter(e => /\S+@\S+\.\S+/.test(e));
  }, [audiences, selected, productFilter, retreatFilter, customEmails, useCustom]);

  const retreatOptions = useMemo(() => {
    if (!audiences) return [];
    return [...new Set(audiences.retreat_applicants.map(r => r.retreat_id).filter(Boolean))];
  }, [audiences]);

  const handleSend = async () => {
    if (!subject || !body) { alert('Subject and message are required'); return; }
    if (recipients.length === 0) { alert('No recipients selected'); return; }
    if (!window.confirm(`Send to ${recipients.length} unique recipient(s)?`)) return;
    setSending(true);
    setResult(null);
    try {
      const res = await adminApi().post('/admin/newsletter', { subject, html: body, recipients });
      setResult(res.data);
      setSubject(''); setBody('');
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed');
    } finally { setSending(false); }
  };

  if (loading) return <div className="p-10">Loading…</div>;

  const counts = {
    contacts: new Set(audiences.contacts.map(c => c.email.toLowerCase())).size,
    retreat_applicants: new Set(audiences.retreat_applicants.map(c => c.email.toLowerCase())).size,
    financial_aid_applicants: new Set(audiences.financial_aid_applicants.map(c => c.email.toLowerCase())).size,
    waitlist: new Set(audiences.waitlist.map(c => c.email.toLowerCase())).size,
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl" data-testid="admin-newsletter">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Outreach</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-2">Broadcast</h1>
      <p className="text-sm text-[#57534E] mb-8">Send targeted emails. Pick one or more audiences — duplicates are removed automatically.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience selector */}
        <div className="bg-white border border-[#E7E5E4] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Playfair_Display'] text-xl text-[#1C1917]">Audience</h2>
            <div className="flex items-center gap-2 text-sm text-[#57534E]">
              <Users className="w-4 h-4" />
              <span data-testid="recipient-count" className="font-medium text-[#1C1917]">{recipients.length}</span>
              <span>unique</span>
            </div>
          </div>

          <div className="space-y-2">
            {SEGMENT_META.map(seg => (
              <label key={seg.key} className="flex items-start gap-3 p-3 border border-[#E7E5E4] hover:border-[#1C1917] cursor-pointer transition-colors" data-testid={`segment-${seg.key}`}>
                <input
                  type="checkbox"
                  checked={!!selected[seg.key]}
                  onChange={() => toggleSegment(seg.key)}
                  className="mt-1 w-4 h-4 accent-[#1C1917]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#1C1917]">{seg.label}</span>
                    <span className="text-xs text-[#57534E]">{counts[seg.key]} email{counts[seg.key] === 1 ? '' : 's'}</span>
                  </div>
                  <p className="text-xs text-[#57534E] mt-1">{seg.desc}</p>

                  {seg.key === 'waitlist' && selected.waitlist && (
                    <select
                      value={productFilter}
                      onChange={e => { e.stopPropagation(); setProductFilter(e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="mt-2 text-xs bg-white border border-[#E7E5E4] px-2 py-1 w-full"
                    >
                      <option value="">All products</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.title || p.name || p.id}</option>)}
                    </select>
                  )}

                  {seg.key === 'retreat_applicants' && selected.retreat_applicants && retreatOptions.length > 0 && (
                    <select
                      value={retreatFilter}
                      onChange={e => { e.stopPropagation(); setRetreatFilter(e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="mt-2 text-xs bg-white border border-[#E7E5E4] px-2 py-1 w-full"
                    >
                      <option value="">All retreats</option>
                      {retreatOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                </div>
              </label>
            ))}

            {/* Custom segment */}
            <label className="flex items-start gap-3 p-3 border border-[#E7E5E4] hover:border-[#1C1917] cursor-pointer transition-colors" data-testid="segment-custom">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={() => setUseCustom(v => !v)}
                className="mt-1 w-4 h-4 accent-[#1C1917]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-[#1C1917]">Custom · Selected Emails</span>
                <p className="text-xs text-[#57534E] mt-1">Paste emails manually (comma, space, or newline separated)</p>
                {useCustom && (
                  <textarea
                    value={customEmails}
                    onChange={e => setCustomEmails(e.target.value)}
                    rows={3}
                    placeholder="user1@example.com, user2@example.com"
                    className="mt-2 w-full border border-[#E7E5E4] focus:border-[#1C1917] p-2 outline-none text-xs font-mono"
                    data-testid="custom-emails"
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Composer */}
        <div className="bg-white border border-[#E7E5E4] p-6 space-y-5">
          <h2 className="font-['Playfair_Display'] text-xl text-[#1C1917]">Compose</h2>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Handstand Canes are now live"
              className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none"
              data-testid="newsletter-subject" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Message (HTML allowed)</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10}
              placeholder="Hi there! Just launched..."
              className="w-full border border-[#E7E5E4] focus:border-[#1C1917] p-3 outline-none text-sm font-mono"
              data-testid="newsletter-body" />
          </div>

          {result && (
            <div className="border border-green-300 bg-green-50 p-4 text-sm" data-testid="newsletter-result">
              ✓ Sent to {result.sent_count} of {result.total} recipients{result.failed_count ? ` · ${result.failed_count} failed` : ''}
            </div>
          )}

          <button onClick={handleSend} disabled={sending || !subject || !body || recipients.length === 0}
            className="bg-[#1C1917] text-[#FBFBF9] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60 flex items-center gap-2 w-full justify-center"
            data-testid="newsletter-send">
            <Send className="w-4 h-4" />
            {sending ? 'Sending…' : `Broadcast to ${recipients.length}`}
          </button>
        </div>
      </div>
    </div>
  );
}
