import { motion } from 'framer-motion';

export default function Validation() {
  return (
    <div className="min-h-screen pt-32 px-12 max-w-6xl mx-auto">
      <h1 className="font-sans font-extrabold text-5xl mb-12">VALIDATION</h1>
      
      <div className="mb-16">
        <h2 className="font-mono text-sm text-muted mb-6">STAGE 1 &mdash; REAL GITHUB VALIDATION</h2>
        <div className="grid grid-cols-3 gap-6">
          {['A1', 'A2', 'A3'].map((fix) => (
            <div key={fix} className="border border-border p-6 flex justify-between items-center bg-white/30">
              <span className="font-sans font-bold text-2xl">{fix}</span>
              <span className="font-mono text-sm text-green-600 bg-green-100 px-2 py-1">PASSED</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="font-mono text-sm text-muted mb-6">METRICS</h2>
        <div className="grid grid-cols-4 gap-x-8 gap-y-12">
          {[
            { label: 'Detection rate', val: '100%' },
            { label: 'False-positive rate', val: '0%' },
            { label: 'Median analysis time', val: '0.4s' },
            { label: 'P95 analysis time', val: '0.8s' }
          ].map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-mono text-xs text-muted mb-2">{m.label}</span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="font-sans font-bold text-4xl"
              >
                {m.val}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}