import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';

export default function AdminFinancialAid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null); // {id, type:'approve'|'reject'}
  const [form, setForm] = useState({ discount_code: '', discount_percent: '', notes: '' });

  const load = () => {
    setLoading(true);
    adminApi().get('/admin/submissions?source=financial_aid')
      .then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submitDecision = async () => {
    try {
      const url = `/admin/financial-aid/${acting.id}/${acting.type}`;
      await adminApi().post(url, {
        discount_code: form.discount_code || null,
        discount_percent: form.discount_percent ? parseInt(form.discount_percent) : null,
        notes: form.notes || null,
      });
      setActing(null);
      setForm({ discount_code: '', discount_percent: '', notes: '' });
      load();
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed');
    }
  };

  return (
    <div className="p-8 md:p-12" data-testid="admin-financial-aid">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Discounts & Scholarships</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-6">Financial Aid Applications</h1>

      {loading ? <p>Loading…</p> : items.length === 0 ? (
        <p className="text-[#57534E]">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((a, idx) => (
            <div key={a.id || idx} className="bg-white border border-[#E7E5E4] p-6" data-testid={`aid-row-${idx}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{a.first_name}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-amber-100 text-amber-800">{a.aid_type}</span>
                    {a.status === 'approved' && <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-green-100 text-green-800">Approved</span>}
                    {a.status === 'rejected' && <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-red-100 text-red-800">Rejected</span>}
                  </div>
                  <p className="text-xs text-[#57534E]">{a.email} · {a.phone} · {a.instagram}</p>
                  <p className="text-xs text-[#57534E] mt-1">Program: {a.program_interest}</p>
                  {a.institution && <p className="text-xs text-[#57534E]">Institution: {a.institution} (ID: {a.student_id})</p>}
                  {a.discount_requested && <p className="text-xs text-[#57534E]">Requested discount: {a.discount_requested}</p>}
                  <p className="text-sm text-[#1C1917] mt-3 whitespace-pre-line">{a.situation}</p>
                  {a.admin_notes && <p className="text-xs text-[#D6C0A6] mt-2 italic">Admin notes: {a.admin_notes}</p>}
                </div>
                {!a.status && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setActing({ id: a.id, type: 'approve' })} className="text-xs uppercase tracking-[0.2em] px-4 py-2 bg-[#1C1917] text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors" data-testid={`approve-${idx}`}>Approve</button>
                    <button onClick={() => setActing({ id: a.id, type: 'reject' })} className="text-xs uppercase tracking-[0.2em] px-4 py-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-colors" data-testid={`reject-${idx}`}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision modal */}
      {acting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setActing(null)}>
          <div className="bg-white max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-4">
              {acting.type === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h2>
            {acting.type === 'approve' && (
              <>
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Discount %</label>
                  <input type="number" value={form.discount_percent} onChange={e => setForm({...form, discount_percent: e.target.value})} className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none" placeholder="e.g. 20" />
                </div>
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Discount Code</label>
                  <input type="text" value={form.discount_code} onChange={e => setForm({...form, discount_code: e.target.value})} className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 outline-none" placeholder="e.g. SCHOLAR2026" />
                </div>
              </>
            )}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Personal Note (optional)</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full border border-[#E7E5E4] focus:border-[#1C1917] p-2 outline-none text-sm" placeholder="Add a personal message…" />
            </div>
            <div className="flex gap-2">
              <button onClick={submitDecision} className="flex-1 bg-[#1C1917] text-[#FBFBF9] py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors">
                Confirm & Send Email
              </button>
              <button onClick={() => setActing(null)} className="px-6 border border-[#1C1917] text-xs uppercase tracking-[0.2em]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
