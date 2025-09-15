'use client';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Requisition = {
  id: string;
  reference: string;
  title: string;
  client?: string;
  priority: string;
  createdAt: string;
}

export default function RequisitionsPage() {
  const [rows, setRows] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/requisitions');
      const json = await res.json();
      setRows(json.data);
      setLoading(false);
    })();
  }, []);

  return (
    <Sidebar>
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Saved Requisitions</h1>
        {loading ? <p>Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 pr-4 font-mono">{r.reference}</td>
                    <td className="py-2 pr-4">{r.title}</td>
                    <td className="py-2 pr-4">{r.client ?? '-'}</td>
                    <td className="py-2 pr-4">{r.priority}</td>
                    <td className="py-2 pr-4">{format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
