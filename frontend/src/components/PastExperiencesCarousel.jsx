import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Compact retreat tiles carousel — smaller tiles, 3-up on desktop.
 * Reused for Past Experiences and Sold Out sections.
 */
export default function PastExperiencesCarousel({
  retreats = [],
  eyebrow = "Where We've Been",
  title = 'Past Experiences',
  badge = 'Past Experience',
  testIdPrefix = 'past',
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = retreats.length;
  const visible = typeof window !== 'undefined'
    ? (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    : 3;

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total <= visible) return;
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % total), 5500);
  }, [total, visible]);

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAuto]);

  const nav = (dir) => {
    setCurrent(p => ((p + dir) % total + total) % total);
    startAuto();
  };

  if (total === 0) return null;

  const cards = [];
  for (let i = 0; i < Math.min(visible, total); i++) {
    cards.push(retreats[(current + i) % total]);
  }

  return (
    <section className="py-20 md:py-24 bg-[#FBFBF9]" data-testid={`${testIdPrefix}-experiences`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-3">{eyebrow}</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917]">{title}</h2>
        </motion.div>

        <div className="relative">
          <div className={`grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
            <AnimatePresence mode="popLayout">
              {cards.map(retreat => (
                <motion.div
                  key={retreat.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="group bg-white border border-[#E7E5E4] overflow-hidden hover:border-[#D6C0A6] transition-colors"
                  data-testid={`${testIdPrefix}-card-${retreat.id}`}
                >
                  <Link to={`/retreats/${retreat.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={retreat.heroImage || retreat.image}
                        alt={retreat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/15 to-transparent" />
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-[#D6C0A6] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em]">
                        {badge}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-1.5 text-[#D6C0A6] mb-1">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[9px] uppercase tracking-[0.2em]">{retreat.location}</span>
                        </div>
                        <h3 className="font-['Playfair_Display'] text-lg md:text-xl text-[#FBFBF9] leading-tight">{retreat.title}</h3>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between text-xs text-[#57534E]">
                      <span className="truncate">{retreat.date}</span>
                      {retreat.attendeeCount && (
                        <span className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <Users className="w-3 h-3 text-[#D6C0A6]" />
                          {retreat.attendeeCount}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-[#1C1917] transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {total > visible && (
            <>
              <button
                onClick={() => nav(-1)}
                className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center z-10"
                data-testid={`${testIdPrefix}-prev-btn`}
              >
                <ChevronLeft className="w-4 h-4 text-[#1C1917]" />
              </button>
              <button
                onClick={() => nav(1)}
                className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center z-10"
                data-testid={`${testIdPrefix}-next-btn`}
              >
                <ChevronRight className="w-4 h-4 text-[#1C1917]" />
              </button>
            </>
          )}
        </div>

        {total > visible && (
          <div className="flex justify-center gap-1.5 mt-8">
            {retreats.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrent(idx); startAuto(); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#1C1917] w-7' : 'bg-[#E7E5E4] w-2 hover:bg-[#A8A29E]'}`}
                data-testid={`${testIdPrefix}-dot-${idx}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
