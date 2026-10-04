import { glossary } from '../data/glossary';

export default function Glossary() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="min-h-screen bg-bg pt-24 px-8 lg:px-20 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Plain-English key</p>
        <h1 className="font-serif text-[clamp(36px,5vw,60px)] leading-tight text-fg mb-4">
          Every term, defined.
        </h1>
        <p className="font-sans text-lg text-secondary mb-12 leading-relaxed">
          If you hit a word on this site you do not understand, it is here. Dotted-underline words anywhere on the site show the same definition when you click them.
        </p>
        <div className="space-y-0 border border-border divide-y divide-border">
          {sorted.map((g, i) => (
            <div key={i} className="px-6 py-6">
              <div className="font-serif text-xl text-fg mb-2">{g.term}</div>
              <div className="font-sans text-base text-secondary leading-relaxed mb-3">{g.plain}</div>
              <div className="font-mono text-xs text-muted border-l-2 border-border pl-3 leading-relaxed">
                e.g. {g.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
