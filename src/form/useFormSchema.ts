import { useEffect, useState } from 'react';
import defaultForm from './defaultForm.json';
import type { FormSchema } from './schema';

/** The form as it was built into the site (version 0); used until an admin saves their first edit */
export const DEFAULT_FORM = defaultForm as FormSchema;

export type PublishedForm = { version: number; schema: FormSchema; preview?: boolean };

/** Where Admin > Form puts an unpublished draft for /record-plan?preview=1 */
export const PREVIEW_STORAGE_KEY = 'samaform-form-preview';

export async function fetchCurrentForm(): Promise<PublishedForm> {
  const res = await fetch('/api/form');
  if (!res.ok) throw new Error(`Failed to load the form (${res.status})`);
  const data = await res.json();
  return { version: data.version ?? 0, schema: data.schema ?? DEFAULT_FORM };
}

function readPreview(): FormSchema | null {
  if (new URLSearchParams(window.location.search).get('preview') !== '1') return null;
  try {
    const draft = localStorage.getItem(PREVIEW_STORAGE_KEY);
    return draft ? (JSON.parse(draft) as FormSchema) : null;
  } catch {
    return null;
  }
}

/** The published form (or an admin's draft in preview mode); falls back to the built-in form if the API is down */
export function useFormSchema() {
  const [form, setForm] = useState<PublishedForm | null>(null);
  useEffect(() => {
    const draft = readPreview();
    if (draft) {
      setForm({ version: -1, schema: draft, preview: true });
      return;
    }
    let cancelled = false;
    fetchCurrentForm()
      .catch(() => ({ version: 0, schema: DEFAULT_FORM }))
      .then((f) => { if (!cancelled) setForm(f); });
    return () => { cancelled = true; };
  }, []);
  return form;
}

/** Current form plus every saved version, for labelling responses in the admin (version 0 = built-in form) */
export async function fetchFormLibrary(token: string): Promise<{ current: FormSchema; versions: Record<number, FormSchema> }> {
  const [current, res] = await Promise.all([
    fetchCurrentForm(),
    fetch('/api/admin/form/versions', { headers: { Authorization: `Bearer ${token}` } }),
  ]);
  if (!res.ok) throw new Error(`Failed to load form versions (${res.status})`);
  const versions: Record<number, FormSchema> = { 0: DEFAULT_FORM };
  for (const v of (await res.json()) as { version: number; schema: FormSchema }[]) versions[v.version] = v.schema;
  return { current: current.schema, versions };
}
