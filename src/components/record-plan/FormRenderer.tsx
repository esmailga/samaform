import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Check, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_HOVER } from '../../constants/styles';
import { validateEmail, validateName, validatePhone } from '../../utils/validation';
import { convertArabicToWestern, convertWesternToArabic } from '../../utils/numbers';
import { isVisible, type FormAnswers, type FormField, type FormStep } from '../../form/schema';
import { cardIcon } from '../../form/icons';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB per image

const asText = (v: FormAnswers[string]) => (typeof v === 'string' ? v : '');
const asList = (v: FormAnswers[string]) => (Array.isArray(v) ? (v as string[]) : typeof v === 'string' && v ? [v] : []);
const asFiles = (v: FormAnswers[string]) => (Array.isArray(v) && v[0] instanceof File ? (v as File[]) : []);

// --- Validation shared with the page's "Next" button --------------------------------------------

function textValid(field: FormField, value: string) {
  if (field.validation === 'fullName') return validateName(value);
  if (field.validation === 'minLength3') return value.trim().length >= 3;
  return value.trim().length > 0;
}

/** Whether the visitor's answer to one question allows them to continue */
export function fieldValid(field: FormField, answers: FormAnswers) {
  const value = answers[field.id];
  switch (field.type) {
    case 'email': {
      const v = asText(value);
      return v === '' ? !field.required : validateEmail(v);
    }
    case 'phone': {
      const v = asText(value);
      return v === '' ? !field.required : validatePhone(v);
    }
    case 'text': {
      const v = asText(value);
      return v.trim() === '' ? !field.required : textValid(field, v);
    }
    case 'choice': {
      const chosen = asList(value).length > 0 || (field.exact ? asText(answers[field.exact.id]) !== '' : false);
      return !field.required || chosen;
    }
    case 'images':
      return !field.required || asFiles(value).length > 0;
    default:
      return !field.required || asText(value).trim() !== '' || asList(value).length > 0;
  }
}

export const stepValid = (step: FormStep, answers: FormAnswers) =>
  step.fields.filter((f) => isVisible(f, answers)).every((f) => fieldValid(f, answers));

// --- Field components -------------------------------------------------------------------------

type FieldProps = {
  field: FormField;
  answers: FormAnswers;
  setAnswer: (id: string, value: FormAnswers[string]) => void;
};

const labelClass = 'block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1';
const selectedClass = 'bg-main-text border-main-text text-header';
const idleClass = 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60';

function FieldLabel({ field, compact = false }: { field: FormField; compact?: boolean }) {
  const { lang, t } = useLanguage();
  return (
    <label className={compact ? 'block text-white text-xs uppercase tracking-widest mb-2 px-1' : `${labelClass} flex items-center gap-2`}>
      {field.label[lang]}
      {!field.required && field.type !== 'images' && (
        <span className="text-white/40 normal-case text-xs font-normal">({t('optional')})</span>
      )}
    </label>
  );
}

function TextInput({ field, answers, setAnswer }: FieldProps) {
  const { lang, t } = useLanguage();
  const value = asText(answers[field.id]);
  const valid = value.trim() !== '' && fieldValid(field, answers);
  const invalid = value.trim() !== '' && !valid;
  const message =
    field.type === 'phone' ? t('invalidPhone')
    : field.type === 'email' ? t('invalidEmail')
    : field.validation === 'fullName' ? t('nameTwoWords')
    : '';
  const isNumber = field.type === 'number';
  return (
    <div className="relative">
      <FieldLabel field={field} compact />
      <input
        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
        inputMode={isNumber ? 'numeric' : undefined}
        value={value}
        onChange={(e) => setAnswer(field.id, isNumber ? convertArabicToWestern(e.target.value).replace(/\D/g, '') : e.target.value)}
        className={`w-full bg-header/50 border ${invalid ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors ${field.type === 'phone' ? 'rtl:text-right placeholder:rtl:text-right' : ''}`}
        placeholder={field.placeholder?.[lang]}
      />
      {valid && (
        <div className="absolute end-4 top-10 text-main-text">
          <Check size={18} />
        </div>
      )}
      {invalid && message && <span className="text-red-500 text-[10px] mt-1 px-1 uppercase">{message}</span>}
    </div>
  );
}

function TextArea({ field, answers, setAnswer }: FieldProps) {
  const { lang } = useLanguage();
  return (
    <div>
      <FieldLabel field={field} />
      <textarea
        rows={4}
        placeholder={field.placeholder?.[lang]}
        value={asText(answers[field.id])}
        onChange={(e) => setAnswer(field.id, e.target.value)}
        className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
      />
    </div>
  );
}

const LAYOUTS = {
  grid2: 'grid grid-cols-2 gap-3',
  grid3: 'grid grid-cols-2 md:grid-cols-3 gap-3',
  grid4: 'grid grid-cols-2 md:grid-cols-4 gap-3',
  row: 'flex flex-wrap gap-2 md:gap-4',
};

function ChoiceButtons({ field, answers, setAnswer }: FieldProps) {
  const { lang } = useLanguage();
  const selected = asList(answers[field.id]);
  const toggle = (id: string) => {
    if (field.multiple) {
      setAnswer(field.id, selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    } else {
      setAnswer(field.id, selected.includes(id) ? '' : id);
    }
    // Choosing an option clears the "exact value" box (they are alternatives)
    if (field.exact) setAnswer(field.exact.id, '');
  };
  const row = field.layout === 'row';
  return (
    <div>
      <FieldLabel field={field} />
      <div className={LAYOUTS[field.layout ?? 'grid2']}>
        {field.options?.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected.includes(option.id)}
            onClick={() => toggle(option.id)}
            className={`${row ? 'flex-1 py-3' : 'p-3 md:p-4'} text-sm md:text-lg text-center rounded-xl border transition-all ${selected.includes(option.id) ? selectedClass : idleClass}`}
          >
            <span className="font-medium">{option.label[lang]}</span>
          </button>
        ))}
      </div>
      {field.exact && (
        <input
          type="text"
          inputMode="numeric"
          value={asText(answers[field.exact.id])}
          onChange={(e) => {
            const digits = convertArabicToWestern(e.target.value).replace(/\D/g, '');
            if (digits !== '' && field.exact!.max && Number(digits) > field.exact!.max) return;
            setAnswer(field.exact!.id, digits);
            if (digits !== '') setAnswer(field.id, field.multiple ? [] : '');
          }}
          className="w-full bg-header/50 border border-main-text/20 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors mt-4"
          placeholder={field.exact.placeholder[lang]}
        />
      )}
    </div>
  );
}

function CardChoice({ field, answers, setAnswer }: FieldProps) {
  const { lang } = useLanguage();
  const selected = asText(answers[field.id]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {field.options?.map((option) => {
        const Icon = cardIcon(option.icon);
        const active = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => setAnswer(field.id, active ? '' : option.id)}
            className={`p-6 rounded-2xl border transition-all duration-300 text-start flex flex-col items-start space-y-4 ${
              active ? 'bg-main-text border-main-text text-header' : `bg-header/30 border-main-text/10 text-white ${GLASS_HOVER}`
            }`}
          >
            <Icon size={32} strokeWidth={1.5} />
            <div>
              <h3 className="font-medium text-base md:text-lg">{option.label[lang]}</h3>
              {option.description && <p className={`text-xs opacity-70 ${active ? 'text-header' : 'text-white'}`}>{option.description[lang]}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Thumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-header/50 group">
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center transition-opacity"
      >
        <X size={16} className="text-white" />
      </button>
    </div>
  );
}

function ImageUpload({ field, answers, setAnswer, first }: FieldProps & { first: boolean }) {
  const { lang, t } = useLanguage();
  const input = useRef<HTMLInputElement>(null);
  const files = asFiles(answers[field.id]);
  const max = field.maxFiles ?? 10;
  const maxLabel = lang === 'ar' ? convertWesternToArabic(String(max)) : String(max);
  const Icon = first ? Upload : ImageIcon;

  const add = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    const ok = picked.filter((file) => {
      if (file.size <= MAX_FILE_SIZE) return true;
      alert(t('fileTooLarge', { name: file.name }));
      return false;
    });
    if (ok.length) setAnswer(field.id, [...files, ...ok].slice(0, max));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-white text-sm uppercase tracking-widest">{field.label[lang]}</label>
        <span className="text-[10px] text-white/40">{files.length}/{max}</span>
      </div>
      {field.help && <p className="text-white/40 text-sm">{field.help[lang]}</p>}
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="w-full border-2 border-dashed border-main-text/20 rounded-2xl p-5 md:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-main-text/40 bg-header/20"
      >
        <Icon className="text-main-text mb-2" size={32} />
        <span className="text-white/60 text-sm">{field.placeholder?.[lang].replace('{max}', maxLabel)}</span>
      </button>
      <input ref={input} type="file" multiple accept="image/*" onChange={add} className="hidden" />
      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((file, i) => (
            <Thumb key={`${file.name}-${i}`} file={file} onRemove={() => setAnswer(field.id, files.filter((_, j) => j !== i))} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Step ------------------------------------------------------------------------------------

const COMPACT = new Set(['text', 'email', 'phone', 'number', 'images']);

/** Replaces {fieldId} in a heading with the visitor's answer, e.g. "Specific details for {projectType}" */
function fillHeading(text: string, steps: FormStep[], answers: FormAnswers, lang: 'ar' | 'en') {
  return text.replace(/\{([A-Za-z0-9_]+)\}/g, (_, id) => {
    const field = steps.flatMap((s) => s.fields).find((f) => f.id === id);
    const value = asText(answers[id]);
    return field?.options?.find((o) => o.id === value)?.label[lang] ?? value;
  });
}

export default function FormStepView({ step, steps, answers, setAnswer }: {
  step: FormStep;
  steps: FormStep[];
  answers: FormAnswers;
  setAnswer: FieldProps['setAnswer'];
}) {
  const { lang } = useLanguage();
  const fields = step.fields.filter((f) => isVisible(f, answers));
  const firstImageId = fields.find((f) => f.type === 'images')?.id;

  // Consecutive short fields share a two-column row on larger screens, like the original layout
  const groups: FormField[][] = [];
  for (const field of fields) {
    const last = groups[groups.length - 1];
    if (last && COMPACT.has(field.type) && COMPACT.has(last[0].type) && (field.type === 'images') === (last[0].type === 'images')) last.push(field);
    else groups.push([field]);
  }

  const render = (field: FormField) => {
    const props = { field, answers, setAnswer };
    switch (field.type) {
      case 'textarea': return <TextArea key={field.id} {...props} />;
      case 'choice': return <ChoiceButtons key={field.id} {...props} />;
      case 'cards': return <CardChoice key={field.id} {...props} />;
      case 'images': return <ImageUpload key={field.id} {...props} first={field.id === firstImageId} />;
      default: return <TextInput key={field.id} {...props} />;
    }
  };

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-white text-sm md:text-lg uppercase tracking-widest mb-2">{step.title[lang]}</h2>
        <p className="text-2xl md:text-4xl text-main-text">{fillHeading(step.heading[lang], steps, answers, lang)}</p>
      </div>
      <div className="space-y-2">
        {groups.map((group, i) =>
          group.length > 1 || COMPACT.has(group[0].type) ? (
            <div key={i} className={`grid grid-cols-1 md:grid-cols-2 ${group[0].type === 'images' ? 'gap-4 md:gap-8' : 'gap-6'} ${i > 0 ? 'pt-4' : ''}`}>
              {group.map(render)}
            </div>
          ) : (
            render(group[0])
          )
        )}
      </div>
    </motion.div>
  );
}
