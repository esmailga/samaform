import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';

export default function Counter({ from, to, suffix = '', prefix = '' }: { from: number, to: number, suffix?: string, prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => `${prefix}${latest}${suffix}`);

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
