import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Instagram } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    instagram: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message') {
      if (value.length <= 500) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setCharCount(value.length);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone || !formData.instagram || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        first_name: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        instagram: formData.instagram || null,
        message: formData.message,
      };

      await axios.post(`${API}/contact`, payload);
      
      toast.success('Message sent successfully! I will get back to you soon.');
      
      setFormData({ firstName: '', email: '', phone: '', instagram: '', message: '' });
      setCharCount(0);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="contact-hero">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">
              Let's Connect
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl text-[#1C1917]">
              Get in Touch
            </motion.h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-6">
                Your Wellness, Our Priority
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-10">
                We are here to answer your questions and assist you with any of our wellness programs, 
                events, or services. Your health and well-being matter to us.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F4] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#1C1917]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-1">Email</p>
                    <a 
                      href="mailto:coaching@sunpreetsingh.com" 
                      className="text-[#1C1917] hover:text-[#D6C0A6] transition-colors"
                    >
                      coaching@sunpreetsingh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F4] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#1C1917]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-1">Location</p>
                    <p className="text-[#1C1917]">Mumbai, India</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={fadeInUp} className="mt-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-4">Follow Along</p>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/sunpreet_sing/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1C1917] flex items-center justify-center text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300"
                    data-testid="contact-social-instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                {/* Name */}
                <div className="input-animated">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-4 px-0 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors"
                    data-testid="contact-input-name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="input-animated">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-4 px-0 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors"
                    data-testid="contact-input-email"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="input-animated">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-4 px-0 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors"
                    data-testid="contact-input-phone"
                    required
                  />
                </div>

                {/* Instagram ID */}
                <div className="input-animated">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">
                    Instagram ID *
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@your_handle"
                    className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-4 px-0 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors"
                    data-testid="contact-input-instagram"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#57534E]">
                      Message *
                    </label>
                    <span className="text-xs text-[#A8A29E]">{charCount} / 500</span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your goals and what you're looking to achieve..."
                    rows={5}
                    className="w-full bg-[#F5F5F4] border border-[#E7E5E4] focus:border-[#1C1917] p-4 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors resize-none"
                    data-testid="contact-input-message"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1C1917] text-[#FBFBF9] h-14 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300 disabled:opacity-50"
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Submit
                      <Send className="ml-3 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="contact-location">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
                Based In
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-6">
                Mumbai, India
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-8">
                While I offer online coaching to clients worldwide, I'm based in Mumbai and available 
                for in-person sessions, workshops, and retreats in India.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-['Playfair_Display'] text-4xl text-[#D6C0A6]">50+</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] mt-1">Students Coached</p>
                </div>
                <div className="w-px h-16 bg-[#3d3a36]" />
                <div className="text-center">
                  <p className="font-['Playfair_Display'] text-4xl text-[#D6C0A6]">9+</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] mt-1">Years Experience</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-video bg-[#2d2a26] flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#D6C0A6] mx-auto mb-4" />
                <p className="text-[#FBFBF9] font-['Playfair_Display'] text-2xl">Mumbai, Maharashtra</p>
                <p className="text-[#A8A29E] mt-2">India</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
