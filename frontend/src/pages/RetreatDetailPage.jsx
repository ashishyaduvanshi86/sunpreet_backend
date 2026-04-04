import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, ChevronDown, ChevronRight, Check, X as XIcon, Clock, Users, Heart, Plane, Star, Utensils, Activity, Map, Dumbbell, Bed, MessageCircle, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { getRetreatById } from '../data/retreats';

const WHATSAPP_NUMBER = '918595146962';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const iconMap = {
  calendar: Calendar, utensils: Utensils, activity: Activity, map: Map,
  heart: Heart, users: Users, plane: Plane, star: Star, dumbbell: Dumbbell,
};

function ItineraryAccordion({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E7E5E4]" data-testid={`itinerary-${item.day.toLowerCase().replace(' ', '-')}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:bg-[#F5F5F4]/50 transition-colors px-2"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D6C0A6] font-bold w-14">{item.day}</span>
          <span className="font-['Playfair_Display'] text-lg text-[#1C1917]">{item.title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#A8A29E] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[#57534E] text-sm leading-relaxed px-2 pb-5 pl-20">{item.details}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RetreatDetailPage() {
  const { retreatId } = useParams();
  const retreat = getRetreatById(retreatId);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [lightboxImg, setLightboxImg] = useState(null);

  const buildWhatsAppUrl = (extraFields = {}, isBrochure = false) => {
    const price = retreat.pricing.twinSharing.price;
    let msg = isBrochure
      ? `Hey, I'd like to check out the brochure for *${retreat.title}*. Please share the details!\n\n`
      : `Hi, I'm interested in booking the *${retreat.title}*\n\n`;
    msg += `Retreat: ${retreat.title}\n`;
    msg += `Date: ${retreat.date}\n`;
    msg += `Price: ${price}\n`;
    if (extraFields.name) msg += `Name: ${extraFields.name}\n`;
    if (extraFields.phone) msg += `Phone: ${extraFields.phone}\n`;
    if (extraFields.email) msg += `Email: ${extraFields.email}\n`;
    if (extraFields.message) msg += `Message: ${extraFields.message}\n`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.trim())}`;
  };

  const handleBookNow = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  const handleBrochureSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    const url = buildWhatsAppUrl(formData, true);
    window.open(url, '_blank');
    setFormData({ name: '', email: '', phone: '', message: '' });
    toast.success('Redirecting to WhatsApp!');
  };

  if (!retreat) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#FBFBF9]">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1917] mb-4">Retreat Not Found</h1>
          <Link to="/retreats">
            <Button className="bg-[#1C1917] text-[#FBFBF9] rounded-none h-12 px-8 text-sm uppercase tracking-wider">Back to Retreats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#FBFBF9]">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center" data-testid="retreat-detail-hero">
        <div className="absolute inset-0">
          <img src={retreat.heroImage} alt={retreat.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/40 to-[#1C1917]/20" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
              {retreat.location}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl text-[#FBFBF9] mb-4">
              {retreat.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-[#FBFBF9]/80 mb-2">
              {retreat.date}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-sm text-[#D6C0A6] italic mb-8">
              {retreat.tagline}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={handleBookNow}
                className="bg-[#D6C0A6] text-[#1C1917] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#FBFBF9] transition-all duration-300"
                data-testid="hero-cta"
              >
                Book Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* At a Glance */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="at-a-glance">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] text-center mb-16">
            At a Glance
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {retreat.atAGlance.map((item, idx) => {
              const IconComp = iconMap[item.icon] || Star;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white border border-[#E7E5E4] p-5 text-center hover:border-[#D6C0A6] transition-colors"
                  data-testid={`glance-${idx}`}
                >
                  <IconComp className="w-6 h-6 mx-auto mb-3 text-[#D6C0A6]" />
                  <h3 className="text-sm font-bold text-[#1C1917] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#57534E]">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Your Stay */}
      <section className="py-20 md:py-28 bg-[#F5F5F4]" data-testid="your-stay">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-8">
                {retreat.yourStay.title}
              </motion.h2>
              {retreat.yourStay.text.map((para, idx) => (
                <motion.p key={idx} variants={fadeInUp} className="text-[#57534E] text-sm leading-relaxed mb-4">
                  {para}
                </motion.p>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src={retreat.yourStay.image} alt="Your Stay" className="w-full aspect-[4/3] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Rooms */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="your-rooms">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Accommodation</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917]">Your Rooms</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {retreat.rooms.map((room, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group bg-white border border-[#E7E5E4] overflow-hidden hover:border-[#D6C0A6] transition-colors duration-300"
                data-testid={`room-${idx}`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bed className="w-4 h-4 text-[#D6C0A6]" />
                    <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{room.title}</h3>
                  </div>
                  <p className="text-[#57534E] text-sm leading-relaxed mb-4">{room.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, aIdx) => (
                      <span key={aIdx} className="text-xs bg-[#F5F5F4] text-[#57534E] px-3 py-1.5 border border-[#E7E5E4]">{amenity}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Experience */}
      <section className="py-20 md:py-28 bg-[#1C1917]" data-testid="about-experience">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">The Experience</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#FBFBF9] mb-8">
              What Awaits You
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed">
              {retreat.longDescription}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Inclusions & Exclusions */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="inclusions-exclusions">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] text-center mb-16">
            What's Included & Excluded
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">Inclusions</h3>
              </div>
              <ul className="space-y-3">
                {retreat.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#44403C]">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                  <XIcon className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">Exclusions</h3>
              </div>
              <ul className="space-y-3">
                {retreat.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#57534E]">
                    <XIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sample Itinerary */}
      <section className="py-20 md:py-28 bg-[#F5F5F4]" data-testid="itinerary">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] text-center mb-4">
            Sample Itinerary
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[#A8A29E] text-sm text-center mb-12 italic">
            Schedule may shift based on weather, conditions, and group flow.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {retreat.itinerary.map((item, idx) => (
              <ItineraryAccordion key={idx} item={item} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="retreat-gallery">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] text-center mb-12">
            A Peek Into the Experience
          </motion.h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {retreat.gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxImg(img)}
              >
                <div className="overflow-hidden">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setLightboxImg(null)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <XIcon className="w-5 h-5 text-white" />
              </button>
              <img src={lightboxImg} alt="Gallery" className="w-full h-auto max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-[#1C1917]" data-testid="retreat-pricing">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#FBFBF9] mb-12">Pricing</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div variants={fadeInUp} className="bg-[#292524] border border-[#44403C] p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D6C0A6] mb-3">Twin Sharing</p>
                <p className="font-['Playfair_Display'] text-4xl text-[#FBFBF9] mb-2">{retreat.pricing.twinSharing.price}</p>
                <p className="text-sm text-[#A8A29E]">{retreat.pricing.twinSharing.note}</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-[#292524] border border-[#44403C] p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D6C0A6] mb-3">Single Occupancy</p>
                <p className="font-['Playfair_Display'] text-4xl text-[#FBFBF9] mb-2">{retreat.pricing.singleOccupancy.price}</p>
                <p className="text-sm text-[#A8A29E]">{retreat.pricing.singleOccupancy.note}</p>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp} className="space-y-2">
              <p className="text-sm text-[#A8A29E]">{retreat.pricing.deposit}</p>
              <p className="text-sm text-[#A8A29E]">{retreat.pricing.balanceDue}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Get Brochure */}
      <section id="get-brochure" className="py-20 md:py-28 bg-[#F5F5F4]" data-testid="get-brochure">
        <div className="max-w-[600px] mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-10">
            <motion.div variants={fadeInUp} className="w-14 h-14 mx-auto mb-5 bg-[#D6C0A6]/15 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#D6C0A6]" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-3">
              Get the Brochure
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#57534E] text-sm">
              Fill in your details and we'll share the complete retreat brochure with you on WhatsApp.
            </motion.p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            onSubmit={handleBrochureSubmit}
            className="space-y-4 bg-white border border-[#E7E5E4] p-8"
            data-testid="brochure-form"
          >
            <input
              type="text" required value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name *"
              className="w-full h-12 px-4 border border-[#E7E5E4] bg-[#FBFBF9] text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors"
              data-testid="brochure-name"
            />
            <input
              type="tel" required value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number *"
              className="w-full h-12 px-4 border border-[#E7E5E4] bg-[#FBFBF9] text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors"
              data-testid="brochure-phone"
            />
            <input
              type="email" required value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email Address *"
              className="w-full h-12 px-4 border border-[#E7E5E4] bg-[#FBFBF9] text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors"
              data-testid="brochure-email"
            />
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any questions or message? (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-[#E7E5E4] bg-[#FBFBF9] text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors resize-none"
              data-testid="brochure-message"
            />
            <Button
              type="submit"
              className="w-full h-14 bg-[#25D366] text-white text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1da851] transition-all duration-300 flex items-center justify-center gap-2"
              data-testid="brochure-submit"
            >
              <MessageCircle className="w-5 h-5" />
              Get Brochure via WhatsApp
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
