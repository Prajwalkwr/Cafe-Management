import { useState } from 'react';
import CafeImage from './CafeImage.jsx';
import { libraryImages, resolveImage } from '../data/images.js';
import { MENU_CATEGORIES } from '../../shared/site.js';
import { api } from '../services/api.js';
import { formatNpr } from '../utils/format.js';
import { useToast } from '../context/ToastContext.jsx';

const blank = { name: '', category: 'Coffee', description: '', price: '', image: 'himalayan-latte.jpg', available: true };

export default function MenuManager({ items, onReload }) {
  const toast = useToast();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [busyId, setBusyId] = useState('');

  function beginEdit(item) {
    setEditing(item.id);
    setFile(null);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      available: item.available,
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('description', form.description);
    data.append('price', String(form.price));
    data.append('available', String(form.available));
    if (file) data.append('imageFile', file);
    else data.append('image', form.image);
    try {
      if (editing) await api(`/api/menu/${editing}`, { method: 'PATCH', body: data });
      else await api('/api/menu', { method: 'POST', body: data });
      toast({ message: editing ? 'Menu item updated.' : 'Menu item added.' });
      setForm(blank);
      setEditing(null);
      setFile(null);
      await onReload();
    } catch (error) {
      setErrors(error.errors || {});
      toast({ tone: 'error', message: error.message });
    } finally {
      setPending(false);
    }
  }

  async function toggle(item) {
    setBusyId(item.id);
    try {
      await api(`/api/menu/${item.id}`, {
        method: 'PATCH',
        body: {
          name: item.name,
          category: item.category,
          description: item.description,
          price: item.price,
          image: item.image,
          available: !item.available,
        },
      });
      toast({ message: item.available ? 'Marked unavailable.' : 'Marked available.' });
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    } finally {
      setBusyId('');
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setBusyId(item.id);
    try {
      await api(`/api/menu/${item.id}`, { method: 'DELETE' });
      toast({ message: 'Menu item deleted.' });
      if (editing === item.id) {
        setEditing(null);
        setForm(blank);
      }
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-paper p-5">
        <h3 className="display text-3xl">{editing ? 'Edit menu item' : 'Add menu item'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Name</span>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            {errors.name && <span className="text-sm text-terracotta">{errors.name}</span>}
          </label>
          <label>
            <span className="label">Category</span>
            <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {MENU_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="label">Description</span>
            <textarea className="field min-h-24" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            {errors.description && <span className="text-sm text-terracotta">{errors.description}</span>}
          </label>
          <label>
            <span className="label">Price (NPR)</span>
            <input className="field" type="number" min="1" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            {errors.price && <span className="text-sm text-terracotta">{errors.price}</span>}
          </label>
          <label>
            <span className="label">Photo</span>
            <select className="field" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })}>
              {form.image.startsWith('/') && <option value={form.image}>Current upload</option>}
              {libraryImages.map((image) => <option key={image} value={image}>{image}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="label">Or upload a new photo</span>
            <input className="field" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} />
            Available
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Processing...' : editing ? 'Save changes' : 'Add menu item'}</button>
          {editing && (
            <button type="button" className="btn btn-line" onClick={() => { setEditing(null); setForm(blank); setFile(null); }}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
      {!items.length && <p className="text-stone">No menu items yet.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="grid grid-cols-[5rem_1fr] gap-3 rounded-3xl border border-line bg-paper p-3 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
            <CafeImage src={resolveImage(item.image)} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <p className="text-xs tracking-[0.14em] text-stone uppercase">{item.category}</p>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm">{formatNpr(item.price)} · {item.available ? 'Available' : 'Unavailable'}</p>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1">
              <button type="button" className="btn btn-line btn-small" onClick={() => beginEdit(item)}>Edit</button>
              <button type="button" className="btn btn-line btn-small" disabled={busyId === item.id} onClick={() => toggle(item)}>
                {item.available ? 'Mark unavailable' : 'Mark available'}
              </button>
              <button type="button" className="btn btn-line btn-small" disabled={busyId === item.id} onClick={() => remove(item)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
