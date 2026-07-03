import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, GraduationCap, Heart, Percent, Check } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AID_OPTIONS = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student Discount',
    tagline: '20% off for verified students',
    description: 'For currently enrolled students. Get 20% off any program with proof of enrollment.',
  },
  {
    id: 'scholarship',
    icon: Heart,
    title: 'Scholarship Application',
    tagline: 'Free access for 1 year',
    description: 'For motivated movers who genuinely cannot afford full or discounted pricing.',
  },
  {
    id: 'custom',
    icon: Percent,
    title: 'Custom Discount',
    tagline: 'Suggest a fair price',
    description: 'Honest about your situation? Suggest a discount that works for you and share why. We\'ll review and respond.',
  },
];

export default function FinancialAidModal({ open, onClose }) {
  useEffect(() => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return () => {
    document.body.style.overflow = 'auto';
  };
}, [open]);
  const [step, setStep] = useState('select'); // 'select' | 'form' | 'success'
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    first_name: '',
    email: '',
    phone: '',
    instagram: '',
    program_interest: '',
    discount_requested: '',
    situation: '',
  });

  const reset = () => {
    setStep('select');
    setSelected(null);
    setSubmitting(false);
    setError('');
    setForm({
      first_name: '', email: '', phone: '', instagram: '', program_interest: '',
       discount_requested: '', situation: '',
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const pickOption = (opt) => {
    setSelected(opt);
    setStep('form');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`${API}/financial-aid`, {
        aid_type: selected.id,
        first_name: form.first_name,
        email: form.email,
        phone: form.phone,
        instagram: form.instagram,
        program_interest: form.program_interest,
        discount_requested: form.discount_requested,
        situation: form.situation,
      });
      setStep('success');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"          onClick={handleClose}
          data-testid="financial-aid-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3 }}
className="bg-[#FBFBF9] w-full max-w-4xl relative max-h-[92vh] overflow-y-auto rounded-[6px]"
            onClick={(e) => e.stopPropagation()}
            data-testid="financial-aid-modal"
          >
            <button
              onClick={handleClose}
className="sticky top-4 ml-auto mr-4 z-50 w-11 h-11 flex items-center justify-center bg-[#FBFBF9] border border-[#E7E5E4] hover:bg-[#1C1917]/5 transition-colors rounded-full"              data-testid="financial-aid-close-btn"
            >
              <X className="w-5 h-5 text-[#1C1917]" />
            </button>

            {/* SELECT STEP */}
            {step === 'select' && (
<div className="p-6 md:p-12">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-3">Discounts & Scholarships</p>
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-3">
                  Apply for Financial Aid
                </h2>
                <p className="text-[#57534E] text-sm leading-relaxed mb-8 max-w-xl">
                  Quality coaching should be accessible. Choose the option below that best fits your situation — be honest, and we'll do our best to make it work.
                </p>

                <div className="space-y-4">
                  {AID_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => pickOption(opt)}
                        className="w-full text-left border border-[#E7E5E4] hover:border-[#1C1917] hover:bg-white transition-all p-6 group"
                        data-testid={`aid-option-${opt.id}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#1C1917] flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6C0A6] transition-colors">
                            <Icon className="w-5 h-5 text-[#D6C0A6] group-hover:text-[#1C1917] transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                              <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{opt.title}</h3>
                              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6C0A6] font-bold">{opt.tagline}</span>
                            </div>
                            <p className="text-sm text-[#57534E] leading-relaxed">{opt.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#57534E] group-hover:text-[#1C1917] group-hover:translate-x-1 transition-all flex-shrink-0 mt-3" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-[#57534E] mt-8 italic">
                  *Please be honest. The scholarship system relies on community trust to keep it sustainable.
                </p>
              </div>
            )}

            {/* FORM STEP */}
            {step === 'form' && selected && (
<div className="p-6 md:p-12">
                  <button
                  onClick={() => setStep('select')}
                  className="flex items-center gap-2 text-[#57534E] hover:text-[#1C1917] text-xs uppercase tracking-[0.2em] mb-6 transition-colors"
                  data-testid="aid-back-btn"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <p className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-3">{selected.tagline}</p>
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-3">
                  {selected.title}
                </h2>
                <p className="text-[#57534E] text-sm leading-relaxed mb-8">
                  {selected.description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" data-testid="aid-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                        data-testid="aid-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                        data-testid="aid-email-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                        data-testid="aid-phone-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Instagram Handle *</label>
                      <input
                        type="text"
                        name="instagram"
                        value={form.instagram}
                        onChange={handleChange}
                        required
                        placeholder="@yourhandle"
                        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                        data-testid="aid-instagram-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Program of Interest *</label>
                    <select
                      name="program_interest"
                      value={form.program_interest}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                      data-testid="aid-program-select"
                    >
                      <option value="">Select a program</option>
                      <option value="Beginner">Strong & Mobile — Beginner</option>
                      <option value="Intermediate">Strong & Mobile — Intermediate</option>
                      <option value="1:1 Coaching">1:1 Online Coaching</option>
                    </select>
                  </div>

                  {selected.id === 'custom' && (
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Discount % You're Requesting *</label>
                      <input
                        type="text"
                        name="discount_requested"
                        value={form.discount_requested}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 30%"
                        className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none transition-colors"
                        data-testid="aid-discount-input"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">
                      {selected.id === 'scholarship' ? 'Tell us about your situation & why this matters to you *' : 'Why are you applying? Share your context *'}
                    </label>
                    <textarea
                      name="situation"
                      value={form.situation}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-transparent border border-[#1C1917]/20 focus:border-[#1C1917] p-3 text-[#1C1917] outline-none transition-colors resize-none"
                      data-testid="aid-situation-input"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm" data-testid="aid-error">{error}</p>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#1C1917] text-[#FBFBF9] h-13 px-10 py-3 text-xs uppercase tracking-[0.2em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300 disabled:opacity-60"
                      data-testid="aid-submit-btn"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                      {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#57534E] italic">
                    *Please be honest about your situation. Trust is what keeps these discounts available for those who need them most.
                  </p>
                </form>
              </div>
            )}

            {/* SUCCESS STEP */}
            {step === 'success' && (
              <div className="p-8 md:p-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 bg-[#D6C0A6] mx-auto flex items-center justify-center mb-6"
                >
                  <Check className="w-7 h-7 text-[#1C1917]" />
                </motion.div>
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-4">
                  Application Received
                </h2>
                <p className="text-[#57534E] leading-relaxed max-w-md mx-auto mb-8">
                  Thank you for applying. We've sent a confirmation to your email. Sunpreet will personally review your application and respond within 3–5 business days.
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-[#1C1917] text-[#FBFBF9] h-12 px-10 text-xs uppercase tracking-[0.2em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all"
                  data-testid="aid-success-close-btn"
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
