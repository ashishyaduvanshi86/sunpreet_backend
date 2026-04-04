import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, ChevronDown, Dumbbell, Target, Zap, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const programs = [
  {
    id: 'foundations',
    level: 'Foundation',
    name: 'Strong & Mobile — Foundations',
    tagline: 'New to training? This is your starting point.',
    shortDesc: 'Build strength, control, and confidence with simple, effective workouts you can do anywhere — no prior gym experience needed.',
    duration: '6 Weeks',
    sessions: '3x per week · ~30 mins',
    setting: 'Home workouts',
    primaryFocus: ['Push-ups', 'Hanging strength', 'Lower body strength', 'Mobility'],
    icon: Target,
    color: '#D6C0A6',
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/m3estfyl_DSC02319.JPG',
    problem: {
      headline: 'Why Most People Never Build a Strong Foundation',
      points: [
        'You jump straight into advanced moves without mastering the basics',
        'Random YouTube routines leave gaps in your movement patterns',
        'Poor joint preparation leads to frustration and injuries',
        'No structured plan means no measurable progress',
      ]
    },
    overview: {
      headline: 'What You\'ll Build',
      features: [
        'Joint-by-joint mobility preparation',
        'Fundamental movement patterns (push, pull, squat, hinge)',
        'Core stability and body tension',
        'Flexibility foundations for hips, shoulders, and spine',
        'Structured warm-up and cool-down protocols',
        'Weekly progress benchmarks',
      ]
    },
    testimonials: [
      { name: 'Rahul', text: 'I spent 2 years "working out" with no real plan. 4 weeks into Foundations, I could already feel the difference. My shoulders stopped hurting, my squat got deeper, and I actually understood what I was doing for once.' },
      { name: 'Sneha', text: 'As someone who never trained before, this program made movement feel accessible. The progressions were so clear — I never felt lost or overwhelmed.' },
    ],
    faq: [
      { q: 'What equipment do I need?', a: 'This program is designed to be done at home with minimal equipment:\n• Pull-up bar\n• Resistance bands\n• Dumbbells (up to 5kg)\n• A chair/couch/table (for incline push-ups and dips)\n• Yoga mat (optional)' },
      { q: 'How does the program work?', a: 'Once you purchase the program, you\'ll be redirected to the app.\n• Select your start date\n• Open the app and go to "Today\'s Workout"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 8-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime.' },
      { q: 'How many days per week is the program?', a: '• 3 days per week\n• Default schedule: Monday, Wednesday, Friday\n• You can adjust it based on your routine' },
      { q: 'Are legs included?', a: 'Yes. Workouts follow a full-body approach, which is the most effective way to build overall strength as a beginner.' },
      { q: 'How long are the workouts?', a: 'Workouts typically take 25–45 minutes. Each session is designed to be around 30 minutes, but this may vary depending on:\n• Your pace\n• Rest time\n• Time spent watching tutorials' },
      { q: 'How can I get support during the program?', a: '• You\'ll get access to a Telegram group for support and guidance\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com' },
      { q: 'What happens after 8 weeks?', a: 'Once you complete the program, you\'ll be guided to the next progression level inside the app.' },
    ]
  },
  {
    id: 'beginner',
    level: 'Beginner',
    name: 'Strong & Mobile — Beginner',
    tagline: 'Ready to level up from the basics?',
    shortDesc: 'Build real strength and start working towards your first pull-up, better push-ups, and foundational calisthenics skills.',
    duration: '8 Weeks',
    sessions: '4x per week · 60–75 mins',
    setting: 'Gym setup required',
    primaryFocus: ['Pull-ups (progressions)', 'Push strength', 'Full-body strength', 'Mobility & flexibility'],
    icon: Dumbbell,
    color: '#A8A29E',
    image: 'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/qmrid5pu_IMG_5232.jpeg',
    problem: {
      headline: 'Why Progress Stalls After the Basics',
      points: [
        'You\'ve built some baseline but don\'t know what comes next',
        'Movements feel stiff — you lack the mobility to perform skills properly',
        'Training is inconsistent because there\'s no clear roadmap',
        'You plateau quickly without structured progressive overload',
      ]
    },
    overview: {
      headline: 'What You\'ll Develop',
      features: [
        'Handstand wall drills and progressions',
        'Loaded mobility work (bridges, deep squats)',
        'Pull-up and dip progressions with form mastery',
        'Active flexibility for splits and pike',
        'Skill-specific strength training',
        'Weekly live group sessions for feedback',
      ]
    },
    testimonials: [
      { name: 'Vikram', text: 'I could barely hold a wall handstand for 10 seconds when I started. By week 8, I was doing 30-second holds and starting to balance freestanding. The structured approach is everything.' },
      { name: 'Ananya', text: 'This program gave me a clear path. Every week I could see and feel progress — my bridge got deeper, my L-sit got longer, and I finally got my first pull-up.' },
    ],
    faq: [
      { q: 'What equipment do I need?', a: 'This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Light weights (for lower body mobility & overhead work)\n• Chalk (optional)\n\nYou can adapt the program for home if you have access to most of the above.' },
      { q: 'What if I\'m completely new to working out?', a: 'If you\'re just starting out, it\'s recommended to begin with the Foundation Program first.' },
      { q: 'How do I know if I\'m a beginner?', a: 'This program is for you if:\n• You\'re working towards your first pull-up\n• You\'re building strength in push-ups\n• You\'re starting mobility work (splits, backbends)\n• You want to build a base for handstands and calisthenics skills\n\nEven if you can\'t do a pull-up yet, this program is designed to help you get there.' },
      { q: 'How does the program work?', a: 'Once you purchase the program, you\'ll be redirected to the app.\n• Select your start date\n• Open the app and go to "Today\'s Workout"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 8-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime.' },
      { q: 'How many days per week is the program?', a: '• 4 days per week\n• Each session lasts 60–75 minutes' },
      { q: 'Do I need to be flexible?', a: 'No.\nYou don\'t need to be flexible to start — your flexibility will improve as you follow the program.' },
      { q: 'Are legs included?', a: 'Yes.\nThe program includes lower-body strength, mobility, and flexibility training.' },
      { q: 'How long do I have access to the program?', a: 'You will have 12 weeks to complete the 8-week program.' },
      { q: 'What if I don\'t achieve pull-ups or splits in 8 weeks?', a: 'Progress depends on your starting point and consistency.\nYou may not master every skill in 8 weeks, but you will build a strong foundation and make measurable progress.' },
      { q: 'How can I get support during the program?', a: '• You\'ll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com' },
      { q: 'What happens after 8 weeks?', a: 'Once you complete the program, you\'ll be guided to the next progression level inside the app.' },
    ]
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    name: 'Strong & Mobile — Intermediate',
    tagline: 'Already have a base? Time to push further.',
    shortDesc: 'Increase strength, refine control, and progress towards advanced calisthenics skills like handstands and higher pull-up capacity.',
    duration: '8 Weeks',
    sessions: '4x per week · ~90 mins',
    setting: 'Gym setup required',
    primaryFocus: ['Pull-up strength & volume', 'Advanced push strength', 'Skill work', 'Mobility'],
    icon: Zap,
    color: '#78716C',
    image: 'https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/3ite2ww5_s.jpg',
    problem: {
      headline: 'Why Intermediate Athletes Get Stuck',
      points: [
        'You\'ve been training for a while but can\'t break past skill plateaus',
        'Your strength is there but movement quality is inconsistent',
        'Without periodization, your body can\'t recover from higher intensity work',
        'You need specific programming for advanced positions and transitions',
      ]
    },
    overview: {
      headline: 'What You\'ll Master',
      features: [
        'Freestanding handstand balance and shapes',
        'Muscle-up progressions (bar and ring)',
        'Full front splits and deep pancake',
        'Advanced bridge work and backbend conditioning',
        'Planche and front lever entry progressions',
        'Periodized training with deload weeks',
      ]
    },
    testimonials: [
      { name: 'Arjun', text: 'After a year of random handstand training, I was stuck. 8 weeks into Intermediate, I held my first 10-second freestanding handstand. The programming targets exactly what holds you back.' },
      { name: 'Diya', text: 'The structured periodization was a game-changer. I stopped getting injuries, my recovery improved, and I finally hit my front splits after months of plateau.' },
    ],
    faq: [
      { q: 'What equipment do I need?', a: 'This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Weights (for lower body and overhead work)\n• Chalk (optional)' },
      { q: 'What if I\'m completely new to working out?', a: 'If you\'re just starting out, begin with the Foundation Program first.' },
      { q: 'How do I know if I\'m intermediate?', a: 'This program is for you if:\n• You can already perform pull-ups and are working on increasing reps\n• You have a solid base in push-ups and bodyweight strength\n• You are working on mobility (splits, backbends)\n• You want to progress towards handstands and advanced skills' },
      { q: 'How does the program work?', a: 'Once you purchase the program, you\'ll be redirected to the app.\n• Select your start date\n• Open the app and go to "Today\'s Workout"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 8-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime.' },
      { q: 'How many days per week is the program?', a: '• 4 days per week\n• Each session lasts around 90 minutes' },
      { q: 'Do I need to be flexible?', a: 'No.\nYour mobility will continue to improve as you follow the program.' },
      { q: 'How long do I have access to the program?', a: 'You will have 12 weeks to complete the 8-week program.' },
      { q: 'How can I get support during the program?', a: '• You\'ll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com' },
      { q: 'What happens after 8 weeks?', a: 'Once you complete the program, you\'ll be guided to the next progression level inside the app.' },
    ]
  }
];

const tabs = ['All', 'Foundation', 'Beginner', 'Intermediate'];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E7E5E4]">
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
  const IconComp = program.icon;
  return (
    <div className="pt-20">
      {/* Detail Hero */}
      <section className="relative py-24 md:py-36 bg-[#1C1917]" data-testid={`program-detail-hero-${program.id}`}>
        <div className="absolute inset-0 opacity-30">
          <img src={program.image} alt={program.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/50 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.button
              variants={fadeInUp}
              onClick={onBack}
              className="flex items-center gap-2 text-[#A8A29E] hover:text-[#D6C0A6] transition-colors mb-8 text-sm"
              data-testid="back-to-programs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Programs
            </motion.button>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <IconComp className="w-5 h-5 text-[#D6C0A6]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6]">{program.level} Level</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl text-[#FBFBF9] mb-4 max-w-3xl">
              {program.name}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-[#A8A29E] max-w-2xl mb-8">
              {program.tagline}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 text-sm text-[#A8A29E] mb-10">
              <span className="px-3 py-1 border border-[#A8A29E]/30">{program.duration}</span>
              <span className="px-3 py-1 border border-[#A8A29E]/30">{program.sessions}</span>
              {program.setting && <span className="px-3 py-1 border border-[#A8A29E]/30">{program.setting}</span>}
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/contact">
                <Button className="bg-[#D6C0A6] text-[#1C1917] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#FBFBF9] transition-all duration-300" data-testid="detail-start-btn">
                  Start Program <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="program-problem">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">The Problem</motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-8">
                {program.problem.headline}
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-5">
                {program.problem.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-[#D6C0A6] rounded-full mt-2.5 flex-shrink-0" />
                    <p className="text-[#57534E] leading-relaxed">{point}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#1C1917] p-10 md:p-14"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-6">The Solution</p>
              <h3 className="font-['Playfair_Display'] text-2xl text-[#FBFBF9] mb-4">{program.name}</h3>
              <p className="text-[#A8A29E] leading-relaxed mb-6">
                A structured, progressive program that eliminates guesswork and gives you a clear path to real results.
              </p>
              <div className="flex items-center gap-6 text-sm text-[#A8A29E]">
                <span>{program.duration}</span>
                <span className="text-[#D6C0A6]">|</span>
                <span>{program.sessions}</span>
              </div>
              {program.primaryFocus && (
                <div className="mt-6 pt-6 border-t border-[#2d2a26]">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-3">Primary Focus</p>
                  <p className="text-[#FBFBF9] text-sm">{program.primaryFocus.join(' • ')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="program-overview">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Program Overview</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">{program.overview.headline}</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {program.overview.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white p-6 border border-[#E7E5E4]"
              >
                <div className="w-8 h-8 bg-[#1C1917] flex items-center justify-center mb-4">
                  <Check className="w-4 h-4 text-[#D6C0A6]" />
                </div>
                <p className="text-[#1C1917] font-medium text-sm">{feature}</p>
              </motion.div>
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
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 max-w-sm">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" data-testid="app-store-link">
                  <div className="flex items-center gap-2 bg-[#1C1917] text-[#FBFBF9] px-3 sm:px-5 py-3 hover:bg-[#1C1917]/90 transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-5 sm:w-7 h-5 sm:h-7 fill-current flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div>
                      <p className="text-[8px] sm:text-[10px] leading-none opacity-70">Download on the</p>
                      <p className="text-xs sm:text-base font-medium leading-tight">App Store</p>
                    </div>
                  </div>
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" data-testid="play-store-link">
                  <div className="flex items-center gap-2 bg-[#1C1917] text-[#FBFBF9] px-3 sm:px-5 py-3 hover:bg-[#1C1917]/90 transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-5 sm:w-7 h-5 sm:h-7 fill-current flex-shrink-0"><path d="M3.18 23.67c-.37-.2-.55-.57-.55-1.02V1.35c0-.45.18-.82.55-1.02l11.07 11.67L3.18 23.67zM15.72 13.53l2.82 1.63-3.5 2.01-2.07-2.18 2.75-1.46zm3.5-3.32L15.72 12l-2.75-1.46 2.07-2.18 4.18 1.85zM5.07.26l10.16 10.7L5.07.26l9.6 10.13L5.07.26z"/><path d="M14.25 12L5.07.26c-.19-.11-.39-.2-.6-.24L15.72 12l-1.47 0zM5.07 23.74l9.18-9.74 1.47 0L4.47 23.98c.21-.04.41-.13.6-.24z"/><path d="M20.16 10.91l-2.94 1.62L15.72 12l1.5-1.53 2.94 1.44zM17.22 13.47l2.94 1.44-2.94 1.62-1.5-1.53 1.5-1.53z"/></svg>
                    <div>
                      <p className="text-[8px] sm:text-[10px] leading-none opacity-70">Get it on</p>
                      <p className="text-xs sm:text-base font-medium leading-tight">Google Play</p>
                    </div>
                  </div>
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
                        {['Today\'s Workout', 'Demo Videos', 'Track Progress', 'Message Coach'].map((item, i) => (
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

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="program-testimonials">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">Real Results</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9]">What Students Say</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {program.testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="border border-[#2d2a26] p-8"
              >
                <p className="text-[#A8A29E] leading-relaxed italic mb-6">"{t.text}"</p>
                <p className="text-[#D6C0A6] font-medium">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="program-faq">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Questions</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">Frequently Asked</motion.h2>
          </motion.div>
          <div>
            {program.faq.map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
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
              <Link to="/contact">
                <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all" data-testid="final-start-btn">
                  Start {program.name.split('—')[1]?.trim() || 'Program'} <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function TrainingProgramsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const handleNavReset = () => setSelectedProgram(null);
    window.addEventListener('nav-reset', handleNavReset);
    return () => window.removeEventListener('nav-reset', handleNavReset);
  }, []);

  const filtered = activeTab === 'All' ? programs : programs.filter(p => p.level === activeTab);

  if (selectedProgram) {
    return <ProgramDetail program={selectedProgram} onBack={() => { setSelectedProgram(null); window.scrollTo(0, 0); }} />;
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 md:py-36 bg-[#1C1917]" data-testid="programs-hero">
        <div className="absolute inset-0 opacity-40 overflow-hidden">
          <img
            src="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/yxup5go5_IMG_8920.JPG.jpeg"
            alt="Training background"
            className="w-full h-full object-cover scale-110 contrast-125"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/50 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-6">
              Strong & Mobile
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FBFBF9] mb-6">
              Training Programs
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-[#A8A29E] max-w-2xl mx-auto">
              Whether you want your first pull-up, better mobility, or stronger basics — I've got you covered.
              Choose from a growing range of calisthenics programs, from foundation to intermediate (advanced coming soon).
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tabs + Programs */}
      <section className="py-20 md:py-28 bg-[#FBFBF9]" data-testid="programs-listing">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="flex gap-0.5 p-1 bg-[#F5F5F4] border border-[#E7E5E4] overflow-x-auto max-w-full">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-8 py-3 text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? 'bg-[#1C1917] text-[#FBFBF9]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                  data-testid={`tab-${tab.toLowerCase()}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Program Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((program, index) => {
                const IconComp = program.icon;
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer bg-white border border-[#E7E5E4] hover:border-[#D6C0A6] transition-all duration-500 flex flex-col"
                    onClick={() => { setSelectedProgram(program); window.scrollTo(0, 0); }}
                    data-testid={`program-card-${program.id}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={program.image} alt={program.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-[#1C1917]/80 text-[#FBFBF9] text-xs uppercase tracking-[0.15em]">
                          {program.level}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[#D6C0A6] mb-3 flex-wrap">
                        <IconComp className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em]">{program.duration} · {program.sessions}</span>
                        {program.setting && <span className="text-xs uppercase tracking-[0.2em] px-2 py-0.5 border border-[#D6C0A6]/40">{program.setting}</span>}
                      </div>
                      <h3 className="font-['Playfair_Display'] text-xl md:text-2xl text-[#1C1917] mb-3 group-hover:text-[#57534E] transition-colors">
                        {program.name}
                      </h3>
                      <p className="text-[#57534E] text-sm leading-relaxed mb-6 flex-1 whitespace-pre-line">{program.shortDesc}</p>
                      <Button
                        className="w-full bg-[#1C1917] text-[#FBFBF9] h-12 text-xs uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300"
                        data-testid={`start-program-${program.id}`}
                      >
                        Start Program <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

        {/* Program Start Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="inline-block text-sm text-[#57534E] border border-[#D6C0A6] px-6 py-3 bg-[#F5F5F4]">
            📅 <span className="font-medium text-[#1C1917]">Note:</span> The next program batch starts from <span className="font-medium text-[#1C1917]">7th April</span>
          </p>
        </motion.div>

        </div>
      </section>

      {/* My Approach */}

      

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
                Now, moving well is my top priority. I'm not interested in choosing between strength and flexibility. Going all in on one comes with limitations — but combining both allows me to stay strong, mobile, and pain-free.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed mb-4">
                I still build strength, but I also move freely. My body feels good, my joints feel supported, and I know I'm training in a way I can sustain for years to come.
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
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/s58nuuh0_IMG_6482.MOV" type="video/quicktime" />
                <source src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/s58nuuh0_IMG_6482.MOV" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download App - Listing */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="listing-download-app">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center order-2 lg:order-1"
            >
              <div className="relative w-60 md:w-68">
                <div className="bg-[#1C1917] rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-[#2d2a26] rounded-[2rem] overflow-hidden aspect-[9/19] relative">
                    <img src="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/224f3x36_eaa4b4d6-67e2-4a8f-9408-bb0c06230f8e.jpeg" alt="Move with Sunpreet" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="font-['Playfair_Display'] text-lg text-[#FBFBF9] mb-1">Move with Sunpreet</p>
                      <p className="text-[10px] text-[#A8A29E] uppercase tracking-[0.2em] mb-4">Coaching App</p>
                      <div className="w-full space-y-1.5">
                        {['Today\'s Workout', 'Demo Videos', 'Track Progress', 'Message Coach'].map((item, i) => (
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
              <motion.div variants={fadeInUp} className="mt-2 mb-6">
  <p className="inline-block text-sm text-[#57534E] border border-[#D6C0A6] px-6 py-3 bg-[#F5F5F4]">
    📅 <span className="font-medium text-[#1C1917]">Note:</span> The next program batch starts from <span className="font-medium text-[#1C1917]">7th April</span>
  </p>
</motion.div>
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 max-w-sm">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" data-testid="listing-app-store-link">
                  <div className="flex items-center gap-2 bg-[#1C1917] text-[#FBFBF9] px-3 sm:px-5 py-3 hover:bg-[#1C1917]/90 transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-5 sm:w-7 h-5 sm:h-7 fill-current flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div>
                      <p className="text-[8px] sm:text-[10px] leading-none opacity-70">Download on the</p>
                      <p className="text-xs sm:text-base font-medium leading-tight">App Store</p>
                    </div>
                  </div>
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" data-testid="listing-play-store-link">
                  <div className="flex items-center gap-2 bg-[#1C1917] text-[#FBFBF9] px-3 sm:px-5 py-3 hover:bg-[#1C1917]/90 transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-5 sm:w-7 h-5 sm:h-7 fill-current flex-shrink-0"><path d="M3.18 23.67c-.37-.2-.55-.57-.55-1.02V1.35c0-.45.18-.82.55-1.02l11.07 11.67L3.18 23.67zM15.72 13.53l2.82 1.63-3.5 2.01-2.07-2.18 2.75-1.46zm3.5-3.32L15.72 12l-2.75-1.46 2.07-2.18 4.18 1.85zM5.07.26l10.16 10.7L5.07.26l9.6 10.13L5.07.26z"/><path d="M14.25 12L5.07.26c-.19-.11-.39-.2-.6-.24L15.72 12l-1.47 0zM5.07 23.74l9.18-9.74 1.47 0L4.47 23.98c.21-.04.41-.13.6-.24z"/><path d="M20.16 10.91l-2.94 1.62L15.72 12l1.5-1.53 2.94 1.44zM17.22 13.47l2.94 1.44-2.94 1.62-1.5-1.53 1.5-1.53z"/></svg>
                    <div>
                      <p className="text-[8px] sm:text-[10px] leading-none opacity-70">Get it on</p>
                      <p className="text-xs sm:text-base font-medium leading-tight">Google Play</p>
                    </div>
                  </div>
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
              Book a free consultation call and we'll help you choose the right program based on your goals and experience level.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/contact">
                <Button className="bg-[#1C1917] text-[#FBFBF9] h-14 px-12 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all" data-testid="programs-consult-btn">
                  Book a Free Consultation <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
