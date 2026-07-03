import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Video, MessageSquare, Users, X } from 'lucide-react';
import { Button } from '../components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const includedFeatures = [
  'Personalised training program',
  'Demo videos and coaching cues',
  'Video feedback system',
  'Progress tracking',
  'Access to weekly live mobility sessions',
];

const feedbackImages = [
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/0u6pph42_WhatsApp%20Image%202026-03-22%20at%2012.10.52%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/4re1n98j_WhatsApp%20Image%202026-03-22%20at%2012.10.51%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/xkmz24wv_WhatsApp%20Image%202026-03-22%20at%2012.10.53%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/4rr3i390_WhatsApp%20Image%202026-03-22%20at%2012.10.50%20PM%20%283%29.jpeg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/2yuukozl_WhatsApp%20Image%202026-03-22%20at%2012.10.52%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/oavh2lpe_WhatsApp%20Image%202026-03-22%20at%2012.10.51%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/zsjhnirl_WhatsApp%20Image%202026-03-22%20at%2012.10.52%20PM%20%282%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/mrhjo1vy_WhatsApp%20Image%202026-03-22%20at%2012.10.51%20PM%20%282%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/1znqnsvl_WhatsApp%20Image%202026-03-22%20at%2012.10.50%20PM%20%282%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/7tb0195c_WhatsApp%20Image%202026-03-22%20at%2012.10.50%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/hug535vf_WhatsApp%20Image%202026-03-22%20at%2012.10.50%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/h23eqdh6_WhatsApp%20Image%202026-03-22%20at%2012.10.49%20PM%20%282%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/epkty47w_WhatsApp%20Image%202026-03-22%20at%2012.10.49%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/lqu4zvqz_WhatsApp%20Image%202026-03-22%20at%2012.10.49%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/lwz619cv_WhatsApp%20Image%202026-03-22%20at%2012.10.48%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/amap78d9_WhatsApp%20Image%202026-03-22%20at%2012.10.48%20PM.jpeg',
];

const cardRotations = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2];

export default function CoachingPage() {
  const [lightboxImg, setLightboxImg] = useState(null);
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-[#1C1917]" data-testid="coaching-hero">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/yzt8zl9f_IMG_5708.JPG.jpeg"
            alt="Sunpreet coaching"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
              1:1 Online Coaching
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl text-[#FBFBF9] mb-6">
              Step-by-Step Progressions
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-[#A8A29E] leading-relaxed mb-6">
              Master skills you once thought were impossible — regardless of your starting point.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] leading-relaxed">
              Your training is built through personalised programming that meets you where you are and
              guides you forward with clarity. Each progression is structured to help you build strength,
              control, and confidence step by step.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#D6C0A6] italic mt-6">
              No guesswork. No randomness. Just intentional progress.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <Link to="/contact">
                <Button
                  data-testid="hero-apply-btn"
                  className="bg-[#FBFBF9] text-[#1C1917] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] transition-all duration-300 btn-magnetic"
                >
                  Apply for Coaching
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="coaching-how-it-works">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">
              The Process
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">
              How It Works
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {[
              {
                step: '01',
                title: 'Fill the Training Form',
                desc: 'Begin by completing a detailed form covering your goals, training background, and movement history.',
              },
              {
                step: '02',
                title: 'Complete the Assessment',
                desc: 'A structured assessment to evaluate your current level of strength, mobility, and movement quality.',
              },
              {
                step: '03',
                title: 'Connect Over a Zoom Call',
                desc: 'An online video call to discuss your assessment results, set clear goals, and create a roadmap forward.',
              },
              {
                step: '04',
                title: 'Train Using Your Personalised Coaching App',
                desc: 'Your complete training ecosystem with everything you need to progress.',
                details: [
                  'Personalised training videos',
                  'Video feedback from coach',
                  'Progress tracking',
                  'Live group sessions',
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <span className="step-number">{item.step}</span>
                <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mt-4 mb-3">{item.title}</h3>
                {item.details ? (
                  <ul className="space-y-2 text-[#57534E] text-sm leading-relaxed">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#D6C0A6] mt-0.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#57534E] text-sm leading-relaxed">{item.desc}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="coaching-benefits">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/wyoaledi_IMG_2224.JPG.jpeg"
                  alt="Coaching in action"
                  className="w-full h-full object-cover img-organic"
                />
              </div>
            </motion.div>

            {/* Right - Content */}
            <div className="flex flex-col gap-12">
              {/* Weekly Live Sessions */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-[#D6C0A6]" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">
                    Weekly Live Group Mobility & Handstand Sessions
                  </h3>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-3">
                  Join weekly live group sessions designed to support your progress and refine your practice.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed">
                  Receive real-time coaching, feedback, and guidance to ensure consistent improvement.
                  You're supported every step of the way.
                </motion.p>
              </motion.div>

              {/* Two-Way Communication */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#D6C0A6]" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">
                    Two-Way Communication About Your Program
                  </h3>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-3">
                  Your input allows precise adjustments, ensuring consistent and long-term progress.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed">
                  You can share notes, upload videos, and receive feedback. Your program evolves with you.
                </motion.p>
              </motion.div>

              {/* Video Coaching */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                  <Video className="w-6 h-6 text-[#D6C0A6]" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">
                    Can a Coach Really Teach You Through Video?
                  </h3>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-3">
                  It's a fair question. If you've only trained in person, it's hard to imagine achieving the same results online.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-3">
                  But video coaching often works better.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed">
                  Your videos are analysed in detail, and you receive precise feedback you can revisit
                  anytime — helping you build correct movement patterns faster.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="coaching-pricing">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">
              Investment
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9]">
              Pricing
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#2d2a26] p-8"
            >
              <h3 className="font-['Playfair_Display'] text-2xl text-[#FBFBF9] mb-2">2 Months (8 Weeks) Coaching</h3>
              <p className="font-['Playfair_Display'] text-4xl text-[#D6C0A6] mb-6">&#8377;24,000 <span className="text-base text-[#A8A29E]">INR</span></p>
              <p className="text-[#A8A29E] text-sm leading-relaxed">Ideal for getting started with personalised programming and building your foundation.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#D6C0A6] p-8"
            >
              <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-2">6 Months (24 Weeks) Coaching</h3>
              <p className="font-['Playfair_Display'] text-4xl text-[#1C1917] mb-6">&#8377;60,000 <span className="text-base text-[#1C1917]/60">INR</span></p>
              <p className="text-[#1C1917]/70 text-sm leading-relaxed">Best value for committed students looking for deep transformation and long-term progress.</p>
            </motion.div>
          </div>

          {/* What's Included */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto mt-16"
          >
            <motion.h3 variants={fadeInUp} className="font-['Playfair_Display'] text-2xl text-[#FBFBF9] mb-8 text-center">
              What's Included
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {includedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 bg-[#D6C0A6] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#1C1917]" />
                  </div>
                  <span className="text-[#A8A29E] text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="coaching-cta">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#1C1917]/60 mb-4">
              Limited Coaching Spots Available
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-6">
              Ready to Transform?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#1C1917]/70 max-w-2xl mx-auto mb-10">
              If you're ready to build real strength, master new skills, and transform how you move —
              apply for 1:1 Online Coaching.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  data-testid="coaching-apply-btn"
                  className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300 btn-magnetic"
                >
                  Apply for Coaching
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Student Feedback Section */}
      <section className="py-24 md:py-32 bg-[#292524] relative overflow-hidden" data-testid="coaching-feedback">
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
              In Their Words
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#FBFBF9] mb-4">
              Student Feedback
            </motion.h2>
            <motion.div variants={fadeInUp} className="w-16 h-[1px] bg-[#D6C0A6]/40 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {feedbackImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotate: cardRotations[index] }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, scale: 1.03, rotate: 0, transition: { duration: 0.3 } }}
                className="cursor-pointer group"
                onClick={() => setLightboxImg(src)}
                data-testid={`feedback-image-${index}`}
              >
                <div className="bg-white p-3 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_40px_rgba(214,192,166,0.2)] transition-shadow duration-500">
                  <div className="overflow-hidden">
                    <img
                      src={src}
                      alt={`Student feedback ${index + 1}`}
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
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
            data-testid="feedback-lightbox"
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
                onClick={() => setLightboxImg(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                data-testid="feedback-lightbox-close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="bg-white p-3 rounded-sm shadow-2xl">
                <img
                  src={lightboxImg}
                  alt="Student feedback"
                  className="w-full h-auto block max-h-[80vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
