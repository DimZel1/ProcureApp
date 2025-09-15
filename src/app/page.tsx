'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

type FormState = {
  title: string;
  description?: string;
  client?: string;
  priority: 'Low' | 'Normal' | 'High';
  dueDate?: string;
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    client: '',
    priority: 'Normal',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : 'Failed');
      setMessage(`Created: ${data.data.reference}`);
      setForm({ title: '', description: '', client: '', priority: 'Normal', dueDate: '' });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sidebar>
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Create Requisition</h1>
        <p className="text-sm text-gray-600 mb-4">Title is required. Reference is auto-generated as RPT-YY-####-RQ.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., PPE order for vessel A"
            />
          </div>
          <div>
            <label className="label">Client</label>
            <input className="input"
              value={form.client}
              onChange={e => setForm({ ...form, client: e.target.value })}
              placeholder="e.g., Vessel A / Dept"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional notes"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as any })}>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input className="input" type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="flex items-end">
              <button className="btn" disabled={loading}>{loading ? 'Saving…' : 'Create'}</button>
            </div>
          </div>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </Sidebar>
  );
}
