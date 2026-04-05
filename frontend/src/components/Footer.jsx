import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Youtube, Mail, MapPin, X } from 'lucide-react';

const footerLinks = [
  { name: '1:1 Coaching', path: '/coaching' },
  { name: 'Training Programs', path: '/programs' },
  { name: 'Retreats', path: '/retreats' },
  { name: 'About Me', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const programLinks = [
  { name: 'Start Foundation', url: 'https://links.spur.fit/r/pZ/sunpreet-singh/strong-n-mobile--foundational' },
  { name: 'Start Beginner', url: 'https://links.spur.fit/r/q2/sunpreet-singh/strong-n-mobile--beginner' },
  { name: 'Start Intermediate', url: 'https://links.spur.fit/r/q1/sunpreet-singh/strong-n-mobile--intermediate' },
];

const policyContent = {
  terms: {
    title: 'Terms & Conditions',
    sections: [
      { text: 'Welcome to Sunpreet Singh Coaching. By accessing this website or purchasing any service, you agree to the terms below.' },
      { heading: 'Nature of Services', text: 'We provide personalized fitness coaching and educational guidance related to strength, mobility, skills, and injury prevention. Results vary based on individual effort and consistency. No guaranteed results are promised.' },
      { heading: 'Payments', text: 'All payments must be made in advance. We do not store any card, UPI, or banking details.' },
      { heading: 'Refunds & Cancellations', text: 'Refunds and cancellations are governed by our Refund & Cancellation Policy. Please review it carefully before making a purchase.' },
      { heading: 'Intellectual Property', text: 'All content, programs, and materials are the property of Sunpreet Singh Coaching and may not be shared or reproduced without permission.' },
      { heading: 'Chargebacks & Disputes', text: 'For any billing concerns, please contact us first. Chargebacks raised without prior communication may result in termination of services and submission of evidence to the payment provider.' },
      { heading: 'Limitation of Liability', text: 'Sunpreet Singh Coaching is not liable for any physical, financial, or personal outcomes resulting from the use of our services.' },
      { heading: 'Contact', text: 'Email: coaching@sunpreetsingh.com' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { text: 'Your privacy is important to us. This Privacy Policy explains how Sunpreet Singh Coaching collects, uses, and protects your personal information.' },
      { heading: 'Information We Collect', text: 'We may collect basic personal details such as your name, email address, phone number, and information you voluntarily share through forms or communication.' },
      { heading: 'How We Use Your Information', list: ['Providing coaching services', 'Communication and support', 'Scheduling sessions and updates', 'Internal service improvement'] },
      { heading: 'Data Sharing', text: 'We do not sell, rent, or share your personal data with unauthorized third parties. Information is shared only when required for payment processing or legal compliance.' },
      { heading: 'Cookies & Analytics', text: 'This website may use cookies and basic analytics tools to understand usage patterns and improve user experience.' },
      { heading: 'Your Consent', text: 'By using this website or services, you consent to this Privacy Policy.' },
      { heading: 'Contact', text: 'For any privacy-related concerns, contact us at:\nEmail: coaching@sunpreetsingh.com' },
    ]
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    sections: [
      { text: 'This Refund & Cancellation Policy applies to all coaching services offered by Sunpreet Singh Coaching. Please read it carefully.' },
      { heading: 'Refund Eligibility', text: 'Refund requests will be considered only if submitted within 7 days of purchase and before the coaching program or session has started.' },
      { heading: 'Non-Refundable Cases', text: 'No refunds will be provided in the following cases:', list: ['If the coaching program or session has already started', 'If any live or recorded session has been attended or accessed', 'If digital content, programs, or resources have been shared', 'If sessions are missed without prior notice'] },
      { heading: 'Cancellation', text: 'Cancellations must be requested via email before the start of the service. Once the program or session begins, cancellations will not be eligible for a refund.' },
      { heading: 'Refund Processing', text: 'Approved refunds will be processed within 10\u201315 working days to the original payment method used at the time of purchase.' },
      { heading: 'Payment Disputes', text: 'For any billing or payment concerns, please contact us directly before initiating a chargeback or dispute. Unresolved chargebacks may result in termination of services and submission of relevant evidence to the payment provider.' },
      { heading: 'Contact', text: 'For refund or cancellation requests, email us at:\ncoaching@sunpreetsingh.com' },
    ]
  },
  contact: {
    title: 'Contact',
    sections: [
      { text: 'If you have any questions related to coaching services, payments, refunds, or general inquiries, please feel free to contact us.' },
      { heading: 'Email', text: 'coaching@sunpreetsingh.com' },
      { text: 'We aim to respond to all queries within 48 working hours.' },
    ]
  }
};

function PolicyModal({ policyKey, onClose }) {
  const policy = policyContent[policyKey];
  if (!policy) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center overflow-y-auto py-12 px-4"
      onClick={onClose}
      data-testid="policy-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBFBF9] rounded-2xl max-w-[700px] w-full p-8 md:p-12 relative my-4"
        onClick={e => e.stopPropagation()}
        data-testid="policy-modal-content"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F5F5F4] hover:bg-[#E7E5E4] flex items-center justify-center transition-colors"
          data-testid="policy-modal-close"
        >
          <X className="w-4 h-4 text-[#1C1917]" />
        </button>

        <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-8 pr-8" data-testid="policy-modal-title">
          {policy.title}
        </h2>

        <div className="space-y-6 text-[#44403C] text-sm leading-relaxed">
          {policy.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h3 className="font-['Playfair_Display'] text-lg text-[#1C1917] mb-2">{section.heading}</h3>
              )}
              {section.text && <p className="whitespace-pre-line">{section.text}</p>}
              {section.list && (
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  {section.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Footer() {
  const location = useLocation();
  const [activePolicy, setActivePolicy] = useState(null);
  const isRetreats = location.pathname === '/retreats';
  const instagramUrl = isRetreats
    ? 'https://www.instagram.com/movement.shala/'
    : 'https://www.instagram.com/sunpreet_sing/';

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: instagramUrl },
    { name: 'Email', icon: Mail, url: 'mailto:coaching@sunpreetsingh.com' },
  ];

  return (
    <>
      <AnimatePresence>
        {activePolicy && (
          <PolicyModal policyKey={activePolicy} onClose={() => setActivePolicy(null)} />
        )}
      </AnimatePresence>

      <footer className="bg-[#1C1917] text-[#FBFBF9]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" data-testid="footer-logo">
                <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
                  <span className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium tracking-tight text-[#FBFBF9]">
                    SUNPREET SINGH
                  </span>
                  <span className="block text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mt-1">
                    Coaching
                  </span>
                </motion.div>
              </Link>
              <p className="mt-6 text-[#A8A29E] text-sm leading-relaxed max-w-md">
                Holistic approach to strength, mobility, and skill coaching. 
                Move well for the next 30 years, not just the next 30 days.
              </p>
              <div className="flex items-center gap-2 mt-6 text-[#A8A29E]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D6C0A6] mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {footerLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors duration-300 text-sm underline-hover"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D6C0A6] mb-4 mt-8">
                Programs
              </h4>
              <ul className="space-y-4">
                {programLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors duration-300 text-sm underline-hover"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D6C0A6] mb-6">
                Connect
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`footer-social-${social.name.toLowerCase()}`}
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 border border-[#3d3a36] flex items-center justify-center text-[#A8A29E] hover:text-[#FBFBF9] hover:border-[#D6C0A6] transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#3d3a36] mt-16 pt-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
              <button onClick={() => setActivePolicy('terms')} className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors text-xs cursor-pointer" data-testid="footer-terms">Terms & Conditions</button>
              <button onClick={() => setActivePolicy('privacy')} className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors text-xs cursor-pointer" data-testid="footer-privacy">Privacy Policy</button>
              <button onClick={() => setActivePolicy('refund')} className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors text-xs cursor-pointer" data-testid="footer-refund">Refund & Cancellation Policy</button>
              <button onClick={() => setActivePolicy('contact')} className="text-[#A8A29E] hover:text-[#FBFBF9] transition-colors text-xs cursor-pointer" data-testid="footer-contact-info">Contact</button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#57534E] text-xs">
                &copy; {new Date().getFullYear()} Sunpreet Singh. All rights reserved.
              </p>
              <p className="text-[#57534E] text-xs">
                Move well. Live well.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
