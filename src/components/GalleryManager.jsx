import { useState } from 'react';
import CafeImage from './CafeImage.jsx';
import { libraryImages, resolveImage } from '../data/images.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

const blank = { title: '', alt: '', image: 'mithaas-interior.jpg', visible: true, order: 0 };

export default function GalleryManager({ items, onReload }) {
  const toast = useToast();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const data = new FormData();
    data.append('title', form.title);
    data.append('alt', form.alt);
    data.append('visible', String(form.visible));
    data.append('order', String(form.order || 0));
    if (file) data.append('imageFile', file);
    else data.append('image', form.image);
    try {
      if (editing) await api(`/api/gallery/${editing}`, { method: 'PATCH', body: data });
      else await api('/api/gallery', { method: 'POST', body: data });
      toast({ message: editing ? 'Gallery photo updated.' : 'Gallery photo added.' });
      setForm(blank);
      setEditing(null);
      setFile(null);
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    } finally {
      setPending(false);
    }
  }

  async function toggle(item) {
    try {
      await api(`/api/gallery/${item.id}`, {
        method: 'PATCH',
        body: { title: item.title, alt: item.alt, image: item.image, visible: !item.visible, order: item.order },
      });
      toast({ message: item.visible ? 'Photo hidden from the gallery.' : 'Photo visible on the site.' });
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    }
  }

  async function remove(item) {
    if (!window.confirm(`Remove ${item.title}?`)) return;
    try {
      await api(`/api/gallery/${item.id}`, { method: 'DELETE' });
      toast({ message: 'Gallery photo removed.' });
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-paper p-5">
        <h3 className="display text-3xl">{editing ? 'Edit photo' : 'Add gallery photo'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Title</span>
            <input className="field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          <label>
            <span className="label">Order</span>
            <input className="field" type="number" min="0" value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Alt text</span>
            <input className="field" value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} required />
          </label>
          <label>
            <span className="label">Library photo</span>
            <select className="field" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })}>
              {libraryImages.map((image) => <option key={image} value={image}>{image}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Upload</span>
            <input className="field" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visible} onChange={(event) => setForm({ ...form, visible: event.target.checked })} />
            Visible on the website
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? 'Processing...' : editing ? 'Save photo' : 'Add photo'}</button>
          {editing && <button type="button" className="btn btn-line" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>
      {!items.length && <p className="text-stone">The gallery is empty.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl border border-line bg-paper">
            <CafeImage src={resolveImage(item.image)} alt={item.alt} className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-stone">{item.visible ? 'Visible' : 'Hidden'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-line btn-small" onClick={() => { setEditing(item.id); setForm({ title: item.title, alt: item.alt, image: item.image.startsWith('/') ? 'mithaas-interior.jpg' : item.image, visible: item.visible, order: item.order }); }}>Edit</button>
                <button type="button" className="btn btn-line btn-small" onClick={() => toggle(item)}>{item.visible ? 'Hide' : 'Show'}</button>
                <button type="button" className="btn btn-line btn-small" onClick={() => remove(item)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
