import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function VideoPlayer({ src }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {});

    const onTimeUpdate = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [src]);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const seek = (e) => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  return (
    <div className="relative bg-black cursor-pointer rounded-lg overflow-hidden w-[90vw] max-w-[960px] aspect-video" onClick={togglePlay}>
      <video
        ref={ref}
        src={src}
        autoPlay
        playsInline
        loop
        className="w-full h-full object-cover"
        data-testid="video-modal-player"
      />
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-[#1C1917] ml-1" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3" onClick={(e) => e.stopPropagation()}>
        <div className="w-full h-1 bg-white/30 rounded cursor-pointer" onClick={seek}>
          <div className="h-full bg-white rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function VideoThumbnail({ src, imageUrl, onClick }) {
  return (
    <div className="w-full h-full cursor-pointer group relative" onClick={onClick}>
      <img
        src={imageUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play className="w-5 h-5 text-[#1C1917] ml-0.5" />
        </div>
      </div>
    </div>
  );
}

const TRANSFORMATIONS = [
  {
    id: 1,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/tnl3pj5d_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM%20%281%29.jpeg',
    name: 'Hamsa',
    duration: '2 Months',
    achievement: 'First 10 sec Handstand on Floor',
  },
  {
    id: 2,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/llli7noh_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM.jpeg',
    name: 'Evani',
    duration: null,
    achievement: 'First Wall Assisted Handstand',
  },
  {
    id: 3,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/mngo9nxi_WhatsApp%20Image%202026-03-29%20at%201.26.27%20PM.jpeg',
    name: 'Deeksha',
    duration: null,
    achievement: 'Full Pancakes',
  },
  {
    id: 4,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/lyrcwggn_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM%20%282%29.jpeg',
    name: 'Prakruti',
    duration: null,
    achievement: 'Full Split',
  },
  {
    id: 5,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/bkr790pk_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM%20%281%29.jpeg',
    name: 'Priyanka',
    duration: null,
    achievement: 'First 20 sec Handstand on Floor',
  },
  {
    id: 6,
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/u1xacdgy_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM%20%282%29.jpeg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/964hpzp7_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM.jpeg',
    name: 'Ipsita',
    duration: null,
    achievement: 'First Full Pull-up',
  },
  {
    id: 7,
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/302x7jsk_before1.jpg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/1n87gp1l_after1.jpg',
    name: 'Archa',
    duration: null,
    achievement: 'Full Pancakes',
  },
  {
    id: 8,
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/b0ousk0o_before3.jpg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/yz01963l_after3.jpg',
    name: 'Sakhshi',
    duration: null,
    achievement: 'Middle Split',
  },
  {
    id: 9,
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/zz7jquia_after2.jpg',
    name: 'Rakhi',
    duration: null,
    achievement: 'Wheel Pose Progression',
  },
];

function TransformationCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = TRANSFORMATIONS.length;
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

  const goTo = useCallback((idx) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total <= visibleCount) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 4000);
  }, [total, visibleCount]);

  useEffect(() => {
    startAutoScroll();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAutoScroll]);

  const handleNav = (dir) => {
    goTo(current + dir);
    startAutoScroll();
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleCount; i++) {
      cards.push(TRANSFORMATIONS[(current + i) % total]);
    }
    return cards;
  };

  return (
    <div className="relative" data-testid="transformation-carousel">
      <div className="flex gap-5 md:gap-6 justify-center">
        <AnimatePresence mode="popLayout">
          {getVisibleCards().map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 80, rotate: 3 }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: idx === 1 ? 0 : idx === 0 ? -2 : 2,
              }}
              exit={{ opacity: 0, x: -80, rotate: -3 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className={`w-full flex-shrink-0 ${item.type === 'beforeAfter' ? 'md:w-[440px]' : 'md:w-[360px]'}`}
              data-testid={`transform-card-${item.id}`}
            >
              <div className="bg-[#F5F0E8] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                {/* Achievement banner */}
                <div className="bg-[#D6C0A6] px-3 py-2 mb-2 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#1C1917]">
                    {item.name}{item.duration ? ` \u00B7 ${item.duration}` : ''}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1C1917]/70">
                    {item.achievement}
                  </span>
                </div>
                {/* Photo(s) */}
                {item.type === 'beforeAfter' ? (
                  <div className="grid grid-cols-2 gap-1.5 aspect-[4/4]">
                    <div className="relative overflow-hidden">
                      <img src={item.before} alt={`${item.name} - Before`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-[#1C1917]/80 text-white text-[9px] uppercase tracking-wider px-2 py-1 font-bold">Before</span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img src={item.after} alt={`${item.name} - After`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-[#D6C0A6]/90 text-[#1C1917] text-[9px] uppercase tracking-wider px-2 py-1 font-bold">After</span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={item.image} alt={`${item.name} - ${item.achievement}`} className="w-full h-full object-cover" />
                  </div>
                )}
                {/* Name & Quote */}
                <div className="pt-3 pb-1">
                  <p className="font-['Playfair_Display'] text-lg text-[#1C1917] font-bold">{item.name}</p>
                  {item.duration && (
                    <p className="text-xs text-[#57534E] uppercase tracking-wider">{item.duration}</p>
                  )}
                  <p className="text-sm text-[#44403C] italic mt-1">"{item.achievement}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {total > visibleCount && (
        <>
          <button
            onClick={() => handleNav(-1)}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
            data-testid="transform-prev-btn"
          >
            <ChevronLeft className="w-5 h-5 text-[#1C1917]" />
          </button>
          <button
            onClick={() => handleNav(1)}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
            data-testid="transform-next-btn"
          >
            <ChevronRight className="w-5 h-5 text-[#1C1917]" />
          </button>
        </>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-8" data-testid="transform-dots">
        {TRANSFORMATIONS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { goTo(idx); startAutoScroll(); }}
            className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#D6C0A6] w-7' : 'bg-[#57534E] w-2'}`}
            data-testid={`transform-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}


export default function HomePage() {
  const [testimonials, setTestimonials] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" data-testid="hero-section">
        {/* Full background image - no gradient */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: heroY }} className="h-[120%] w-full">
            <img
              src="https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/ocrdlq4r_IMG_5306.JPG.jpeg"
              alt="Sunpreet performing handstand on parallettes"
              className="w-full h-full object-cover object-center md:object-right"
            />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-6 drop-shadow-lg"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              Strength &bull; Mobility &bull; Movement
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl font-medium text-[#FBFBF9] leading-[0.95] tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
              Coaching That Sticks for Life
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-lg md:text-xl text-[#FBFBF9] leading-relaxed max-w-xl"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.6)' }}
            >
              Holistic approach to strength, mobility, and skill coaching so you can 
              move well for the next 30 years, not just the next 30 days.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <Link to="/coaching">
                <Button
                  data-testid="hero-coaching-btn"
                  className="bg-[#FBFBF9] text-[#1C1917] h-14 px-8 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] transition-all duration-300 w-full sm:w-auto btn-magnetic"
                >
                  1:1 Coaching
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/programs">
                <Button
                  data-testid="hero-programs-btn"
                  variant="outline"
                  className="border-[#FBFBF9]/60 text-[#FBFBF9] h-14 px-8 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#FBFBF9] hover:text-[#1C1917] transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                >
                  Training Programs
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-20"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
          data-testid="scroll-indicator"
        >
          <span className="text-[#FBFBF9]/60 text-xs uppercase tracking-[0.2em] mb-3" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border border-[#FBFBF9]/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-[#FBFBF9]/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="testimonials-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">
              Testimonials
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#1C1917]">
              What My Students Say
            </motion.h2>
          </motion.div>

          {/* Video Modal */}
          <AnimatePresence>
            {playingVideo && (() => {
              const activeVideo = testimonials.find(t => t.id === playingVideo);
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                  onClick={() => setPlayingVideo(null)}
                  data-testid="video-modal-overlay"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setPlayingVideo(null)}
                      className="absolute -top-12 right-0 text-white/80 hover:text-white z-10"
                      data-testid="video-modal-close"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <VideoPlayer src={activeVideo?.video_url} />
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="testimonial-card bg-white border border-[#E7E5E4]"
                data-testid={`testimonial-card-${testimonial.id}`}
              >
                <div
                  className="aspect-square relative overflow-hidden"
                  data-testid={`video-thumb-${testimonial.id}`}
                >
                  <VideoThumbnail
                    src={testimonial.video_url}
                    imageUrl={`${process.env.REACT_APP_BACKEND_URL}${testimonial.image_url}`}
                    onClick={() => setPlayingVideo(testimonial.id)}
                  />
                </div>
                <div className="p-6">
                  <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-[#E7E5E4] pt-4">
                    <p className="font-['Playfair_Display'] text-lg text-[#1C1917]">{testimonial.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="about-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/x1mujd66_IMG_6108.JPG.jpeg"
                  alt="Sunpreet coaching handstand"
                  className="w-full h-full object-cover img-organic"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-[#D6C0A6]/30 hidden lg:block" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
                About Me
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-8">
                Hi, I'm Sunpreet
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-6">
                My journey began with a simple intention — to improve my health and feel better in my body. 
                I started training at home, with no equipment and no formal plan. Sometimes it was just me and a local park.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-6">
                What began as curiosity slowly grew into a deep passion. I didn't come from a background in sports or athletics. 
                Everything I've learned has come through self-practice, patience, and the guidance of incredible coaches from around the world.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-8">
                Today, my training approach integrates everything I've learned over the past nine years — calisthenics strength, 
                mobility inspired by Functional Range Conditioning, gymnastic skill work, hand balancing, and a strong focus on longevity.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link to="/about">
                  <Button
                    data-testid="about-journey-btn"
                    className="bg-transparent border border-[#D6C0A6] text-[#D6C0A6] h-12 px-8 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300"
                  >
                    My Journey
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section className="py-24 md:py-32 bg-[#292524] relative overflow-hidden" data-testid="transformations-section">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D6C0A6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#FBFBF9] font-bold">
              Students Who Showed Up
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-sm mt-4">
              Swipe to meet them &rarr;
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TransformationCarousel />
          </motion.div>
        </div>
      </section>

      {/* Training Approach Section */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="approach-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">
                Methodology
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-8">
                Training Approach
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-6">
                I coach the way I wish someone had coached me back then. My approach to training blends 
                calisthenics strength, mobility, and hand balancing to help you build a body that is not 
                just strong, but intelligent, aware, and in control.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-6">
                I take a methodical and steady approach to mobility. There are no rushed timelines or 
                "get flexible fast" promises. Some clients improve quickly, others more gradually. 
                We move at your pace, allowing your body to adapt safely and sustainably.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed">
                The focus is not just on achieving positions, but on building true ownership of your movement — 
                developing strength, awareness, and control together. The results extend far beyond the training session.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/655vi8tj_ssP.jpg"
                  alt="Sunpreet performing a one-arm handstand"
                  className="w-full h-full object-cover img-organic"
                />
              </div>
              <div className="absolute top-8 -left-8 bg-[#D6C0A6] p-8 hidden lg:block">
                <p className="font-['Playfair_Display'] text-4xl text-[#1C1917]">9+</p>
                <p className="text-sm text-[#1C1917]/70 mt-1">Years of Practice</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="cta-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#1C1917]/70 mb-4">
              Ready to Start?
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#1C1917] mb-8">
              Begin Your Journey Today
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#1C1917]/70 max-w-2xl mx-auto mb-10">
              Whether you're just starting out or looking to refine your practice, 
              I'm here to guide you every step of the way.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/coaching">
                <Button
                  data-testid="cta-coaching-btn"
                  className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300 btn-magnetic"
                >
                  Start 1:1 Coaching
                </Button>
              </Link>
              <Link to="/programs">
                <Button
                  data-testid="cta-programs-btn"
                  variant="outline"
                  className="border-[#1C1917] text-[#1C1917] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all duration-300"
                >
                  Training Programs
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
