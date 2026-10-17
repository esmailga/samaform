import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, type MotionValue } from 'motion/react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// One odometer column. `place` is 1 for ones, 10 for tens, ...
function DigitColumn({ value, place }: { value: MotionValue<number>; place: number }) {
  const y = useTransform(value, (v) => {
    const scaled = v / place;
    const whole = Math.floor(scaled);
    // Higher columns only roll while the column below wraps from 9 to 0
    const carry = place === 1 ? scaled - whole : Math.max(0, (v % place) - (place - 1));
    return `${-((whole % 10) + carry) * 1.1}em`;
  });

  return (
    <span aria-hidden="true" className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
      <motion.span style={{ y }} className="flex flex-col">
        {DIGITS.map((d, i) => (
          <span key={i} className="block h-[1.1em] leading-[1.1em]">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

export default function RollingNumber({ to, prefix = '', delay = 0 }: { to: number; prefix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const value = useMotionValue(0);
  const places = Array.from({ length: String(to).length }, (_, i) => 10 ** (String(to).length - 1 - i));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(value, to, { duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [isInView, value, to, delay]);

  return (
    <span ref={ref} dir="ltr" className="inline-flex tabular-nums leading-[1.1em]">
      <span className="sr-only">{prefix}{to}</span>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {places.map((place) => (
        <DigitColumn key={place} value={value} place={place} />
      ))}
    </span>
  );
}
