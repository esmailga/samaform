import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ImagePlus, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { fetchProjects, PROJECT_CATEGORIES, type Project, type ProjectCategory } from '../../api/projects';

const GLASS_CLASSES = "bg-header/40 backdrop-blur-xl border border-white/10";
const INPUT_CLASSES = "w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-white focus:outline-none focus:border-main-text";
const LABEL_CLASSES = "block text-xs uppercase tracking-widest text-white/60 mb-2";

// Large photos are downscaled in the browser so uploads stay well under PHP's upload limit (2 MB by default)
async function prepareImage(file: File): Promise<Blob> {
  const MAX_SIDE = 2000;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
    // Some browsers can't encode WebP and silently return PNG, so fall back to JPEG
    const webp = await toBlob('image/webp');
    if (webp && webp.type === 'image/webp') return webp;
    return (await toBlob('image/jpeg')) ?? file;
  } catch {
    return file; // formats the browser can't decode are sent as-is and checked by the server
  }
}

type FormValues = { category: ProjectCategory; nameEn: string; nameAr: string; image: File | null };

function ProjectForm({ initial, submitLabel, onSubmit }: {
  initial?: Project;
  submitLabel: string;
  onSubmit: (values: FormValues) => Promise<string | null>;
}) {
  const [values, setValues] = useState<FormValues>({
    category: initial?.category ?? 'residential',
    nameEn: initial?.nameEn ?? '',
    nameAr: initial?.nameAr ?? '',
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!values.image) return;
    const url = URL.createObjectURL(values.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initial && !values.image) {
      setError('Please choose an image');
      return;
    }
    setError('');
    setIsSaving(true);
    const result = await onSubmit(values);
    setIsSaving(false);
    if (result) {
      setError(result);
    } else if (!initial) {
      setValues({ category: values.category, nameEn: '', nameAr: '', image: null });
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-4 md:gap-6">
      <label className="relative block w-full max-w-[180px] mx-auto sm:max-w-none aspect-[4/5] rounded-2xl border-2 border-dashed border-main-text/30 hover:border-main-text/60 bg-white/5 overflow-hidden cursor-pointer transition-colors">
        {preview ? (
          <img src={preview} alt="Project preview" className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50 text-sm">
            <ImagePlus size={28} className="text-main-text" />
            Choose image
          </span>
        )}
        {preview && (
          <span className="absolute bottom-2 inset-x-2 text-center text-xs py-1.5 rounded-lg bg-black/60 text-white/90">Change image</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setValues({ ...values, image: e.target.files?.[0] ?? null })}
        />
      </label>

      <div className="flex flex-col gap-4">
        <div>
          <label className={LABEL_CLASSES} htmlFor={`category-${initial?.id ?? 'new'}`}>Category</label>
          {/* The native arrow ignores padding, so it's replaced with an icon inside the field */}
          <div className="relative">
            <select
              id={`category-${initial?.id ?? 'new'}`}
              value={values.category}
              onChange={(e) => setValues({ ...values, category: e.target.value as ProjectCategory })}
              className={`${INPUT_CLASSES} appearance-none pe-11 cursor-pointer [&>option]:bg-header`}
            >
              {PROJECT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASSES} htmlFor={`name-en-${initial?.id ?? 'new'}`}>Name (English)</label>
            <input
              id={`name-en-${initial?.id ?? 'new'}`}
              type="text"
              value={values.nameEn}
              onChange={(e) => setValues({ ...values, nameEn: e.target.value })}
              maxLength={120}
              required
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label className={LABEL_CLASSES} htmlFor={`name-ar-${initial?.id ?? 'new'}`}>Name (Arabic)</label>
            <input
              id={`name-ar-${initial?.id ?? 'new'}`}
              type="text"
              dir="rtl"
              value={values.nameAr}
              onChange={(e) => setValues({ ...values, nameAr: e.target.value })}
              maxLength={120}
              required
              className={INPUT_CLASSES}
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="mt-auto self-start inline-flex items-center gap-2 bg-main-text text-header font-medium px-6 py-3 rounded-xl hover:bg-main-text/90 transition-colors disabled:opacity-50"
        >
          {!initial && <Plus size={18} />}
          {isSaving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsManager({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState<Project | null>(null);

  const load = async () => {
    try {
      setProjects(await fetchProjects());
      setLoadError('');
    } catch {
      setLoadError('Could not load projects. Check that the API server is running (npm run api), then press Refresh.');
    }
  };

  useEffect(() => { load(); }, []);

  // Returns an error message for the form, or null on success
  const save = async (values: FormValues, id?: number): Promise<string | null> => {
    const body = new FormData();
    body.append('category', values.category);
    body.append('nameEn', values.nameEn.trim());
    body.append('nameAr', values.nameAr.trim());
    if (values.image) body.append('image', await prepareImage(values.image), values.image.name);
    try {
      const res = await fetch(id ? `/api/admin/projects/${id}` : '/api/admin/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      if (res.status === 401) { onUnauthorized(); return 'Your session expired. Please log in again.'; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return data.error || 'Could not save the project';
      await load();
      return null;
    } catch {
      return 'Connection error';
    }
  };

  const remove = async (project: Project) => {
    if (!confirm(`Delete "${project.nameEn}"? This removes it from the Projects page.`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return onUnauthorized();
      if (res.ok) load();
      else alert('Could not delete the project');
    } catch {
      alert('Connection error');
    }
  };

  return (
    <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl text-main-text">Projects</h2>
          <p className="text-white/40 text-sm mt-1">Add, edit or remove the projects shown on the Projects page</p>
        </div>
        <button onClick={load} className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <section className={`rounded-2xl p-4 md:p-6 mb-8 md:mb-10 ${GLASS_CLASSES}`}>
        <h3 className="text-xs uppercase tracking-widest text-main-text mb-4 md:mb-6">Add a project</h3>
        <ProjectForm submitLabel="Add project" onSubmit={(values) => save(values)} />
      </section>

      {loadError && <p className="text-red-400 text-sm mb-6">{loadError}</p>}

      <div className="space-y-8 md:space-y-10">
        {PROJECT_CATEGORIES.map((category) => {
          const items = projects.filter((p) => p.category === category.id);
          return (
            <section key={category.id}>
              <h3 className="text-xs uppercase tracking-widest text-main-text mb-4 border-b border-main-text/20 pb-2">
                {category.label} <span className="text-white/40">({items.length})</span>
              </h3>
              {items.length === 0 ? (
                <p className="text-white/40 text-sm">No projects yet. This category is hidden on the site until you add one.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {items.map((project) => (
                    <div key={project.id} className={`rounded-xl overflow-hidden ${GLASS_CLASSES}`}>
                      <div className="relative">
                        <img src={project.image} alt={project.nameEn} loading="lazy" className="w-full aspect-[4/5] object-cover" />
                        {/* Actions sit on the image so the names get the card's full width */}
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <button onClick={() => setEditing(project)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white/90 hover:text-main-text transition-colors" title="Edit" aria-label={`Edit ${project.nameEn}`}>
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => remove(project)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white/90 hover:text-red-400 transition-colors" title="Delete" aria-label={`Delete ${project.nameEn}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 min-w-0">
                        <p className="text-sm text-white/90 truncate" title={project.nameEn}>{project.nameEn}</p>
                        <p className="text-sm text-white/50 truncate text-right" dir="rtl" lang="ar" title={project.nameAr}>{project.nameAr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl ${GLASS_CLASSES} bg-header/90 p-4 md:p-8`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl text-main-text">Edit project</h3>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white" aria-label="Close">
                  <X size={24} />
                </button>
              </div>
              <ProjectForm
                key={editing.id}
                initial={editing}
                submitLabel="Save changes"
                onSubmit={async (values) => {
                  const result = await save(values, editing.id);
                  if (!result) setEditing(null);
                  return result;
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
