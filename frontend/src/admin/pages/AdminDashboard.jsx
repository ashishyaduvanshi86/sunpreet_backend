import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../AdminAuthContext';
import { Inbox, Mountain, GraduationCap, ShoppingBag, Plus, Send } from 'lucide-react';

const KIND_COLORS = {
  contact: 'bg-blue-100 text-blue-800', retreat: 'bg-green-100 text-green-800',
  financial_aid: 'bg-amber-100 text-amber-800', waitlist: 'bg-purple-100 text-purple-800',
  order: 'bg-rose-100 text-rose-800'
};
const KIND_LABELS = {
  contact: 'Contact', retreat: 'Retreat App', financial_aid: 'Financial Aid', waitlist: 'Waitlist', order: 'Order'
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminApi().get('/admin/dashboard').then(r => setData(r.data)).catch(e => setErr(e?.response?.data?.detail || 'Failed to load'));
  }, []);

  if (err) return <div className="p-10 text-red-600">{err}</div>;
  if (!data) return <div className="p-10">Loading…</div>;

  const c = data.counts;
  const cards = [
    { label: 'Contact Submissions', total: c.contacts_total, sub: `${c.contacts_today} today / ${c.contacts_week} this week`, icon: Inbox, to: '/admin/submissions' },
    { label: 'Retreat Applications', total: c.retreat_apps_total, sub: 'All time', icon: Mountain, to: '/admin/submissions' },
    { label: 'Financial Aid', total: c.financial_aid_total, sub: `${c.financial_aid_pending} pending review`, icon: GraduationCap, to: '/admin/financial-aid' },
    { label: 'Waitlist Subscribers', total: c.waitlist_total, sub: 'Across all products', icon: ShoppingBag, to: '/admin/shop' },
  ];

  const actions = [
    { label: 'Add Retreat', icon: Plus, to: '/admin/retreats', highlight: true },
    { label: 'Add Product', icon: Plus, to: '/admin/shop' },
    { label: 'Send Broadcast', icon: Send, to: '/admin/newsletter' },
  ];

  return (
    <div className="p-8 md:p-12" data-testid="admin-dashboard">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Overview</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-8">Dashboard</h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              to={a.to}
              className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                a.highlight
                  ? 'bg-[#1C1917] text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917]'
                  : 'bg-white border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9]'
              }`}
              data-testid={`quick-action-${a.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {a.label}
            </Link>
          );
        })}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white border border-[#E7E5E4] p-6 hover:border-[#1C1917] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#57534E]">{card.label}</p>
                <Icon className="w-4 h-4 text-[#1C1917]" />
              </div>
              <p className="font-['Playfair_Display'] text-4xl text-[#1C1917]">{card.total}</p>
              <p className="text-xs text-[#57534E] mt-1">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Form Submissions */}
      <div className="bg-white border border-[#E7E5E4] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-['Playfair_Display'] text-xl text-[#1C1917]">Recent Form Submissions</h2>
          <Link to="/admin/submissions" className="text-xs uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#D6C0A6]">View all →</Link>
        </div>
        {(!data.recent_submissions || data.recent_submissions.length === 0) ? (
          <p className="text-sm text-[#57534E]">No submissions yet.</p>
        ) : (
          <div className="space-y-2">
            {data.recent_submissions.map((s, i) => (
              <div key={i} className="flex items-start justify-between text-sm border-b border-[#E7E5E4] py-3 last:border-0 gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 flex-shrink-0 ${KIND_COLORS[s.kind] || 'bg-gray-100 text-gray-800'}`}>
                    {KIND_LABELS[s.kind] || s.kind}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[#1C1917] font-medium truncate">{s.first_name || s.customer_name || s.email || 'Unknown'}</p>
                    <p className="text-xs text-[#57534E] truncate">{s.email} {s.message && `· ${s.message.substring(0, 80)}`}</p>
                  </div>
                </div>
                <p className="text-xs text-[#57534E] flex-shrink-0">{s._ts ? new Date(s._ts).toLocaleDateString() : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
