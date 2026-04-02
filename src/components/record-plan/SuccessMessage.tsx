import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { GLASS_CLASSES } from '../../constants/styles';

export default function SuccessMessage() {
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-12 rounded-3xl ${GLASS_CLASSES} text-center max-w-md`}
      >
        <div className="w-20 h-20 bg-main-text rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-header" />
        </div>
        <h2 className="text-3xl font-serif text-white mb-4">Plan Recorded!</h2>
        <p className="text-white/60">Thank you for sharing your vision. Our team will review your plan and get back to you shortly.</p>
      </motion.div>
    </div>
  );
}
