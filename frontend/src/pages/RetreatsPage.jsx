import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Download, ArrowRight, Instagram, Check, Users, Mountain, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const upcomingRetreats = [
  {
    id: 'bali-2026',
    title: 'Bali Movement Camp',
    location: 'Bali, Indonesia',
    date: '1st – 6th September 2026',
    duration: '6 Days',
    icon: Waves,
    description: 'An immersive week combining intensive movement training with Balinese culture and natural beauty. Daily training sessions, mobility work, and adventure.',
    highlights: [
      'Daily movement & mobility sessions',
      'Handstand & skill workshops',
      'Rice terrace training',
      'Waterfall excursions',
      'Healthy organic meals included',
      'Small intimate group'
    ],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'
  },
  {
    id: 'gulmarg-2027',
    title: 'The Snow Playground',
    subtitle: 'A winter escape blending skiing, movement, and mountain living.',
    location: 'Gulmarg, Kashmir',
    date: '9th – 14th February 2027',
    duration: '6 Days',
    icon: Mountain,
    description: 'A winter escape blending skiing, movement, and mountain living in the breathtaking snow-covered peaks of Gulmarg.',
    highlights: [
      'Skiing & snowboarding sessions',
      'Mountain movement training',
      'Hot spring recovery',
      'Fireside community evenings',
      'Accommodation & meals included',
      'Guided mountain walks'
    ],
    image: 'https://images.pexels.com/photos/35873485/pexels-photo-35873485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  }
];

const testimonials = [
  {
    name: 'Russel Siraj',
    text: 'Had such a great time understanding my body all over again and exploring a new way of living. Food was amazing, had the perfect environment to unleash creativity and most importantly such amazing people who have now become my friends!'
  },
  {
    name: 'Naini Sahni',
    text: 'Unlocked so many skill milestones, let go of baggage, made new friends, laughed our hearts out and cheered each other on. Best place, best people and best times. Leaving with a head full of memories and a heart full of gratitude.'
  },
  {
    name: 'Shruti',
    text: 'It was an amazing amazing retreat! I thoroughly enjoyed it and it was inspiring to be around so many people who were so enthusiastic about movement. The conversations, the constant cheering and the amazing positive energy all around was so special. Sunpreet was like a breath of fresh air \u2014 so young, so down to earth and so much talent! He made handstands so much fun and I can\u2019t wait to explore more!'
  },
  {
    name: 'Sonakshi Mittal',
    text: 'This whole week was beyond beautiful! It\u2019s been transformative for not just my body, but for my mind, heart and soul too. I had no idea I\u2019m going to find myself in the most uplifting environment with the most wonderful people all around me. I couldn\u2019t be more grateful for all the learnings, the connections, and the memories I\u2019ve taken back home with me. This was truly meant to be.'
  },
  {
    name: 'Harini',
    text: 'When I signed up, I never expected to take back so much from this experience. Beyond being incredible coaches, they were also such humble souls and so much fun to be around! The journeys everyone shared, the beautiful conversations we had, and the unconditional support everyone gave each other were truly inspiring. Too much inspiration for a lifetime! Definitely an experience I\u2019ll hold on to forever.'
  },
  {
    name: 'Dhvani',
    text: 'This retreat felt like a dream. I feel fortunate to have shared this space with such an incredible group. It\u2019s been a powerful experience of giving, learning and connecting, and the energy we shared together deeply touched my heart!'
  }
];

const retreatFeedbackImages = [
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/e8m7ct0q_IMG_5445.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/cyqwtuo6_IMG_5446.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/nyeu372o_IMG_5447.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/2l1dzn4a_IMG_5448.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/0hkq635t_IMG_5449.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/4qb8o8d7_IMG_5450.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/ursgaxyg_IMG_5451.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/z1bkz17u_IMG_5452.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/miwdaa2h_IMG_5453.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/kxnj4cq1_IMG_5454.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/87k8bl78_IMG_5455.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/2wreu4oo_IMG_5456.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/aq4q9pc0_IMG_5457.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/ot4rbdgg_IMG_5458.jpeg',
];

const feedbackRotations = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2, -1.5, 1, -2, 1.5];

const pastGalleryImages = [
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/ezr3e571_DSC03302%20%281%29.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/fumsxgn1_DSC02506%20%281%29.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/1tbvakwo_DSC05257.JPG',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/tupxudhn_DSC05650.JPG',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/77w1e3rs_DSC00854.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/0xx2w934_DSC02992.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/bzzci78b_DSC02601%20%281%29.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/lbnxpc9n_DSC03586%20%281%29.jpg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/pir9b527_DSC02429.jpg',
];

const instagramPosts = [
  { type: 'video', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/v156dxgq_1.mp4' },
  { type: 'image', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/zzg0zaj7_f75ca5bf-7317-4719-887b-7ab1d91fac3d.jpeg' },
  { type: 'image', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/m6zgy2d6_6fab25d8-a632-48cc-8641-688541636af9.jpeg' },
  { type: 'image', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/b78lj9wk_IMG_5233.jpeg' },
  { type: 'image', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/qmrid5pu_IMG_5232.jpeg' },
  { type: 'image', src: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/k1h2tuzw_IMG_8291.jpeg' },
];

function VideoTile({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const tryPlay = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) tryPlay(); },
      { threshold: 0.1 }
    );
    observer.observe(video);
    tryPlay();

    return () => observer.disconnect();
  }, []);

  const handleTap = (e) => {
    e.preventDefault();
    const video = videoRef.current;
    if (video && video.paused) {
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="w-full h-full relative cursor-pointer" onClick={handleTap}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1C1917] ml-1" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RetreatsPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRetreat, setSelectedRetreat] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', instagram: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [feedbackLightbox, setFeedbackLightbox] = useState(null);
  const galleryRef = useRef(null);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const openApplyModal = (retreat) => {
    setSelectedRetreat(retreat);
    setApplyModalOpen(true);
  };

  const closeModal = () => {
    setApplyModalOpen(false);
    setEnquiryModalOpen(false);
    setSelectedRetreat(null);
    setFormData({ name: '', email: '', phone: '', instagram: '', message: '' });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.instagram) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const messagePrefix = type === 'retreat'
        ? `RETREAT APPLICATION for ${selectedRetreat?.title}\nDate: ${selectedRetreat?.date}\nLocation: ${selectedRetreat?.location}\n\n`
        : `PRIVATE/CORPORATE RETREAT ENQUIRY\n\n`;

      await axios.post(`${API}/contact`, {
        first_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        instagram: formData.instagram || null,
        message: `${messagePrefix}${formData.message || 'No additional message'}`,
        source: type === 'retreat' ? 'retreat' : 'retreat',
      });

      toast.success(type === 'retreat' ? 'Application submitted! We\'ll be in touch soon.' : 'Enquiry sent! We\'ll get back to you.');
      closeModal();
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-28 md:py-40 bg-[#1C1917]" data-testid="retreats-hero">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="Mountain retreat"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.4em] text-[#D6C0A6] mb-6">
              Movement Shala
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FBFBF9] mb-8 leading-tight">
              Where Travel Meets<br />Movement and Mind
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">
              Small, intimate groups. Guided movement for all levels. Travel to beautiful locations
              and connect with like-minded people.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Retreats */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="upcoming-retreats">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Coming Soon</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">Upcoming Retreats</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingRetreats.map((retreat, index) => {
              const IconComponent = retreat.icon;
              return (
                <motion.div
                  key={retreat.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group overflow-hidden bg-white border border-[#E7E5E4] hover:border-[#D6C0A6] transition-all duration-500"
                  data-testid={`upcoming-retreat-${retreat.id}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={retreat.image}
                      alt={retreat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 text-[#D6C0A6] mb-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em]">{retreat.location}</span>
                      </div>
                      <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl text-[#FBFBF9]">{retreat.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 text-sm text-[#57534E] mb-4">
                      <Calendar className="w-4 h-4 text-[#D6C0A6]" />
                      <span>{retreat.date}</span>
                      <span className="text-[#E7E5E4]">|</span>
                      <span>{retreat.duration}</span>
                    </div>
                    {retreat.subtitle && (
                      <p className="text-[#57534E] text-sm italic mb-4">{retreat.subtitle}</p>
                    )}
                    <p className="text-[#57534E] text-sm leading-relaxed mb-6">{retreat.description}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => openApplyModal(retreat)}
                        className="bg-[#1C1917] text-[#FBFBF9] h-12 px-6 text-xs uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300 flex-1"
                        data-testid={`apply-retreat-${retreat.id}`}
                      >
                        Request an Invite
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Link to={`/retreats/${retreat.id}`}>
                        <Button
                          variant="outline"
                          className="border-[#1C1917] text-[#1C1917] h-12 px-6 text-xs uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all duration-300 w-full"
                          data-testid={`details-retreat-${retreat.id}`}
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Our Retreats Are For */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="retreats-for">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
                For Everyone
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-10">
                Who Our Retreats<br />Are For
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-6">
                {[
                  'Open for all levels of fitness — no prior experience needed',
                  'Individuals looking to build strength, mobility, and body control',
                  'Those wanting to step away from routine and reset',
                  'Anyone curious to explore movement in a deeper way',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-[#D6C0A6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#D6C0A6] text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-[#A8A29E] leading-relaxed">{item}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/o33a3eks_WhatsApp%20Image%202026-01-04%20at%205.39.05%20PM.jpeg" alt="Retreat hiking" className="w-full h-full object-cover img-organic" />
              </div>
              <div className="aspect-[3/4] overflow-hidden mt-8">
                <img src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/tfoo1ibq_DSC03746.JPG" alt="Retreat handstands" className="w-full h-full object-cover img-organic" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Retreat Feedback */}
      <section className="py-24 md:py-32 bg-[#292524] relative overflow-hidden" data-testid="retreats-feedback">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D6C0A6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
              Stories from the Retreat
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-4">
              Real Experiences
            </motion.h2>
            <motion.div variants={fadeInUp} className="w-16 h-[1px] bg-[#D6C0A6]/40 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {retreatFeedbackImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotate: feedbackRotations[index] }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
                className="cursor-pointer group"
                onClick={() => setFeedbackLightbox(src)}
                data-testid={`retreat-feedback-${index}`}
              >
                <div className="bg-white p-3 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_40px_rgba(214,192,166,0.2)] transition-shadow duration-500">
                  <div className="overflow-hidden">
                    <img
                      src={src}
                      alt={`Retreat feedback ${index + 1}`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-2 pb-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D6C0A6]" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#A8A29E]">via Instagram</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Lightbox */}
      <AnimatePresence>
        {feedbackLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setFeedbackLightbox(null)}
            data-testid="retreat-feedback-lightbox"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setFeedbackLightbox(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                data-testid="retreat-feedback-lightbox-close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="bg-white p-3 rounded-sm shadow-2xl">
                <img
                  src={feedbackLightbox}
                  alt="Retreat feedback"
                  className="w-full h-auto block max-h-[80vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Retreats Gallery */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="past-retreats-gallery">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Gallery</motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">Moments from Past Retreats</motion.h2>
            </motion.div>
            <div className="hidden md:flex gap-2 mt-4 sm:mt-0">
              <button onClick={() => scrollGallery('left')} className="w-12 h-12 border border-[#1C1917] flex items-center justify-center hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all" data-testid="gallery-scroll-left">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollGallery('right')} className="w-12 h-12 border border-[#1C1917] flex items-center justify-center hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all" data-testid="gallery-scroll-right">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={galleryRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {pastGalleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start cursor-pointer group"
                onClick={() => openLightbox(idx)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img}
                    alt={`Retreat moment ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="retreats-instagram">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">@movementshala</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-4">Follow the Journey</motion.h2>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] max-w-xl mx-auto">
              Get a glimpse of movement, travel, and moments from our retreats.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {instagramPosts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="aspect-square overflow-hidden group relative"
              >
                {post.type === 'video' ? (
                  <VideoTile src={post.src} />
                ) : (
                  <a href="https://www.instagram.com/movement.shala/" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={post.src} alt={`Instagram ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#1C1917]/0 group-hover:bg-[#1C1917]/40 transition-all duration-300 flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a href="https://www.instagram.com/movement.shala/" target="_blank" rel="noopener noreferrer">
              <Button
                className="bg-transparent border border-[#D6C0A6] text-[#D6C0A6] h-12 px-8 text-xs uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300"
                data-testid="follow-instagram-btn"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Follow on Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Private & Corporate Retreats */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="private-retreats">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#1C1917]/60 mb-4">
                Custom Experiences
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-6">
                Bring Movement Shala to Your Team or Group
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#1C1917]/70 leading-relaxed mb-8">
                Planning a private getaway or a corporate offsite? Fill out the enquiry form and we'll curate a
                personalised retreat experience based on your goals, group size, and preferred location.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300"
                  data-testid="enquire-now-btn"
                >
                  Enquire Now
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/3] overflow-hidden"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/u39d916j_DSC02429.jpg"
                alt="Corporate retreat"
                className="w-full h-full object-cover img-organic"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C1917]/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            data-testid="lightbox-modal"
          >
            <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-[#FBFBF9] hover:text-[#D6C0A6] z-10" data-testid="lightbox-close">
              <X className="w-8 h-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? pastGalleryImages.length - 1 : i - 1); }} className="absolute left-4 md:left-6 text-[#FBFBF9] hover:text-[#D6C0A6]">
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === pastGalleryImages.length - 1 ? 0 : i + 1); }} className="absolute right-4 md:right-6 text-[#FBFBF9] hover:text-[#D6C0A6]">
              <ChevronRight className="w-10 h-10" />
            </button>
            <motion.div key={currentImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
              <img src={pastGalleryImages[currentImageIndex]} alt={`Gallery ${currentImageIndex + 1}`} className="max-w-full max-h-[70vh] object-contain mx-auto" />
              <p className="text-center text-[#57534E] text-sm mt-4">{currentImageIndex + 1} / {pastGalleryImages.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply / Waitlist Modal */}
      <AnimatePresence>
        {applyModalOpen && selectedRetreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FBFBF9] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-testid="apply-modal"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={selectedRetreat.image} alt={selectedRetreat.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1C1917]/60" />
                <button onClick={closeModal} className="absolute top-4 right-4 text-[#FBFBF9] hover:text-[#D6C0A6] w-10 h-10 flex items-center justify-center bg-black/30 rounded-full z-10" data-testid="apply-close-btn">
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center px-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-2">{selectedRetreat.date}</p>
                    <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl text-[#FBFBF9]">{selectedRetreat.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 text-sm text-[#57534E] mb-4">
                  <MapPin className="w-4 h-4" /> {selectedRetreat.location}
                  <span className="text-[#E7E5E4]">|</span>
                  {selectedRetreat.duration}
                </div>
                <p className="text-[#57534E] text-sm mb-4">{selectedRetreat.description}</p>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-3">Highlights</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRetreat.highlights.map((h, idx) => (
                      <li key={idx} className="text-[#57534E] text-sm flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D6C0A6] mt-0.5 flex-shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-[#E7E5E4] pt-6">
                  <h4 className="font-['Playfair_Display'] text-xl text-[#1C1917] mb-4">Request an Invite</h4>
                  <form onSubmit={(e) => handleSubmit(e, 'retreat')} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" required data-testid="apply-name" />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Email *</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" required data-testid="apply-email" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" placeholder="+91 98765 43210" data-testid="apply-phone" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Instagram ID *</label>
                      <input type="text" value={formData.instagram} onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" placeholder="@your_handle" required data-testid="apply-instagram" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Message</label>
                      <textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full bg-[#F5F5F4] border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none resize-none" rows={3} placeholder="Tell us about yourself and your expectations" data-testid="apply-message" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1C1917] text-[#FBFBF9] h-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all" data-testid="apply-submit">
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {enquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FBFBF9] w-full max-w-lg max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
              data-testid="enquiry-modal"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">Private Retreat Enquiry</h3>
                <button onClick={closeModal} className="text-[#57534E] hover:text-[#1C1917]" data-testid="enquiry-close-btn">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-[#57534E] text-sm mb-6">Tell us about your group and we'll design a bespoke retreat experience.</p>
              <form onSubmit={(e) => handleSubmit(e, 'enquiry')} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" required data-testid="enquiry-name" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" required data-testid="enquiry-email" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" placeholder="+91 98765 43210" data-testid="enquiry-phone" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Instagram ID *</label>
                  <input type="text" value={formData.instagram} onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))} className="w-full bg-transparent border-b border-[#E7E5E4] focus:border-[#1C1917] py-3 text-[#1C1917] focus:outline-none" placeholder="@your_handle" required data-testid="enquiry-instagram" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Tell us about your retreat needs</label>
                  <textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full bg-[#F5F5F4] border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none resize-none" rows={4} placeholder="Group size, preferred location, goals, dates..." data-testid="enquiry-message" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1C1917] text-[#FBFBF9] h-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all" data-testid="enquiry-submit">
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
