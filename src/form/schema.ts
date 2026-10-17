// The "Record Your Plan" form is data, not code: the admin edits it, the public form renders it, and the
// admin responses / Excel / PDF exports use it for labels. Field ids are permanent: they are the keys answers
// are stored under, so renaming a question never disconnects existing responses.

export type Localized = { ar: string; en: string };

export type FieldType = 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'choice' | 'cards' | 'images';
export type TextValidation = 'none' | 'fullName' | 'minLength3';
export type ChoiceLayout = 'grid2' | 'grid3' | 'grid4' | 'row';

export type FormOption = {
  id: string;
  label: Localized;
  /** Cards only: the small line under the title */
  description?: Localized;
  /** Cards only: an icon name from CARD_ICONS in form/icons.ts */
  icon?: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: Localized;
  placeholder?: Localized;
  /** Extra line under the label (used by image fields) */
  help?: Localized;
  required: boolean;
  /** text fields */
  validation?: TextValidation;
  /** choice and cards fields */
  options?: FormOption[];
  /** choice fields: allow several answers */
  multiple?: boolean;
  layout?: ChoiceLayout;
  /** choice fields: an "or enter an exact number" box, stored under its own id */
  exact?: { id: string; placeholder: Localized; max?: number; prefix?: string; suffix?: string };
  /** images fields */
  maxFiles?: number;
  /** Only show this question when another question has one of these answers */
  showIf?: { field: string; values: string[] };
};

export type FormStep = {
  id: string;
  /** Small uppercase label above the heading */
  title: Localized;
  /** Large heading; {fieldId} is replaced with that question's answer, e.g. {projectType} */
  heading: Localized;
  fields: FormField[];
};

export type FormSchema = { steps: FormStep[] };

export type FormAnswers = Record<string, string | string[] | File[] | undefined>;

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Short text',
  email: 'Email',
  phone: 'Phone number',
  number: 'Number',
  textarea: 'Long text',
  choice: 'Choice buttons',
  cards: 'Picture cards',
  images: 'Image upload',
};

export const hasOptions = (type: FieldType) => type === 'choice' || type === 'cards';

/** A field is shown when it has no condition, or the condition's question has one of the listed answers */
export function isVisible(field: FormField, answers: FormAnswers) {
  if (!field.showIf) return true;
  const answer = answers[field.showIf.field];
  const values = Array.isArray(answer) ? (answer as string[]) : answer ? [String(answer)] : [];
  return values.some((v) => field.showIf!.values.includes(v));
}

/** Short random id for new questions/options, e.g. "q_k3x9f2" */
export const newId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

/** All field ids (and exact-value ids) used anywhere in the form */
export const allFieldIds = (schema: FormSchema) =>
  schema.steps.flatMap((s) => s.fields.flatMap((f) => (f.exact ? [f.id, f.exact.id] : [f.id])));

/** Problems that would make the form unusable; the admin cannot save until they are fixed */
export function validateSchema(schema: FormSchema): string[] {
  const errors: string[] = [];
  if (schema.steps.length === 0) errors.push('The form needs at least one step.');
  const ids = allFieldIds(schema);
  const duplicate = ids.find((id, i) => ids.indexOf(id) !== i);
  if (duplicate) errors.push(`Two questions use the same id "${duplicate}".`);
  schema.steps.forEach((step, si) => {
    const where = `Step ${si + 1}`;
    if (!step.heading.ar.trim() || !step.heading.en.trim()) errors.push(`${where}: the heading needs both Arabic and English text.`);
    if (step.fields.length === 0) errors.push(`${where}: add at least one question or delete the step.`);
    step.fields.forEach((field, fi) => {
      const q = `${where}, question ${fi + 1}`;
      if (!field.label.ar.trim() || !field.label.en.trim()) errors.push(`${q}: the question needs both Arabic and English text.`);
      if (hasOptions(field.type)) {
        if (!field.options?.length) errors.push(`${q}: add at least one option.`);
        field.options?.forEach((o, oi) => {
          if (!o.label.ar.trim() || !o.label.en.trim()) errors.push(`${q}, option ${oi + 1}: needs both Arabic and English text.`);
        });
      }
      if (field.showIf && !ids.includes(field.showIf.field)) errors.push(`${q}: its "show only if" question no longer exists.`);
      if (field.showIf && field.showIf.values.length === 0) errors.push(`${q}: choose at least one answer for "show only if".`);
    });
  });
  return errors;
}
