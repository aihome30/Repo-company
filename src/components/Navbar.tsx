'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/office', label: 'Office' },
    { href: '/attendance', label: 'Absensi' },
    { href: '/order', label: 'Order' },
    { href: '/team', label: 'Team' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 text-white">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.svg" alt="wspend Logo" className="w-10 h-10 rounded-xl shadow-lg transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">wspend</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Intelligence & Tech</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition font-medium ${link.href === '/order' ? 'text-cyan-400 font-bold hover:text-cyan-300' : 'text-slate-300 hover:text-blue-600'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium ${link.href === '/order' ? 'text-cyan-400 font-bold' : 'text-slate-300 hover:text-blue-600'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
