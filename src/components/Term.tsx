import { useState, useRef, useEffect } from 'react';
import { getTerm } from '../data/glossary';

interface Props {
  term: string;
  children: React.ReactNode;
}

export default function Term({ term, children }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const def = getTerm(term);

  useEffect(() => {
    function handler(e: MouseEvent | KeyboardEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!def) return <>{children}</>;

  return (
    <span ref={ref} className="relative inline">
      <button
        className="term text-inherit font-inherit text-left"
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
        aria-expanded={open}
        aria-label={`Definition of ${term}`}
      >
        {children}
      </button>
      {open && (
        <span
          className="absolute z-50 left-0 top-full mt-2 w-72 bg-surface border border-border shadow-lg p-4 text-sm text-fg font-sans"
          role="tooltip"
        >
          <span className="block font-semibold text-accent mb-1">{def.term}</span>
          <span className="block leading-relaxed mb-2">{def.plain}</span>
          <span className="block font-mono text-xs text-muted border-t border-border pt-2 leading-relaxed">
            e.g. {def.example}
          </span>
        </span>
      )}
    </span>
  );
}
