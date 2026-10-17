import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES } from '../constants/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import FormProgress from '../components/record-plan/FormProgress';
import FormStepView, { stepValid } from '../components/record-plan/FormRenderer';
import SuccessMessage from '../components/record-plan/SuccessMessage';
import { isVisible, type FormAnswers, type FormField } from '../form/schema';
import { useFormSchema } from '../form/useFormSchema';
import { convertArabicToWestern } from '../utils/numbers';

// The questions come from the form the admin edits (Admin > Form); see src/form/schema.ts
export default function RecordPlanPage() {
  const { t, localePath } = useLanguage();
  const navigate = useNavigate();
  const form = useFormSchema();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const setAnswer = (id: string, value: FormAnswers[string]) => {
    setAnswers((prev) => ({ ...prev, [id]: typeof value === 'string' ? convertArabicToWestern(value) : value }));
  };

  if (isSuccess) {
    return <SuccessMessage />;
  }

  // A step is skipped only once its questions are known to be hidden (e.g. none for the chosen project type);
  // until the deciding question is answered it still counts, so the progress bar doesn't change length
  const undecided = (f: FormField) => !!f.showIf && !answers[f.showIf.field];
  const steps = form ? form.schema.steps.filter((s) => s.fields.some((f) => isVisible(f, answers) || undecided(f))) : [];
  const current = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const canContinue = !!step && stepValid(step, answers) && !(isLast && form?.preview);

  const goTo = (index: number) => {
    setStepIndex(index);
    window.scrollTo(0, 0);
  };

  const handleBack = () => (current > 0 ? goTo(current - 1) : navigate(localePath('/')));

  const handleSubmit = async () => {
    if (!form) return;
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append('formVersion', String(form.version));
      // Only answers to questions the visitor could see (switching project type leaves stale answers behind)
      for (const field of form.schema.steps.flatMap((s) => s.fields)) {
        if (!isVisible(field, answers)) continue;
        const value = answers[field.id];
        if (field.type === 'images') {
          (Array.isArray(value) ? (value as File[]) : []).forEach((file) => body.append(`${field.id}[]`, file));
        } else if (Array.isArray(value)) {
          body.append(field.id, JSON.stringify(value));
        } else if (value) {
          body.append(field.id, String(value));
        }
        const exact = field.exact && answers[field.exact.id];
        if (field.exact && exact) body.append(field.exact.id, String(exact));
      }

      const response = await fetch('/api/form/responses', { method: 'POST', body });
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate(localePath('/')), 3000);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => (isLast ? handleSubmit() : goTo(current + 1));

  return (
    <div className="pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen max-w-5xl mx-auto relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 start-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-main-text/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-secondary/5 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {!form ? (
          <div className="min-h-[50vh] flex items-center justify-center" aria-busy="true">
            <div className="w-8 h-8 border-2 border-main-text/30 border-t-main-text rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {form.preview && (
              <p dir="ltr" className="mb-6 rounded-xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-100 text-center">
                Preview of unpublished form changes. Sending is turned off.
              </p>
            )}
            <FormProgress currentStep={current + 1} totalSteps={steps.length} onStepClick={(n) => goTo(n - 1)} />

            <form className={`p-4 sm:p-6 md:p-12 rounded-2xl md:rounded-3xl ${GLASS_CLASSES} relative`} onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {step && <FormStepView key={step.id} step={step} steps={form.schema.steps} answers={answers} setAnswer={setAnswer} />}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 pt-6 md:pt-8 border-t border-main-text/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`px-5 py-3 md:px-8 md:py-4 rounded-full inline-flex items-center gap-2 md:gap-3 ${GLASS_CLASSES} hover:bg-white/10 text-white transition-all duration-300`}
                >
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                  <span className="uppercase tracking-widest text-[11px] md:text-xs font-bold">{current === 0 ? t('home') : t('previousPage')}</span>
                </button>

                <button
                  type="button"
                  disabled={!canContinue || isSubmitting}
                  onClick={handleNext}
                  className={`px-6 py-3 md:px-10 md:py-4 rounded-full inline-flex items-center gap-2 md:gap-3 transition-all duration-500 ${
                    canContinue
                      ? 'bg-main-text text-header hover:scale-105 shadow-lg shadow-main-text/20'
                      : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-header/30 border-t-header rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-widest text-[11px] md:text-xs font-bold">
                        {isLast ? t('submit') : t('nextPage')}
                      </span>
                      {!isLast && <ArrowRight size={16} className="rtl:rotate-180" />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
