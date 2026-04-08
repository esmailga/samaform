import React from 'react';
import { motion } from 'motion/react';
import { FormData } from './types';

interface DynamicStepProps {
  step: any;
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
}

export default function DynamicStep({ step, formData, updateFields }: DynamicStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl text-main-text mb-4">{step.title}</h2>
        <p className="text-white/60">{step.description}</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {step.fields.map((field: any) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'radio' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {field.options.map((opt: any) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateFields({ [field.id]: formData[field.id as keyof FormData] === opt.id ? '' : opt.id })}
                    className={`p-4 rounded-xl border transition-all text-sm font-medium ${
                      formData[field.id as keyof FormData] === opt.id
                        ? 'bg-main-text text-header border-main-text shadow-lg shadow-main-text/20'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.id as keyof FormData] as string || ''}
                onChange={(e) => updateFields({ [field.id]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text min-h-[120px]"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.id as keyof FormData] as string || ''}
                onChange={(e) => updateFields({ [field.id]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-main-text"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
