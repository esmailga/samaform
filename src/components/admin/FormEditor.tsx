import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ArrowDown, ArrowUp, ChevronDown, Copy, ExternalLink, Plus, RotateCcw, Save, Trash2, Undo2 } from 'lucide-react';
import {
  FIELD_TYPE_LABELS, hasOptions, newId, validateSchema,
  type ChoiceLayout, type FieldType, type FormField, type FormOption, type FormSchema, type FormStep, type Localized, type TextValidation,
} from '../../form/schema';
import { CARD_ICONS, cardIcon } from '../../form/icons';
import { DEFAULT_FORM, fetchCurrentForm, PREVIEW_STORAGE_KEY } from '../../form/useFormSchema';

const GLASS = 'bg-header/40 backdrop-blur-xl border border-white/10';
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-main-text';
const LABEL = 'block text-[11px] uppercase tracking-widest text-white/50 mb-1.5';
const ICON_BUTTON = 'p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25 disabled:pointer-events-none';

const blank = (): Localized => ({ ar: '', en: '' });
const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
};

function newField(type: FieldType): FormField {
  const field: FormField = { id: newId('q'), type, label: blank(), required: false };
  if (hasOptions(type)) field.options = [{ id: newId('o'), label: blank() }, { id: newId('o'), label: blank() }];
  if (type === 'choice') field.layout = 'grid2';
  if (type === 'images') {
    field.maxFiles = 10;
    field.placeholder = { ar: 'حتى {max} صور', en: 'Up to {max} images' };
  }
  return field;
}

// --- Small building blocks ----------------------------------------------------------------------

function Bilingual({ label, value, onChange, multiline = false, hint }: {
  label: string; value: Localized | undefined; onChange: (v: Localized) => void; multiline?: boolean; hint?: string;
}) {
  const v = value ?? blank();
  const Field = multiline ? 'textarea' : 'input';
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field aria-label={`${label} (English)`} placeholder="English" value={v.en} rows={2}
          onChange={(e) => onChange({ ...v, en: e.target.value })} className={`${INPUT} ${multiline ? 'resize-y' : ''}`} />
        <Field aria-label={`${label} (Arabic)`} placeholder="العربية" dir="rtl" lang="ar" value={v.ar} rows={2}
          onChange={(e) => onChange({ ...v, ar: e.target.value })} className={`${INPUT} ${multiline ? 'resize-y' : ''}`} />
      </div>
      {hint && <p className="text-[11px] text-white/40 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[#bf976e]" />
      {children}
    </label>
  );
}

function Select<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: [T, string][]; onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value as T)} className={`${INPUT} appearance-none pe-8 [&>option]:bg-header`}>
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50" />
      </div>
    </div>
  );
}

const describe = (field: FormField) => field.label.en || field.label.ar || 'Untitled question';

// --- Question editor ----------------------------------------------------------------------------

function OptionsEditor({ field, onChange, onRemoveOption }: {
  field: FormField; onChange: (options: FormOption[]) => void; onRemoveOption: (optionId: string) => void;
}) {
  const options = field.options ?? [];
  const cards = field.type === 'cards';
  const update = (i: number, patch: Partial<FormOption>) => onChange(options.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  return (
    <div>
      <span className={LABEL}>Options</span>
      <div className="space-y-2">
        {options.map((option, i) => {
          const Icon = cardIcon(option.icon);
          return (
            <div key={option.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
              <div className="flex items-start gap-2">
                {cards && (
                  <div className="relative shrink-0">
                    <select aria-label="Icon" value={option.icon ?? ''} onChange={(e) => update(i, { icon: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer [&>option]:bg-header">
                      {Object.keys(CARD_ICONS).map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-main-text" title="Change icon"><Icon size={18} /></div>
                  </div>
                )}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input aria-label="Option (English)" placeholder="English" value={option.label.en} onChange={(e) => update(i, { label: { ...option.label, en: e.target.value } })} className={INPUT} />
                  <input aria-label="Option (Arabic)" placeholder="العربية" dir="rtl" lang="ar" value={option.label.ar} onChange={(e) => update(i, { label: { ...option.label, ar: e.target.value } })} className={INPUT} />
                  {cards && (
                    <>
                      <input aria-label="Description (English)" placeholder="Short description (English)" value={option.description?.en ?? ''} onChange={(e) => update(i, { description: { ar: option.description?.ar ?? '', en: e.target.value } })} className={INPUT} />
                      <input aria-label="Description (Arabic)" placeholder="وصف قصير" dir="rtl" lang="ar" value={option.description?.ar ?? ''} onChange={(e) => update(i, { description: { en: option.description?.en ?? '', ar: e.target.value } })} className={INPUT} />
                    </>
                  )}
                </div>
                <div className="flex shrink-0">
                  <button type="button" className={ICON_BUTTON} disabled={i === 0} aria-label="Move option up" onClick={() => { const next = [...options]; move(next, i, i - 1); onChange(next); }}><ArrowUp size={14} /></button>
                  <button type="button" className={ICON_BUTTON} disabled={i === options.length - 1} aria-label="Move option down" onClick={() => { const next = [...options]; move(next, i, i + 1); onChange(next); }}><ArrowDown size={14} /></button>
                  <button type="button" className={`${ICON_BUTTON} hover:text-red-400`} aria-label="Delete option" onClick={() => onRemoveOption(option.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => onChange([...options, { id: newId('o'), label: blank(), ...(cards ? { icon: 'Home', description: blank() } : {}) }])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-main-text hover:text-white transition-colors">
        <Plus size={14} /> Add option
      </button>
    </div>
  );
}

function QuestionEditor({ field, conditionSources, onChange, onRemoveOption }: {
  field: FormField;
  /** Choice questions this question can depend on */
  conditionSources: FormField[];
  onChange: (patch: Partial<FormField>) => void;
  onRemoveOption: (optionId: string) => void;
}) {
  const source = conditionSources.find((f) => f.id === field.showIf?.field);
  const textLike = ['text', 'email', 'phone', 'number', 'textarea'].includes(field.type);
  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select<FieldType> label="Question type" value={field.type}
          options={Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]}
          onChange={(type) => onChange({
            type,
            options: hasOptions(type) ? field.options ?? newField(type).options : undefined,
            layout: type === 'choice' ? field.layout ?? 'grid2' : undefined,
            maxFiles: type === 'images' ? field.maxFiles ?? 10 : undefined,
          })} />
        <div className="flex items-end pb-2">
          <Toggle checked={field.required} onChange={(required) => onChange({ required })}>Required answer</Toggle>
        </div>
      </div>

      <Bilingual label={field.type === 'cards' ? 'Question (shown in admin and exports)' : 'Question'} value={field.label} onChange={(label) => onChange({ label })} />

      {textLike && <Bilingual label="Placeholder (hint inside the box)" value={field.placeholder} onChange={(placeholder) => onChange({ placeholder })} />}

      {field.type === 'text' && (
        <Select<TextValidation> label="Check the answer" value={field.validation ?? 'none'}
          options={[['none', 'No check'], ['fullName', 'Full name (at least two words)'], ['minLength3', 'At least 3 characters']]}
          onChange={(validation) => onChange({ validation })} />
      )}

      {field.type === 'choice' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select<ChoiceLayout> label="Layout" value={field.layout ?? 'grid2'}
            options={[['grid2', '2 per row'], ['grid3', '3 per row (2 on phones)'], ['grid4', '4 per row (2 on phones)'], ['row', 'All in one row']]}
            onChange={(layout) => onChange({ layout })} />
          <div className="flex items-end pb-2">
            <Toggle checked={!!field.multiple} onChange={(multiple) => onChange({ multiple })}>Allow several answers</Toggle>
          </div>
        </div>
      )}

      {hasOptions(field.type) && (
        <OptionsEditor field={field} onChange={(options) => onChange({ options })} onRemoveOption={onRemoveOption} />
      )}

      {field.type === 'choice' && (
        <div className="rounded-lg border border-white/10 p-3 space-y-3">
          <Toggle checked={!!field.exact} onChange={(on) => onChange({ exact: on ? { id: `${field.id}Exact`, placeholder: blank() } : undefined })}>
            Add an “or enter an exact number” box
          </Toggle>
          {field.exact && (
            <>
              <Bilingual label="Number box placeholder" value={field.exact.placeholder} onChange={(placeholder) => onChange({ exact: { ...field.exact!, placeholder } })} />
              <div className="grid grid-cols-3 gap-2">
                <div><span className={LABEL}>Maximum</span><input type="number" min={1} value={field.exact.max ?? ''} onChange={(e) => onChange({ exact: { ...field.exact!, max: e.target.value ? Number(e.target.value) : undefined } })} className={INPUT} /></div>
                <div><span className={LABEL}>Before number</span><input placeholder="e.g. $" value={field.exact.prefix ?? ''} onChange={(e) => onChange({ exact: { ...field.exact!, prefix: e.target.value || undefined } })} className={INPUT} /></div>
                <div><span className={LABEL}>After number</span><input placeholder="e.g.  sqm" value={field.exact.suffix ?? ''} onChange={(e) => onChange({ exact: { ...field.exact!, suffix: e.target.value || undefined } })} className={INPUT} /></div>
              </div>
            </>
          )}
        </div>
      )}

      {field.type === 'images' && (
        <>
          <Bilingual label="Description" value={field.help} onChange={(help) => onChange({ help })} />
          <Bilingual label="Upload box text" value={field.placeholder} onChange={(placeholder) => onChange({ placeholder })} hint="{max} is replaced with the image limit." />
          <div className="w-40"><span className={LABEL}>Image limit</span><input type="number" min={1} max={20} value={field.maxFiles ?? 10} onChange={(e) => onChange({ maxFiles: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })} className={INPUT} /></div>
        </>
      )}

      <div className="rounded-lg border border-white/10 p-3 space-y-3">
        <Toggle checked={!!field.showIf} onChange={(on) => onChange({ showIf: on && conditionSources[0] ? { field: conditionSources[0].id, values: [] } : undefined })}>
          Show only for certain answers
        </Toggle>
        {field.showIf && conditionSources.length === 0 && <p className="text-xs text-white/50">Add a choice question before this one first.</p>}
        {field.showIf && conditionSources.length > 0 && (
          <>
            <Select label="When the answer to" value={field.showIf.field}
              options={conditionSources.map((f) => [f.id, describe(f)] as [string, string])}
              onChange={(id) => onChange({ showIf: { field: id, values: [] } })} />
            <div>
              <span className={LABEL}>is one of</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {source?.options?.map((o) => (
                  <Toggle key={o.id} checked={field.showIf!.values.includes(o.id)}
                    onChange={(on) => onChange({ showIf: { ...field.showIf!, values: on ? [...field.showIf!.values, o.id] : field.showIf!.values.filter((v) => v !== o.id) } })}>
                    {o.label.en || o.label.ar || o.id}
                  </Toggle>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-white/30">Answers are saved as “{field.id}”{field.exact ? ` and “${field.exact.id}”` : ''}.</p>
    </div>
  );
}

// --- Editor -------------------------------------------------------------------------------------

export default function FormEditor({ token, onUnauthorized, onPublished }: {
  token: string; onUnauthorized: () => void; onPublished: () => void;
}) {
  const [draft, setDraft] = useState<FormSchema | null>(null);
  const [published, setPublished] = useState<{ version: number; json: string } | null>(null);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [openField, setOpenField] = useState<string | null>(null);
  const [newType, setNewType] = useState<FieldType>('choice');
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    try {
      const form = await fetchCurrentForm();
      setDraft(structuredClone(form.schema));
      setPublished({ version: form.version, json: JSON.stringify(form.schema) });
      setLoadError('');
    } catch {
      setLoadError('Could not load the form. Check that the API server is running (npm run api).');
    }
  };
  useEffect(() => { load(); }, []);

  const dirty = !!draft && !!published && JSON.stringify(draft) !== published.json;
  const errors = useMemo(() => (draft ? validateSchema(draft) : []), [draft]);

  // Warn before leaving the page with unpublished edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!draft || !published) {
    return <p className={loadError ? 'text-red-400 text-sm' : 'text-white/50 text-sm'}>{loadError || 'Loading form...'}</p>;
  }

  const update = (fn: (schema: FormSchema) => void) => setDraft((prev) => {
    const next = structuredClone(prev!);
    fn(next);
    return next;
  });
  const allFields = draft.steps.flatMap((s) => s.fields);

  const removeOption = (fieldId: string, optionId: string) => update((s) => {
    for (const f of s.steps.flatMap((st) => st.fields)) {
      if (f.id === fieldId) f.options = f.options?.filter((o) => o.id !== optionId);
      // Conditions that pointed at the removed option no longer can
      if (f.showIf?.field === fieldId) f.showIf.values = f.showIf.values.filter((v) => v !== optionId);
    }
  });

  const removeField = (stepIndex: number, field: FormField) => {
    const dependents = allFields.filter((f) => f.showIf?.field === field.id);
    const note = dependents.length ? `\n\n${dependents.length} other question(s) are shown based on this one; their condition will be removed.` : '';
    if (!confirm(`Delete “${describe(field)}”?\n\nResponses already received keep this answer.${note}`)) return;
    update((s) => {
      s.steps[stepIndex].fields = s.steps[stepIndex].fields.filter((f) => f.id !== field.id);
      for (const f of s.steps.flatMap((st) => st.fields)) if (f.showIf?.field === field.id) delete f.showIf;
    });
  };

  const removeStep = (index: number) => {
    const step = draft.steps[index];
    if (!confirm(`Delete step ${index + 1} (“${step.title.en || step.heading.en}”) and its ${step.fields.length} question(s)?\n\nResponses already received keep their answers.`)) return;
    update((s) => {
      const removed = new Set(s.steps[index].fields.map((f) => f.id));
      s.steps.splice(index, 1);
      for (const f of s.steps.flatMap((st) => st.fields)) if (f.showIf && removed.has(f.showIf.field)) delete f.showIf;
    });
  };

  const addStep = () => {
    const step: FormStep = { id: newId('s'), title: blank(), heading: blank(), fields: [newField('text')] };
    update((s) => { s.steps.push(step); });
    setOpenStep(step.id);
    setOpenField(step.fields[0].id);
  };

  const addField = (stepIndex: number) => {
    const field = newField(newType);
    update((s) => { s.steps[stepIndex].fields.push(field); });
    setOpenField(field.id);
  };

  const duplicateField = (stepIndex: number, fieldIndex: number) => {
    const copy = structuredClone(draft.steps[stepIndex].fields[fieldIndex]);
    copy.id = newId('q');
    if (copy.exact) copy.exact.id = `${copy.id}Exact`;
    copy.options = copy.options?.map((o) => ({ ...o, id: newId('o') }));
    copy.label = { ar: `${copy.label.ar} (نسخة)`, en: `${copy.label.en} (copy)` };
    update((s) => { s.steps[stepIndex].fields.splice(fieldIndex + 1, 0, copy); });
    setOpenField(copy.id);
  };

  const publish = async () => {
    setShowErrors(true);
    if (errors.length) return;
    if (!confirm('Publish these changes? Visitors will see the updated form straight away.')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ schema: draft }),
      });
      if (res.status === 401) return onUnauthorized();
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      const { version } = await res.json();
      setPublished({ version, json: JSON.stringify(draft) });
      setShowErrors(false);
      onPublished();
    } catch (err) {
      alert(`Could not publish the form: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const preview = () => {
    try {
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(draft));
      window.open('/record-plan?preview=1', '_blank', 'noopener');
    } catch {
      alert('Preview needs browser storage, which is blocked here.');
    }
  };

  return (
    <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl text-main-text">Record Your Plan form</h2>
          <p className="text-white/40 text-sm mt-1">
            Edit steps, questions and options. Visitors see changes after you publish.
            <span className="ml-2 text-white/60">{published.version ? `Live: version ${published.version}` : 'Live: original form'}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={preview} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-lg hover:bg-white/10 text-sm">
            <ExternalLink size={16} /> Preview
          </button>
          <button type="button" disabled={!dirty} onClick={() => { if (confirm('Discard all unpublished changes?')) { setDraft(JSON.parse(published.json)); setShowErrors(false); } }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-lg hover:bg-white/10 text-sm disabled:opacity-40">
            <Undo2 size={16} /> Discard changes
          </button>
          <button type="button" onClick={() => { if (confirm('Replace the form with the original built-in form? You can review it before publishing.')) setDraft(structuredClone(DEFAULT_FORM)); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-lg hover:bg-white/10 text-sm">
            <RotateCcw size={16} /> Restore original
          </button>
        </div>
      </div>

      {showErrors && errors.length > 0 && (
        <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          <p className="flex items-center gap-2 font-medium mb-2"><AlertTriangle size={16} /> Fix these before publishing:</p>
          <ul className="list-disc ps-5 space-y-1">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className="space-y-4">
        {draft.steps.map((step, si) => {
          const open = openStep === step.id;
          // Questions in earlier positions that a question in this step can depend on
          const before = draft.steps.slice(0, si + 1).flatMap((s) => s.fields);
          return (
            <section key={step.id} className={`rounded-2xl ${GLASS}`}>
              <div className="flex items-center gap-2 p-4">
                <button type="button" onClick={() => setOpenStep(open ? null : step.id)} className="flex-1 flex items-center gap-3 text-start min-w-0" aria-expanded={open}>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-main-text/20 text-main-text text-xs flex items-center justify-center">{si + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-white truncate">{step.title.en || step.heading.en || 'Untitled step'}</span>
                    <span className="block text-xs text-white/40">{step.fields.length} question{step.fields.length === 1 ? '' : 's'}</span>
                  </span>
                  <ChevronDown size={18} className={`ms-auto shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <button type="button" className={ICON_BUTTON} disabled={si === 0} aria-label="Move step up" onClick={() => update((s) => move(s.steps, si, si - 1))}><ArrowUp size={16} /></button>
                <button type="button" className={ICON_BUTTON} disabled={si === draft.steps.length - 1} aria-label="Move step down" onClick={() => update((s) => move(s.steps, si, si + 1))}><ArrowDown size={16} /></button>
                <button type="button" className={`${ICON_BUTTON} hover:text-red-400`} aria-label="Delete step" onClick={() => removeStep(si)}><Trash2 size={16} /></button>
              </div>

              {open && (
                <div className="px-4 pb-4 space-y-5">
                  <div className="space-y-3 rounded-xl bg-white/[0.03] p-4">
                    <Bilingual label="Step title (small, above the heading)" value={step.title} onChange={(title) => update((s) => { s.steps[si].title = title; })} />
                    <Bilingual label="Heading" value={step.heading} onChange={(heading) => update((s) => { s.steps[si].heading = heading; })}
                      hint="Tip: {projectType} (or any question id in braces) is replaced with the visitor's answer." />
                  </div>

                  <div className="space-y-2">
                    {step.fields.map((field, fi) => {
                      const fieldOpen = openField === field.id;
                      const sources = before.filter((f) => hasOptions(f.type) && f.id !== field.id && before.indexOf(f) < before.indexOf(field));
                      return (
                        <div key={field.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setOpenField(fieldOpen ? null : field.id)} className="flex-1 min-w-0 text-start" aria-expanded={fieldOpen}>
                              <span className="block text-sm text-white truncate">{describe(field)}</span>
                              <span className="flex flex-wrap gap-1.5 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">{FIELD_TYPE_LABELS[field.type]}</span>
                                {field.required && <span className="text-[10px] px-1.5 py-0.5 rounded bg-main-text/20 text-main-text">Required</span>}
                                {field.showIf && <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300">Conditional</span>}
                              </span>
                            </button>
                            <button type="button" className={ICON_BUTTON} disabled={fi === 0} aria-label="Move question up" onClick={() => update((s) => move(s.steps[si].fields, fi, fi - 1))}><ArrowUp size={15} /></button>
                            <button type="button" className={ICON_BUTTON} disabled={fi === step.fields.length - 1} aria-label="Move question down" onClick={() => update((s) => move(s.steps[si].fields, fi, fi + 1))}><ArrowDown size={15} /></button>
                            <button type="button" className={ICON_BUTTON} aria-label="Duplicate question" onClick={() => duplicateField(si, fi)}><Copy size={15} /></button>
                            <button type="button" className={`${ICON_BUTTON} hover:text-red-400`} aria-label="Delete question" onClick={() => removeField(si, field)}><Trash2 size={15} /></button>
                          </div>
                          {fieldOpen && (
                            <QuestionEditor
                              field={field}
                              conditionSources={sources}
                              onChange={(patch) => update((s) => { Object.assign(s.steps[si].fields[fi], patch); })}
                              onRemoveOption={(optionId) => removeOption(field.id, optionId)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-end gap-2">
                    <div className="w-48">
                      <Select<FieldType> label="New question type" value={newType} options={Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]} onChange={setNewType} />
                    </div>
                    <button type="button" onClick={() => addField(si)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-main-text/15 text-main-text hover:bg-main-text/25 text-sm">
                      <Plus size={16} /> Add question
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <button type="button" onClick={addStep} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm">
        <Plus size={16} /> Add step
      </button>

      {/* Publish bar stays visible while editing */}
      <div className={`fixed bottom-0 inset-x-0 md:left-64 z-30 transition-transform ${dirty ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="m-3 md:mx-8 rounded-xl bg-header border border-main-text/30 shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-sm text-white/80">
            You have unpublished changes{errors.length ? <span className="text-red-300"> · {errors.length} problem{errors.length === 1 ? '' : 's'} to fix</span> : null}
          </span>
          <button type="button" onClick={publish} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-main-text text-header font-medium hover:bg-main-text/90 disabled:opacity-60 text-sm">
            <Save size={16} /> {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
