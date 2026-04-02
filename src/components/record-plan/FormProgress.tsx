import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  return (
    <div className="max-w-md mx-auto mb-12">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div 
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
              step <= currentStep ? 'bg-main-text text-header' : 'bg-header/50 text-white/40 border border-white/10'
            }`}
          >
            {step < currentStep ? <Check size={14} /> : step}
          </div>
        ))}
      </div>
      <div className="h-1 bg-header/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-main-text"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
