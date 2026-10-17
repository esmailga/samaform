import type { jsPDF as JsPDF } from 'jspdf';
import { translations } from '../../data/translations';
import { convertArabicToWestern } from '../../utils/numbers';
import type { FormField, FormSchema } from '../../form/schema';

// ---------------------------------------------------------------------------
// Responses described with the editable form (src/form/schema.ts). Labels come from the current form, so
// edits in Admin > Form show up here; questions since removed are labelled from the form version the
// response was submitted with.
// ---------------------------------------------------------------------------

export type ResponseRecord = { id: number; created_at: string; form_version?: number; data: Record<string, any> };
export type ResponseField = { id: string; label: string; value: string; long?: boolean };
export type ResponseSection = { title: string; fields: ResponseField[] };
export type ImageGroup = { id: string; title: string; urls: string[] };
/** The current form plus every saved version (0 = the form built into the site) */
export type FormLibrary = { current: FormSchema; versions: Record<number, FormSchema> };

const en = translations.en as Record<string, string>;

const humanize = (id: string) => id.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
const isEmpty = (v: unknown) =>
  v === undefined || v === null || v === '' || v === '[]' ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0);
const toList = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : isEmpty(v) ? [] : [String(v)]);

const number = (value: unknown) => {
  const n = Number(convertArabicToWestern(String(value)).replace(/,/g, ''));
  return Number.isFinite(n) ? n.toLocaleString('en-US') : String(value);
};

const fieldsOf = (schema: FormSchema) => schema.steps.flatMap((s) => s.fields);

/** Every definition of a field, newest first: current form, the response's own version, then older versions */
function definitions(lib: FormLibrary, version: number, id: string): FormField[] {
  const schemas = [lib.current, lib.versions[version], ...Object.keys(lib.versions).map(Number).sort((a, b) => b - a).map((v) => lib.versions[v])];
  return schemas.flatMap((schema) => (schema ? fieldsOf(schema).filter((f) => f.id === id) : []));
}

function optionLabel(defs: FormField[], optionId: string) {
  for (const def of defs) {
    const option = def.options?.find((o) => o.id === optionId);
    if (option) return option.label.en;
  }
  return humanize(optionId);
}

/** Readable English answer to one question ('' when unanswered) */
function formatAnswer(defs: FormField[], data: Record<string, any>): string {
  const field = defs[0];
  const value = data[field.id];
  if (field.type === 'images') return '';
  if (field.type === 'choice' || field.type === 'cards') {
    const chosen = toList(value).map((id) => optionLabel(defs, id)).join(', ');
    if (chosen) return chosen;
    const exact = field.exact && data[field.exact.id];
    return field.exact && !isEmpty(exact) ? `${field.exact.prefix ?? ''}${number(exact)}${field.exact.suffix ?? ''}` : '';
  }
  return isEmpty(value) ? '' : Array.isArray(value) ? value.join(', ') : String(value);
}

const imagesIn = (value: unknown): string[] => (Array.isArray(value) ? value : []).filter((x: unknown): x is string => typeof x === 'string');

export function describeResponse(response: ResponseRecord, lib: FormLibrary): { sections: ResponseSection[]; images: ImageGroup[] } {
  const data = response.data;
  const version = response.form_version ?? 0;
  const handled = new Set(['id', 'created_at']);
  const images: ImageGroup[] = [];
  const answer = (field: FormField): ResponseField | null => {
    handled.add(field.id);
    if (field.exact) handled.add(field.exact.id);
    if (field.type === 'images') {
      const urls = imagesIn(data[field.id]);
      if (urls.length) images.push({ id: field.id, title: field.label.en, urls });
      return null;
    }
    const value = formatAnswer(definitions(lib, version, field.id), data);
    return value ? { id: field.id, label: field.label.en, value, long: field.type === 'textarea' } : null;
  };

  const sections: ResponseSection[] = lib.current.steps.map((step) => ({
    title: step.title.en,
    fields: step.fields.map(answer).filter((f): f is ResponseField => !!f),
  }));

  // Answers to questions that have since been removed from the form
  const removed: ResponseField[] = [];
  for (const key of Object.keys(data)) {
    if (handled.has(key)) continue;
    const old = definitions(lib, version, key)[0];
    if (old) {
      const f = answer(old);
      if (f) removed.push(f);
    }
  }
  sections.push({ title: 'Questions no longer in the form', fields: removed });

  // Anything else that was stored but no form version knows about
  sections.push({
    title: 'Other details',
    fields: Object.entries(data)
      .filter(([key, value]) => !handled.has(key) && !isEmpty(value) && !['specifics', 'budget'].includes(key))
      .map(([key, value]) => ({ id: key, label: humanize(key), value: Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value) })),
  });

  return { sections: sections.filter((s) => s.fields.length > 0), images };
}

/** Formatted answer to one question by its id, e.g. for the responses table */
export function responseValue(response: ResponseRecord, lib: FormLibrary, key: string) {
  const defs = definitions(lib, response.form_version ?? 0, key);
  return defs.length ? formatAnswer(defs, response.data) : String(response.data[key] ?? '');
}

// SQLite's CURRENT_TIMESTAMP is UTC ("2026-04-08 23:59:09"), so parse it as UTC rather than local time
export const parseSubmitted = (createdAt: string) => new Date(`${createdAt.replace(' ', 'T')}Z`);
export const referenceNumber = (id: number) => `SF-${String(id).padStart(4, '0')}`;
const formatDate = (d: Date) =>
  d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ---------------------------------------------------------------------------
// Company details printed on exports
// ---------------------------------------------------------------------------

const COMPANY = {
  name: 'SAMAFORM',
  tagline: 'ARCHITECTURE & INTERIOR DESIGN',
  address: `${en.studioAddress}, Yemen`,
  phones: [en.studioPhone1, en.studioPhone2],
  email: en.studioEmail,
  instagram: '@samaform.ye',
};

// ---------------------------------------------------------------------------
// Excel
// ---------------------------------------------------------------------------

export async function exportResponsesToExcel(responses: ResponseRecord[], lib: FormLibrary) {
  const XLSX = await import('xlsx');
  const origin = window.location.origin;
  const records = responses.map((r) => ({ r, ...describeResponse(r, lib) }));

  // Columns follow the form's question order, then removed/other questions; questions nobody answered are left out
  const columns = new Map<string, string>();
  const formFields = fieldsOf(lib.current);
  for (const f of formFields) if (f.type !== 'images') columns.set(f.id, f.label.en);
  for (const { sections } of records) for (const s of sections) for (const f of s.fields) if (!columns.has(f.id)) columns.set(f.id, f.label);
  const answered = new Set(records.flatMap(({ sections }) => sections.flatMap((s) => s.fields.map((f) => f.id))));
  const fieldIds = [...columns.keys()].filter((id) => answered.has(id));

  // One link column per uploaded image, grouped by image question
  const imageQuestions = new Map<string, { title: string; max: number }>();
  for (const f of formFields) if (f.type === 'images') imageQuestions.set(f.id, { title: f.label.en, max: 0 });
  for (const { images } of records) {
    for (const g of images) {
      const q = imageQuestions.get(g.id) ?? { title: g.title, max: 0 };
      q.max = Math.max(q.max, g.urls.length);
      imageQuestions.set(g.id, q);
    }
  }
  const imageColumns = [...imageQuestions].flatMap(([id, q]) => Array.from({ length: q.max }, (_, i) => ({ id, index: i, title: `${q.title} ${i + 1}` })));

  const header = ['Reference', 'Submitted', ...fieldIds.map((id) => columns.get(id)!), ...imageColumns.map((c) => c.title)];
  const rows = records.map(({ r, sections, images }) => {
    const values = new Map(sections.flatMap((s) => s.fields.map((f) => [f.id, f.value] as const)));
    return [
      referenceNumber(r.id),
      parseSubmitted(r.created_at),
      ...fieldIds.map((id) => values.get(id) ?? ''),
      ...imageColumns.map((c) => (images.find((g) => g.id === c.id)?.urls[c.index] ? 'View image' : '')),
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows], { cellDates: true, dateNF: 'yyyy-mm-dd hh:mm' });

  // Image cells link to the full-size upload
  const firstImageCol = 2 + fieldIds.length;
  records.forEach(({ images }, rowIndex) => {
    imageColumns.forEach((c, i) => {
      const path = images.find((g) => g.id === c.id)?.urls[c.index];
      const cell = path && ws[XLSX.utils.encode_cell({ r: rowIndex + 1, c: firstImageCol + i })];
      if (cell) cell.l = { Target: new URL(path, origin).href, Tooltip: 'Open image' };
    });
  });

  // Column widths sized to content (long notes are capped so the sheet stays readable)
  ws['!cols'] = header.map((h, c) => {
    const longest = Math.max(h.length, ...rows.map((row) => (row[c] instanceof Date ? 16 : String(row[c] ?? '').length)));
    return { wch: Math.min(Math.max(longest + 2, 10), 60) };
  });
  ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }) };

  const wb = XLSX.utils.book_new();
  wb.Props = { Title: 'Project requests', Author: COMPANY.name, Company: COMPANY.name };
  XLSX.utils.book_append_sheet(wb, ws, 'Project requests');
  XLSX.writeFile(wb, `${COMPANY.name}-project-requests-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ---------------------------------------------------------------------------
// PDF
// ---------------------------------------------------------------------------

const BRAND = { dark: '#2b3a45', gold: '#bf976e', text: '#26323a', muted: '#7b858c', line: '#e4dfd8', soft: '#f6f3ef', light: '#e6e9eb' };

async function fetchBase64(url: string) {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

type LoadedImage = { data: string; width: number; height: number; format: 'PNG' | 'JPEG' };

// Draws the image onto a canvas so any format the browser can show (AVIF, WebP, ...) can go into the PDF
function loadImage(url: string, { maxSide = 1400, keepAlpha = false } = {}): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas unavailable'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({
        data: canvas.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', 0.82),
        width: canvas.width,
        height: canvas.height,
        format: keepAlpha ? 'PNG' : 'JPEG',
      });
    };
    img.onerror = () => reject(new Error(`Could not load ${url}`));
    img.src = url;
  });
}

// jsPDF shapes Arabic itself; these options make its bidi engine order each line correctly
const RTL_OPTIONS = { isInputVisual: false, isInputRtl: true, isOutputVisual: true, isOutputRtl: false, isSymmetricSwapping: true };
const LTR_OPTIONS = { isInputVisual: false, isInputRtl: false, isOutputVisual: true, isOutputRtl: false, isSymmetricSwapping: true };
const startsRtl = (s: string) => {
  const first = s.match(/[A-Za-z؀-ۿ]/);
  return !!first && /[؀-ۿ]/.test(first[0]);
};

export async function exportResponseToPDF(response: ResponseRecord, lib: FormLibrary) {
  const { jsPDF } = await import('jspdf');
  const [regular, bold, icon, wordmark] = await Promise.all([
    fetchBase64('/fonts/Cairo-Regular.ttf'),
    fetchBase64('/fonts/Cairo-Bold.ttf'),
    loadImage('/logo2.png', { maxSide: 400, keepAlpha: true }),
    loadImage('/logo3.png', { maxSide: 900, keepAlpha: true }),
  ]);

  const doc: JsPDF = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.addFileToVFS('Cairo-Regular.ttf', regular);
  doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');
  doc.addFileToVFS('Cairo-Bold.ttf', bold);
  doc.addFont('Cairo-Bold.ttf', 'Cairo', 'bold');

  const W = 210, H = 297, M = 16, CW = W - M * 2;
  const BOTTOM = H - 20;
  const ref = referenceNumber(response.id);
  const submitted = formatDate(parseSubmitted(response.created_at));
  let y = 0;

  const setText = (size: number, color: string, weight: 'normal' | 'bold' = 'normal') => {
    doc.setFont('Cairo', weight);
    doc.setFontSize(size);
    doc.setTextColor(color);
  };

  // Writes one line with the correct letter order for its language. Short values always start at the left
  // edge like the rest of the English report; Arabic paragraphs (alignToText) are right-aligned.
  const line = (text: string, x: number, lineY: number, width: number, alignToText = false) => {
    const rtl = startsRtl(text);
    const toRight = alignToText && rtl;
    doc.text(text, toRight ? x + width : x, lineY, { align: toRight ? 'right' : 'left', ...(rtl ? RTL_OPTIONS : LTR_OPTIONS) } as any);
  };

  // Wrapped value; returns the height used
  const paragraph = (text: string, x: number, topY: number, width: number, leading: number) => {
    const lines: string[] = text.split(/\r?\n/).flatMap((p) => doc.splitTextToSize(p, width) as string[]);
    lines.forEach((l, i) => line(l, x, topY + i * leading, width));
    return lines.length * leading;
  };

  const measure = (text: string, width: number, leading: number) =>
    text.split(/\r?\n/).flatMap((p) => doc.splitTextToSize(p, width) as string[]).length * leading;

  const drawFirstHeader = () => {
    doc.setFillColor(BRAND.dark);
    doc.rect(0, 0, W, 42, 'F');
    doc.setFillColor(BRAND.gold);
    doc.rect(0, 42, W, 1.1, 'F');

    doc.addImage(icon.data, icon.format, M, 11, 19, 19 * (icon.height / icon.width));
    const markH = 5.4;
    doc.addImage(wordmark.data, wordmark.format, M + 25, 14.2, markH * (wordmark.width / wordmark.height), markH);
    setText(6.5, '#c9cfd3');
    doc.text(COMPANY.tagline, M + 25, 25.5, { charSpace: 0.55 });

    setText(8, BRAND.light);
    const right = W - M;
    doc.text(COMPANY.address, right, 15, { align: 'right' });
    doc.text(`Tel  ${COMPANY.phones.join('   |   ')}`, right, 20.5, { align: 'right' });
    doc.text(COMPANY.email, right, 26, { align: 'right' });
    doc.text(`Instagram  ${COMPANY.instagram}`, right, 31.5, { align: 'right' });
  };

  const drawContinuationHeader = () => {
    doc.setFillColor(BRAND.dark);
    doc.rect(0, 0, W, 15, 'F');
    doc.setFillColor(BRAND.gold);
    doc.rect(0, 15, W, 0.8, 'F');
    const markH = 3.6;
    doc.addImage(wordmark.data, wordmark.format, M, 5.7, markH * (wordmark.width / wordmark.height), markH);
    setText(8, BRAND.light);
    doc.text(`Project request  ·  ${ref}`, W - M, 9.3, { align: 'right' });
  };

  const newPage = () => {
    doc.addPage();
    drawContinuationHeader();
    y = 26;
  };
  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM) newPage();
  };

  const sectionTitle = (title: string, minFollowing = 14) => {
    ensureSpace(12 + minFollowing);
    setText(8.5, BRAND.gold, 'bold');
    doc.text(title.toUpperCase(), M, y, { charSpace: 0.45 });
    doc.setDrawColor(BRAND.line);
    doc.setLineWidth(0.3);
    doc.line(M, y + 2.5, W - M, y + 2.5);
    y += 9;
  };

  // --- Page 1 header and title block
  drawFirstHeader();
  y = 57;
  setText(20, BRAND.text, 'bold');
  doc.text('Project Request', M, y);
  setText(9, BRAND.muted);
  const clientName = String(response.data.name || '').trim();
  if (clientName) line(`Prepared for ${clientName}`, M, y + 7, CW * 0.6);

  // Reference box
  const boxW = 62, boxX = W - M - boxW, boxY = 47;
  doc.setFillColor(BRAND.soft);
  doc.roundedRect(boxX, boxY, boxW, 22, 2, 2, 'F');
  setText(6.5, BRAND.muted, 'bold');
  doc.text('REFERENCE', boxX + 5, boxY + 6.5, { charSpace: 0.4 });
  doc.text('SUBMITTED', boxX + 5, boxY + 15, { charSpace: 0.4 });
  setText(9.5, BRAND.text, 'bold');
  doc.text(ref, boxX + boxW - 5, boxY + 6.8, { align: 'right' });
  setText(8.5, BRAND.text);
  doc.text(submitted, boxX + boxW - 5, boxY + 15.3, { align: 'right' });
  y = 82;

  // --- Answer sections: short answers in two columns, notes at full width
  const GAP = 10, COL = (CW - GAP) / 2;
  const LABEL = 7, VALUE = 10, LEAD = 5;

  const { sections, images } = describeResponse(response, lib);
  for (const section of sections) {
    const short = section.fields.filter((f) => !f.long);
    const long = section.fields.filter((f) => f.long);
    // Keep the heading on the same page as at least its first row or the start of its first note
    setText(VALUE, BRAND.text);
    const firstBlock = short.length
      ? 9 + Math.max(...short.slice(0, 2).map((f) => measure(f.value, COL, LEAD)))
      : 9 + Math.min(measure(long[0].value, CW - 10, LEAD), 40) + 6;
    sectionTitle(section.title, firstBlock);

    for (let i = 0; i < short.length; i += 2) {
      const pair = short.slice(i, i + 2);
      setText(VALUE, BRAND.text);
      const rowH = 5 + Math.max(...pair.map((f) => measure(f.value, COL, LEAD)));
      ensureSpace(rowH + 4);
      pair.forEach((field, c) => {
        const x = M + c * (COL + GAP);
        setText(LABEL, BRAND.muted, 'bold');
        doc.text(field.label.toUpperCase(), x, y, { charSpace: 0.3 });
        setText(VALUE, BRAND.text);
        paragraph(field.value, x, y + 5.2, COL, LEAD);
      });
      y += rowH + 4;
    }

    for (const field of long) {
      setText(VALUE, BRAND.text);
      const bodyH = measure(field.value, CW - 10, LEAD);
      ensureSpace(Math.min(bodyH, 40) + 16);
      setText(LABEL, BRAND.muted, 'bold');
      doc.text(field.label.toUpperCase(), M, y, { charSpace: 0.3 });
      y += 3;
      // Long notes may span pages: draw them line by line inside a soft panel
      setText(VALUE, BRAND.text);
      const lines: string[] = field.value.split(/\r?\n/).flatMap((p) => doc.splitTextToSize(p, CW - 10) as string[]);
      let start = 0;
      while (start < lines.length) {
        const fit = Math.max(1, Math.min(lines.length - start, Math.floor((BOTTOM - y - 6) / LEAD)));
        const chunk = lines.slice(start, start + fit);
        const panelH = chunk.length * LEAD + 6;
        doc.setFillColor(BRAND.soft);
        doc.roundedRect(M, y, CW, panelH, 2, 2, 'F');
        setText(VALUE, BRAND.text);
        chunk.forEach((l, k) => line(l, M + 5, y + 6.5 + k * LEAD, CW - 10, true));
        y += panelH + 5;
        start += fit;
        if (start < lines.length) newPage();
      }
    }
    y += 3;
  }

  // --- Images: three per row, scaled to fit without cropping or stretching
  const imageGroups = images;

  for (const group of imageGroups) {
    const loaded = await Promise.all(group.urls.map((u) => loadImage(u).catch(() => null)));
    const CELL_GAP = 5, CELL_W = (CW - CELL_GAP * 2) / 3, CELL_H = 44;
    sectionTitle(`${group.title} (${group.urls.length})`, CELL_H);
    for (let i = 0; i < loaded.length; i += 3) {
      ensureSpace(CELL_H + CELL_GAP);
      loaded.slice(i, i + 3).forEach((img, c) => {
        const x = M + c * (CELL_W + CELL_GAP);
        doc.setFillColor(BRAND.soft);
        doc.roundedRect(x, y, CELL_W, CELL_H, 1.5, 1.5, 'F');
        if (!img) {
          setText(7.5, BRAND.muted);
          doc.text('Image unavailable', x + CELL_W / 2, y + CELL_H / 2, { align: 'center' });
          return;
        }
        const scale = Math.min(CELL_W / img.width, CELL_H / img.height);
        const w = img.width * scale, h = img.height * scale;
        doc.addImage(img.data, img.format, x + (CELL_W - w) / 2, y + (CELL_H - h) / 2, w, h);
      });
      y += CELL_H + CELL_GAP;
    }
    y += 3;
  }

  // --- Footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(BRAND.line);
    doc.setLineWidth(0.3);
    doc.line(M, H - 13, W - M, H - 13);
    setText(7, BRAND.muted);
    doc.text(`${COMPANY.name}  ·  ${COMPANY.email}  ·  ${COMPANY.phones[0]}`, M, H - 8.5);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 8.5, { align: 'right' });
  }

  doc.setProperties({ title: `Project request ${ref}`, author: COMPANY.name, creator: COMPANY.name });
  doc.save(`${COMPANY.name}-request-${ref}.pdf`);
}
