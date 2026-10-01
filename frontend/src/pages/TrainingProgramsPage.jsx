import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Dumbbell, Zap, Smartphone, BookOpen, Repeat, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import FinancialAidModal from '../components/FinancialAidModal';
import { useContent } from '../hooks/useContent';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

// Programs-page only — independent transformations data + carousel
const PROGRAM_TRANSFORMATIONS = [
  {
    id: 'p1',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/tnl3pj5d_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM%20%281%29.jpeg',
    name: 'Hamsa',
    duration: '2 Months',
    achievement: 'First 10 sec Handstand on Floor',
  },
  {
    id: 'p2',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/llli7noh_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM.jpeg',
    name: 'Evani',
    duration: null,
    achievement: 'First Wall Assisted Handstand',
  },
  {
    id: 'p3',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/mngo9nxi_WhatsApp%20Image%202026-03-29%20at%201.26.27%20PM.jpeg',
    name: 'Deeksha',
    duration: null,
    achievement: 'Full Pancakes',
  },
  {
    id: 'p4',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/lyrcwggn_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM%20%282%29.jpeg',
    name: 'Prakruti',
    duration: null,
    achievement: 'Full Split',
  },
  {
    id: 'p5',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/bkr790pk_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM%20%281%29.jpeg',
    name: 'Priyanka',
    duration: null,
    achievement: 'First 20 sec Handstand on Floor',
  },
  {
    id: 'p6',
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/u1xacdgy_WhatsApp%20Image%202026-03-29%20at%201.26.28%20PM%20%282%29.jpeg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/964hpzp7_WhatsApp%20Image%202026-03-29%20at%201.26.29%20PM.jpeg',
    name: 'Ipsita',
    duration: null,
    achievement: 'First Full Pull-up',
  },
  {
    id: 'p7',
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/302x7jsk_before1.jpg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/1n87gp1l_after1.jpg',
    name: 'Archa',
    duration: null,
    achievement: 'Full Pancakes',
  },
  {
    id: 'p8',
    type: 'beforeAfter',
    before: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/b0ousk0o_before3.jpg',
    after: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/yz01963l_after3.jpg',
    name: 'Sakhshi',
    duration: null,
    achievement: 'Middle Split',
  },
  {
    id: 'p9',
    image: 'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/zz7jquia_after2.jpg',
    name: 'Rakhi',
    duration: null,
    achievement: 'Wheel Pose Progression',
  },
];

function ProgramsTransformationCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = PROGRAM_TRANSFORMATIONS.length;
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

  const handleNav = (dir) => { goTo(current + dir); startAutoScroll(); };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleCount; i++) {
      cards.push(PROGRAM_TRANSFORMATIONS[(current + i) % total]);
    }
    return cards;
  };

  return (
    <div className="relative" data-testid="programs-transformation-carousel">
      <div className="flex gap-5 md:gap-6 justify-center">
        <AnimatePresence mode="popLayout">
          {getVisibleCards().map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 80, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: idx === 1 ? 0 : idx === 0 ? -2 : 2 }}
              exit={{ opacity: 0, x: -80, rotate: -3 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full flex-shrink-0 md:w-[420px]"
              data-testid={`programs-transform-card-${item.id}`}
            >
              <div className="bg-[#F5F0E8] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                <div className="bg-[#D6C0A6] px-3 py-2 mb-2 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#1C1917]">
                    {item.name}{item.duration ? ` \u00B7 ${item.duration}` : ''}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1C1917]/70">
                    {item.achievement}
                  </span>
                </div>
                {item.type === 'beforeAfter' ? (
                  <div className="grid grid-cols-2 gap-1.5 aspect-[3/4]">
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
                <div className="pt-3 pb-1">
                  <p className="font-['Playfair_Display'] text-lg text-[#1C1917] font-bold">{item.name}</p>
                  {item.duration && (
                    <p className="text-xs text-[#57534E] uppercase tracking-wider">{item.duration}</p>
                  )}
                  <p className="text-sm text-[#44403C] italic mt-1">&quot;{item.achievement}&quot;</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {total > visibleCount && (
        <>
          <button
            onClick={() => handleNav(-1)}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
            data-testid="programs-transform-prev-btn"
          >
            <ChevronLeft className="w-5 h-5 text-[#1C1917]" />
          </button>
          <button
            onClick={() => handleNav(1)}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
            data-testid="programs-transform-next-btn"
          >
            <ChevronRight className="w-5 h-5 text-[#1C1917]" />
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-8" data-testid="programs-transform-dots">
        {PROGRAM_TRANSFORMATIONS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { goTo(idx); startAutoScroll(); }}
            className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#D6C0A6] w-7' : 'bg-[#57534E] w-2'}`}
            data-testid={`programs-transform-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}

const LIBRARY_ITEMS = [
  {
    num: '01',
    eyebrow: 'In-depth Tutorials',
    title: 'Detailed technique breakdowns for every movement',
    desc: "Every exercise comes with a full tutorial covering setup, common mistakes, and progressions. We don't just show you what to do — we explain why, so you build awareness alongside strength.",
    bullets: ['Form cues & corrections', 'Joint-by-joint breakdowns', 'Progression & regression options'],
    icon: BookOpen,
    count: '100+ tutorials',
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/3ite2ww5_s.jpg',
  },
  {
    num: '02',
    eyebrow: 'Week-by-Week Progressions',
    title: 'Structured programming that builds on itself',
    desc: "Every week has a clear focus, building on the last. You'll never wonder what to do next — your training schedule, intensity, and skill work all fit together into one cohesive plan.",
    bullets: ['Calendar-based scheduling', 'Built-in progressive overload', 'Adjustable to your pace'],
    icon: Repeat,
    count: '4 weeks of plans',
    image: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/qmrid5pu_IMG_5232.jpeg',
  },
  {
    num: '03',
    eyebrow: 'Recovery & Sustainability',
    title: 'Train hard. Recover smart. Stay in the game.',
    desc: "Built-in deload weeks, mobility flows, and recovery protocols ensure you keep moving forward without burning out. The goal isn't the next 30 days — it's the next 30 years.",
    bullets: ['Programmed deload weeks', 'Daily mobility flows', 'Sleep & recovery guidance'],
    icon: Heart,
    count: 'Mobility & recovery',
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/m3estfyl_DSC02319.JPG',
  },
];

function LibraryShowcase() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-28 items-center" data-testid="library-showcase">
      <div className="lg:col-span-5 space-y-8" data-testid="library-list">
        {LIBRARY_ITEMS.map((it, idx) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative pl-8 group"
              data-testid={`library-item-${idx}`}
            >
              <div className="absolute left-0 top-1 bottom-1 w-px bg-[#E7E5E4] group-hover:bg-[#D6C0A6] transition-colors duration-500" />
              <div className="absolute left-0 top-1 w-px h-8 bg-[#D6C0A6]" />

              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-['Playfair_Display'] text-3xl text-[#D6C0A6] font-light leading-none">
                  {it.num}
                </span>
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#57534E]" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E]">{it.eyebrow}</p>
                </div>
              </div>

              <h3 className="font-['Playfair_Display'] text-2xl md:text-[28px] text-[#1C1917] leading-tight mb-3">
                {it.title}
              </h3>

              <p className="text-[#57534E] text-sm md:text-[15px] leading-relaxed">
                {it.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="lg:col-span-7" data-testid="library-video">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden bg-[#1C1917] shadow-[0_30px_80px_-20px_rgba(28,25,23,0.45)] mx-auto max-w-[440px] lg:max-w-none"
        >
          <video
            src="https://res.cloudinary.com/dcft4ocwk/video/upload/v1780919477/VN20260509_125951_1_pmpohy.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="block w-full h-auto"
            data-testid="library-video-player"
          />

          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#D6C0A6] z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#D6C0A6] z-10 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}

// Icon lookup for CMS programs (lucide icons can't be JSON-serialized)
const ICON_MAP = { beginner: Dumbbell, intermediate: Zap };

const STATIC_PROGRAMS = [
  {
    id: 'beginner',
    status: 'live',
    level: 'Beginner',
    name: 'Strong & Mobile — Beginner',
    tagline: 'Ready to level up from the basics?',
    shortDesc: 'Build real strength and start working towards your first pull-up, better push-ups, and foundational calisthenics skills.',
    duration: '4 Weeks',
    price: '₹2999',
    sessions: '4x per week · 40–60 mins',
    setting: 'Build foundational strength & body control',
    primaryFocus: ['Pull-ups (progressions)', 'Push strength', 'Full-body strength', 'Mobility & flexibility'],
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/v416m6jr_IMG_7724.JPG.jpeg',
    programLink: 'https://links.spur.fit/r/qi/sunpreet-singh/strong-n-mobile',
    bullets: [
      '4 training sessions per week',
      '40–60 minute workouts',
      'Build foundational strength & body control',
      'First pull-up, handstand foundations, pistol squats',
      'Mobility & splits included',
    ],
    faq: [
      { q: 'What equipment do I need?', a: 'This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Light weights (for lower body mobility & overhead work)\n• Chalk (optional)\n\nYou can adapt the program for home if you have access to most of the above.' },
      { q: 'How is the program different from 1:1 coaching?', a: 'The program is essentially the same structure I use in my 1:1 coaching.\n\nThe main difference is that in 1:1, I make small adjustments to weights and reps based on your specific strength level — but the overall training structure stays identical.The other thing 1:1 includes is 2 live sessions every week focused on handstands and mobility, where I can give you real-time feedback and corrections.' },
      { q: "How do I know if I'm doing the movements correctly?", a: "Each exercise includes a simple video demo, step-by-step guidance, and coaching cues so you always understand the goal of the movement and what good form should look like.The program is designed to help you improve technique gradually instead of rushing progressions.And if you're unsure about anything, you can always message me directly through the app. You can also send videos of your training or movements and I'll personally help you correct your form and technique." },
      { q: "How do I know if I'm a beginner?", a: "This program is for you if:\n• You're working towards your first pull-up\n• You're building strength in push-ups\n• You're starting mobility work (splits, backbends)\n• You want to build a base for handstands and calisthenics skills\n\nEven if you can't do a pull-up yet, this program is designed to help you get there." },
      { q: 'How does the program work?', a: "Once you purchase the program, you'll be redirected to the app.\n• Select your start date\n• Open the app and go to \"Today's Workout\"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 4-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime." },
      { q: 'How many days per week is the program?', a: '• 4 days per week\n• Each session lasts 40–60 minutes' },
      { q: 'Do I need to be flexible?', a: "No.\nYou don't need to be flexible to start — your flexibility will improve as you follow the program." },
      { q: 'Are legs included?', a: 'Yes.\nThe program includes lower-body strength, mobility, and flexibility training.' },
      { q: 'What if I travel or miss training for a few days/weeks?', a: "That's completely normal. The program is flexible, so you can pause, repeat sessions, or continue from where you left off anytime.Missing an occasional workout or even a week happens to everyone. What matters most is staying consistent over time rather than being perfect every single week.If you're able to train regularly most of the time, you'll still make great progress.But if your schedule realistically won't allow consistent training at all, then any structured program will be difficult to follow properly." },
      { q: "What if I don't achieve pull-ups or splits in 4 weeks?", a: 'Progress depends on your starting point and consistency.\nYou may not master every skill in 4 weeks, but you will build a strong foundation and make measurable progress.' },
      { q: 'How can I get support during the program?', a: "• You'll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com" },
      { q: 'What happens after 4 weeks?', a: "Once you complete the program, you'll be guided to the next progression level inside the app." },
    ],
  },
  {
    id: 'intermediate',
    status: 'live',
    level: 'Intermediate',
    name: 'Strong & Mobile — Intermediate',
    tagline: 'Already have a base? Time to push further.',
    shortDesc: 'Increase strength, refine control, and progress towards advanced calisthenics skills like handstands and higher pull-up capacity.',
    duration: '4 Weeks',
    price: '₹2999',
    sessions: '4x per week · ~90 mins',
    setting: 'Requires push-up & pull-up strength base',
    primaryFocus: ['Pull-up strength & volume', 'Advanced push strength', 'Skill work', 'Mobility'],
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/yudcjiuh_IMG_7728.JPG.jpeg',
    programLink: 'https://links.spur.fit/r/qj/sunpreet-singh/strong-n-mobile--intermediate',
    bullets: [
      '4 training sessions per week',
      '60–90 minute workouts',
      'Requires push-up & pull-up strength base',
      'Advanced strength progressions',
      'Handstands, mobility & splits',
    ],
    faq: [
      { q: 'What equipment do I need?', a: 'This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Weights (for lower body and overhead work)\n• Chalk (optional)' },
      { q: 'How is the program different from 1:1 coaching?', a: 'The program is essentially the same structure I use in my 1:1 coaching.\n\nThe main difference is that in 1:1, I make small adjustments to weights and reps based on your specific strength level — but the overall training structure stays identical.The other thing 1:1 includes is 2 live sessions every week focused on handstands and mobility, where I can give you real-time feedback and corrections.' },
      { q: "What if I'm completely new to working out?", a: "If you're just starting out, begin with the Beginner Program first." },
      { q: "How do I know if I'm intermediate?", a: 'This program is for you if:\n• You can already perform pull-ups and are working on increasing reps\n• You have a solid base in push-ups and bodyweight strength\n• You are working on mobility (splits, backbends)\n• You want to progress towards handstands and advanced skills' },
      { q: 'How does the program work?', a: "Once you purchase the program, you'll be redirected to the app.\n• Select your start date\n• Open the app and go to \"Today's Workout\"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 8-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime." },
      { q: 'How many days per week is the program?', a: '• 4 days per week\n• Each session lasts around 90 minutes' },
      { q: 'Do I need to be flexible?', a: 'No.\nYour mobility will continue to improve as you follow the program.' },
      { q: 'How long do I have access to the program?', a: 'You will have 12 weeks to complete the 8-week program.' },
      { q: 'How can I get support during the program?', a: "• You'll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com" },
      { q: 'What happens after 4 weeks?', a: "Once you complete the program, you'll be guided to the next progression level inside the app." },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D6C0A6]/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
        data-testid={`faq-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-[#1C1917] font-medium pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#57534E] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
            <p className="text-[#57534E] text-sm leading-relaxed pb-5 whitespace-pre-line">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgramDetail({ program, onBack }) {
  const IconComp = program.icon || ICON_MAP[program.id] || Dumbbell;
  const faq = program.faq || [];
  return (
    <div>
      <section className="relative min-h-screen overflow-hidden bg-[#151311] flex items-center" data-testid="program-detail-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={program.image}
            alt={program.name}
            className="w-full h-full object-cover scale-[1.02] md:scale-100"
            style={{
              objectPosition: program.id === 'beginner' ? '52% 32%' : '50% 36%',
            }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-transparent to-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-28 right-10 md:right-16 lg:right-24 text-right hidden md:block"
          >
            <p className="text-[#D6C0A6] uppercase tracking-[0.32em] text-xs mb-3">Program Price</p>
            <h3 className="font-['Playfair_Display'] text-[#FBFBF9] text-5xl lg:text-6xl leading-none">
              {program.price || '₹2999'}
            </h3>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-[760px]">
            <motion.button
              variants={fadeInUp}
              onClick={onBack}
              className="flex items-center gap-2 text-[#D6C0A6] hover:text-[#FBFBF9] transition-colors mb-8 text-sm"
              data-testid="back-to-programs"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </motion.button>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <IconComp className="w-5 h-5 text-[#D6C0A6]" />
              <span className="text-xs uppercase tracking-[0.35em] text-[#D6C0A6]">{program.level} Level</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-['Playfair_Display'] text-[40px] sm:text-[46px] md:text-[60px] lg:text-[70px] leading-[0.92] tracking-[-0.03em] text-[#FBFBF9] mb-6 max-w-[1200px] whitespace-normal md:whitespace-nowrap"
            >
              {program.name}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[#D6D3D1] mb-6 max-w-[620px]">
              {program.tagline}
            </motion.p>

            <motion.div variants={fadeInUp} className="md:hidden mb-8 flex items-end justify-between gap-6">
              <p className="text-[#D6C0A6] uppercase tracking-[0.32em] text-[10px]">Program Price</p>
              <p className="font-['Playfair_Display'] text-[#FBFBF9] text-4xl leading-none">
                {program.price || '₹2999'}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
              <span className="px-4 py-2 border border-white/20 text-[#E7E5E4] text-sm backdrop-blur-sm">{program.duration}</span>
              <span className="px-4 py-2 border border-white/20 text-[#E7E5E4] text-sm backdrop-blur-sm">{program.sessions}</span>
              {program.setting && (
                <span className="px-4 py-2 border border-white/20 text-[#E7E5E4] text-sm backdrop-blur-sm">{program.setting}</span>
              )}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a href={program.programLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#D6C0A6] text-[#1C1917] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#FBFBF9] transition-all duration-300" data-testid="detail-start-btn">
                  Start Program
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-[#F5F0E8]" data-testid="program-faq">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Questions</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">Frequently Asked</motion.h2>
          </motion.div>
          <div>
            {faq.map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-24 md:py-32 bg-[#FBFBF9] border-t border-[#E7E5E4]" data-testid="program-download-app">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <Smartphone className="w-5 h-5 text-[#D6C0A6]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#57534E]">Train Anywhere</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-6">
                Download Our App
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-4">
                Your entire training program, right in your pocket. Follow structured workouts, watch demo videos, track your progress, and stay connected with your coach — all from one app.
              </motion.p>
              <motion.ul variants={fadeInUp} className="space-y-3 mb-8">
                {['Personalised training programs', 'Demo videos & coaching cues', 'Progress tracking & notes', 'Upload videos for feedback'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#57534E]">
                    <div className="w-5 h-5 bg-[#1C1917] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#D6C0A6]" />
                    </div>
                    {item}
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={fadeInUp}>
                <a href="https://links.spur.fit/r/pY/sunpreet-singh" target="_blank" rel="noopener noreferrer" data-testid="select-program-link">
                  <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300">
                    Select Program <ArrowRight className="w-4 h-4 ml-3" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-64 md:w-72">
                <div className="bg-[#1C1917] rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-[#2d2a26] rounded-[2rem] overflow-hidden aspect-[9/19] relative">
                    <img src="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/224f3x36_eaa4b4d6-67e2-4a8f-9408-bb0c06230f8e.jpeg" alt="Move with Sunpreet" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="font-['Playfair_Display'] text-lg text-[#FBFBF9] mb-1">Move with Sunpreet</p>
                      <p className="text-[10px] text-[#A8A29E] uppercase tracking-[0.2em] mb-4">Coaching App</p>
                      <div className="w-full space-y-1.5">
                        {["Today's Workout", 'Demo Videos', 'Track Progress', 'Message Coach'].map((item, i) => (
                          <div key={i} className="bg-[#1C1917]/80 backdrop-blur-sm py-2 px-3 text-left">
                            <p className="text-[#FBFBF9] text-[11px]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="program-final-cta">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-6">
              Ready to Start?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#1C1917]/70 max-w-xl mx-auto mb-10">
              Stop guessing. Start progressing. Your structured path to real strength and mobility begins here.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a href={program.programLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all" data-testid="final-start-btn">
                  Start {program.name.split('—')[1]?.trim() || 'Program'} <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function TrainingProgramsPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [aidModalOpen, setAidModalOpen] = useState(false);
  const { data: cmsPrograms } = useContent('programs', []);

  const programs = useMemo(() => {
    const cmsList = Array.isArray(cmsPrograms) ? cmsPrograms : [];
    const cmsById = Object.fromEntries(cmsList.map(p => [p.id, p]));
    const merged = STATIC_PROGRAMS.map(s => ({ ...s, ...(cmsById[s.id] || {}) }));
    cmsList.forEach(c => {
      if (!STATIC_PROGRAMS.some(s => s.id === c.id)) merged.push(c);
    });
    return merged.filter(p => !['draft', 'archived'].includes(p.status));
  }, [cmsPrograms]);

  const selectedProgram = programId ? programs.find(p => p.id === programId) : null;

  useEffect(() => {
    const handleNavReset = () => navigate('/programs');
    window.addEventListener('nav-reset', handleNavReset);
    return () => window.removeEventListener('nav-reset', handleNavReset);
  }, [navigate]);

  if (programId && selectedProgram) {
    return <ProgramDetail program={selectedProgram} onBack={() => { navigate('/programs'); window.scrollTo(0, 0); }} />;
  }
  if (programId && !selectedProgram && cmsPrograms !== null) {
    // Unknown programId — redirect to listing
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-[#FBFBF9]">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1917] mb-4">Program Not Found</h1>
          <Link to="/programs">
            <Button className="bg-[#1C1917] text-[#FBFBF9] rounded-none h-12 px-8 text-sm uppercase tracking-wider">Back to Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero — Full Height */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1C1917]" data-testid="programs-hero">
        <div className="absolute inset-0 z-0">
          <img
            src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/jf16dc4c_IMG_7722.JPG.jpeg"
            alt="Sunpreet performing a deep bridge"
            className="w-full h-full object-cover object-[61%_8%] md:object-center scale-100 md:scale-110 contrast-125"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#1C1917]/80 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent z-[1]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center w-full py-24">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-6">
              Strong & Mobile
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl text-[#FBFBF9] mb-8 leading-[0.95]" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
              Training Programs
            </motion.h1>

            <motion.p variants={fadeInUp} className="font-['Playfair_Display'] text-lg md:text-xl italic text-[#D6C0A6] max-w-xl mx-auto">
              &quot;It was week by week that I could see the improvements, and I was genuinely amazed by the progress.&quot;
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Level */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="programs-listing">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Your Journey Starts Here</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917]">Choose Your Level</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {programs.filter(p => p.id !== 'foundations').map((program, index) => {
              const isLeft = index === 0;
              const fallbackBullets = program.id === 'beginner'
                ? [
                    '4 training sessions per week',
                    '40–60 minute workouts',
                    'Build foundational strength & body control',
                    'First pull-up, handstand foundations, pistol squats',
                    'Mobility & splits included',
                  ]
                : [
                    '4 training sessions per week',
                    '60–90 minute workouts',
                    'Requires push-up & pull-up strength base',
                    'Advanced strength progressions',
                    'Handstands, mobility & splits',
                  ];
              const bullets = (program.bullets && program.bullets.length) ? program.bullets : fallbackBullets;
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  whileHover={{ y: -6 }}
                  className="bg-[#1C1917] relative overflow-hidden group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_40px_90px_-20px_rgba(28,25,23,0.45)] transition-all duration-500"
                  data-testid={`program-card-${program.id}`}
                >
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#D6C0A6] z-20 transition-all duration-500 group-hover:w-16 group-hover:h-16" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#D6C0A6] z-20 transition-all duration-500 group-hover:w-16 group-hover:h-16" />

                  <div className="relative" style={{ isolation: 'isolate' }}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#2d2a26]">
                      <img
                        src={program.image}
                        alt={program.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        style={{ objectPosition: program.id === 'beginner' ? '70% 25%' : 'center 30%' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-[#1C1917]/10" />

                      <div className="absolute top-5 left-6 right-6 flex items-start justify-between">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6C0A6] font-medium">
                          {isLeft ? 'Start Your Journey' : 'Continue Your Progress'}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#FBFBF9]/80 bg-black/40 backdrop-blur-sm px-3 py-1 border border-[#FBFBF9]/20">
                          {program.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="w-10 h-px bg-[#D6C0A6] mb-3 transition-all duration-500 group-hover:w-16" />
                        <h3 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-1 leading-none">
                          {program.level}
                        </h3>
                        <p className="text-[#D6C0A6]/90 text-sm italic font-['Playfair_Display']">
                          {program.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-4 bg-[#1C1917]">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6C0A6]">What&apos;s Included</p>
                    <div className="space-y-2.5">
                      {bullets.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-4 h-4 border border-[#D6C0A6]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-[#D6C0A6]" strokeWidth={2.5} />
                          </div>
                          <p className="text-[#D6D3D1] text-sm leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-5 mt-1">
                      <div className="space-y-2.5">
                        <a href={program.programLink} target="_blank" rel="noopener noreferrer">
                          <Button
                            className="w-full bg-[#D6C0A6] text-[#1C1917] h-14 py-3.5 text-xs rounded-none hover:bg-[#FBFBF9] transition-all duration-300 group/btn flex items-center justify-between px-5"
                            data-testid={`start-program-${program.id}`}
                          >
                            <span className="font-['Playfair_Display'] text-[#1C1917] text-xl leading-none">{program.price || '₹2999'}</span>
                            <div className="w-px h-5 bg-[#1C1917]/20" />
                            <span className="uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                              Start Program
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </span>
                          </Button>
                        </a>
                        <button
                          onClick={() => { navigate(`/programs/${program.id}`); window.scrollTo(0, 0); }}
                          className="w-full text-[10px] uppercase tracking-[0.3em] text-[#A8A29E] hover:text-[#D6C0A6] transition-colors text-center py-2"
                          data-testid={`view-details-${program.id}`}
                        >
                          View Full Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Foundational link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-[#57534E] text-sm">
              Completely new to training?{' '}
              <button
                onClick={() => window.open('https://links.spur.fit/r/qh/sunpreet-singh/strong-n-mobile--foundational', '_blank')}
                className="text-[#D6C0A6] underline hover:text-[#1C1917] transition-colors"
                data-testid="beginner-link"
              >
                Start with the Foundational Program
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results Speak — Students Who Showed Up */}
      <section className="py-24 md:py-32 bg-[#292524] relative overflow-hidden" data-testid="programs-transformations">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D6C0A6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">Results Speak</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#FBFBF9] font-bold">
              Everyone Here Started Somewhere
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-sm mt-4">
              Swipe to meet them &rarr;
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <ProgramsTransformationCarousel />
          </motion.div>
        </div>
      </section>

      {/* Thoughtfully Designed Learning Library */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="learning-library">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Your Video Guide</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#1C1917] mb-4">
              Thoughtfully Designed Learning Library
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#57534E] max-w-2xl mx-auto">
              In-depth video tutorials focused on refining technique, supporting steady progress, and creating real results.
            </motion.p>
          </motion.div>
          <LibraryShowcase />
        </div>
      </section>

      {/* My Approach */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="why-structured">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">The Approach</motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-8">
                Over the Last Decade
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                {[
                  'Rebuilt my body by slowing things down and focusing on how I move',
                  'Developed a system built around strength, mobility, and control',
                  'Helped hundreds of people do the same',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#D6C0A6] rounded-full mt-2.5 flex-shrink-0" />
                    <p className="text-[#FBFBF9] leading-relaxed">{point}</p>
                  </div>
                ))}
              </motion.div>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-4">
                Now, moving well is my top priority. I&apos;m not interested in choosing between strength and flexibility. Going all in on one comes with limitations — but combining both allows me to stay strong, mobile, and pain-free.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-4">
                I still build strength, but I also move freely. My body feels good, my joints feel supported, and I know I&apos;m training in a way I can sustain for years to come.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#D6C0A6] font-medium italic">
                These training programs bring the same system to you.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/5] overflow-hidden"
            >
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/s58nuuh0_IMG_6482.MOV" type="video/quicktime" />
                <source src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/s58nuuh0_IMG_6482.MOV" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="listing-download-app">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center order-2 lg:order-1">
              <div className="relative w-60 md:w-68">
                <div className="bg-[#1C1917] rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-[#2d2a26] rounded-[2rem] overflow-hidden aspect-[9/19] relative">
                    <img src="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/224f3x36_eaa4b4d6-67e2-4a8f-9408-bb0c06230f8e.jpeg" alt="Move with Sunpreet" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="font-['Playfair_Display'] text-lg text-[#FBFBF9] mb-1">Move with Sunpreet</p>
                      <p className="text-[10px] text-[#A8A29E] uppercase tracking-[0.2em] mb-4">Coaching App</p>
                      <div className="w-full space-y-1.5">
                        {["Today's Workout", 'Demo Videos', 'Track Progress', 'Message Coach'].map((item, i) => (
                          <div key={i} className="bg-[#1C1917]/80 backdrop-blur-sm py-2 px-3 text-left">
                            <p className="text-[#FBFBF9] text-[11px]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="order-1 lg:order-2">
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <Smartphone className="w-5 h-5 text-[#D6C0A6]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#57534E]">Train Anywhere</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-6">
                Your Program,<br />Right in Your Pocket
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-8">
                Download the coaching app to access your personalised training program, watch demo videos, upload form checks, and stay connected with your coach — all in one place.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <a href="https://links.spur.fit/r/pY/sunpreet-singh" target="_blank" rel="noopener noreferrer" data-testid="listing-select-program-link">
                  <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300">
                    Select Program <ArrowRight className="w-4 h-4 ml-3" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="programs-cta">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-6">
              Not Sure Where to Start?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#1C1917]/70 max-w-xl mx-auto mb-10">
              Pick a program that fits your level — and if pricing is the only thing holding you back, apply for financial aid. We&apos;ve got options.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://links.spur.fit/r/pY/sunpreet-singh" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all" data-testid="programs-select-btn">
                  Select Program <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </a>
              <Button
                onClick={() => setAidModalOpen(true)}
                variant="outline"
                className="border-[#1C1917] text-[#1C1917] h-14 px-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all bg-transparent"
                data-testid="programs-financial-aid-btn"
              >
                Apply for Financial Aid
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FinancialAidModal open={aidModalOpen} onClose={() => setAidModalOpen(false)} />
    </div>
  );
}
