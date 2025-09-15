'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) setOpen(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-open', String(open));
  }, [open]);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn m-3 fixed z-20 top-2 left-2"
        aria-label="Toggle menu"
      >
        {open ? 'Hide Menu' : 'Show Menu'}
      </button>
      <aside className={clsx('sidebar z-10', !open && 'sidebar-hidden')}>
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <nav className="space-y-2">
          <Link className="block btn w-full text-left" href="/">Create Requisition</Link>
          <Link className="block btn w-full text-left" href="/requisitions">Saved Requisitions</Link>
        </nav>
        <p className="mt-6 text-xs text-gray-500">v0.3 — Postgres + yearly refs.</p>
      </aside>
      <main className="container pt-16">{children}</main>
    </div>
  );
}
