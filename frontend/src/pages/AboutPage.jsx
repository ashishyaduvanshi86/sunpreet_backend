import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="about-hero">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl text-[#1C1917]">
              Hi, I'm Sunpreet.
            </motion.h1>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/hlvzlmf7_WhatsApp%20Image%202026-01-02%20at%208.29.11%20PM.jpeg"
                alt="Sunpreet training"
                className="w-full h-full object-cover img-organic"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/zl4xb8a6_4.JPG"
                alt="Sunpreet handstand"
                className="w-full h-full object-cover img-organic"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/4iz6f8ra_DSC06205.jpg"
                alt="Sunpreet coaching"
                className="w-full h-full object-cover img-organic"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="about-story">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-lg md:text-xl leading-relaxed mb-8">
              My journey started with a simple goal to look good, but it evolved into a mission to develop 
              a practice which is holistic and make us strong and supple. Growing up in Haridwar, I was always 
              curious about what lies beyond the physical, practicing meditation and kriyas from a young age.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-lg md:text-xl leading-relaxed mb-8">
              Driven by the movement philosophy of Ido Portal, I transitioned into fitness as a full-time career 
              in 2017. My background spans a wide range of modalities from Animal Flow, Yoga, Parkour, calisthenics, 
              SnC to Handbalancing. By learning from coaches all over the world to deepen my skills and coaching 
              people of all ages from kids to senior people, I've developed a versatile approach to training.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-lg md:text-xl leading-relaxed mb-8">
              My ultimate goal is simple "to help you move better, regardless of where you are starting from."
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-lg md:text-xl leading-relaxed mb-8">
              Today, my coaching is an integration of everything I've gathered over 15 years. The technicality of SNC, 
              the flexibility of Gymnasts, Mobility of FRC, the art of Handbalancing, and the quiet power of Breathwork. 
              I specialize in rehab and skill acquisition, making the "impossible" feel accessible.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#A8A29E] text-lg md:text-xl leading-relaxed mb-8">
              Whether you're dealing with a stiff body, want to learn your first pull up or aspiring to master a handstand, 
              I focus on laying a foundation that is as strong as it is supple. Forget the shortcuts and rigid systems. 
              Let's use intuition and hard work to rediscover what your body is truly capable of.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-[#D6C0A6] text-xl md:text-2xl font-['Playfair_Display'] italic">
              I will walk alongside you, ensuring my commitment and hard work never fall short of your own 
              as we pursue this together.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="about-philosophy">
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
                  src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/56juxbv5_Handstand.jpg"
                  alt="Movement philosophy"
                  className="w-full h-full object-cover img-organic"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#D6C0A6] p-8 hidden lg:block">
                <p className="font-['Playfair_Display'] text-4xl text-[#1C1917]">9+</p>
                <p className="text-sm text-[#1C1917]/70 mt-1">Years of Dedicated Practice</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">
                Philosophy
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-8">
                A journey of movement, mindfulness, and inner exploration.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-6 text-lg">
                I've always believed in "How we do one thing is how we do everything."
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed mb-6">
                Through a strong body and a calm mind, we move not just for health, but to become better 
                practitioners of life. We learn how to move with precision, but also how to be still. 
                We learn to generate explosive force, but also how to loosen the body when required.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#57534E] leading-relaxed">
                We start with the seen to catch a glimpse of the unseen.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Let's Work Together Section */}
      <section className="py-24 md:py-32 bg-[#1C1917]" data-testid="about-cta">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-[#D6C0A6] italic text-lg mb-4">
              Fitness is not just about the body — it's also about the self.
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#FBFBF9]">
              Let's work Together
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: 'Online Coaching', path: '/coaching', desc: 'Personalized programs delivered remotely' },
              { title: 'Workshop/Retreat', path: '/retreats', desc: 'Immersive multi-day experiences' },
              { title: 'In Person Training', path: '/contact', desc: 'One-on-one sessions in Mumbai' },
            ].map((item, index) => (
              <Link key={index} to={item.path}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-transparent border border-[#3d3a36] p-8 hover:border-[#D6C0A6] transition-all duration-500 h-full"
                  data-testid={`about-cta-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#FBFBF9] mb-3">{item.title}</h3>
                  <p className="text-[#A8A29E] text-sm">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-[#D6C0A6]" data-testid="about-final-cta">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/n4agowhd_Host%201.jpg"
                  alt="Movement journey"
                  className="w-full h-full object-cover img-organic"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917] mb-6">
                A journey of movement, mindfulness, and inner exploration.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#1C1917]/70 leading-relaxed mb-8">
                I've always believed in "How we do one thing is how we do everything."
                Through a strong body and a calm mind, we move not just for health, 
                but to become better practitioners of life.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link to="/contact">
                  <Button
                    data-testid="about-read-story-btn"
                    className="bg-[#1C1917] text-[#FBFBF9] h-14 px-8 text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300 btn-magnetic"
                  >
                    Get in Touch
                    <ArrowRight className="ml-3 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
