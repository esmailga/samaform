import { useEffect, useState } from 'react';

export type ProjectCategory = 'residential' | 'commercial' | 'garden-terrace';

export type Project = {
  id: number;
  category: ProjectCategory;
  nameEn: string;
  nameAr: string;
  image: string;
};

// `id` doubles as the section anchor on the Projects page (/projects#residential)
export const PROJECT_CATEGORIES = [
  { id: 'residential', titleKey: 'residentialProjects', label: 'Residential' },
  { id: 'commercial', titleKey: 'commercialProjects', label: 'Commercial' },
  { id: 'garden-terrace', titleKey: 'gardenTerrace', label: 'Garden & Terrace' },
] as const satisfies readonly { id: ProjectCategory; titleKey: string; label: string }[];

export const projectName = (project: Project, lang: 'en' | 'ar') =>
  (lang === 'ar' ? project.nameAr || project.nameEn : project.nameEn || project.nameAr);

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  return res.json();
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => { if (!cancelled) { setProjects(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  return { projects, status };
}
