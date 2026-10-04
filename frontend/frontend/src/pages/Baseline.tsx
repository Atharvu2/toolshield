export default function Baseline() {
  const data = [
    { fix: 'A1', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'A2', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'A3', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'C1', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'C2', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'C3', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'B4', z: 'DETECTED', p: 'DETECTED', r: 'DETECTED', t: 'ALLOW' },
  ];

  return (
    <div className="min-h-screen pt-32 px-12 max-w-6xl mx-auto">
      <h1 className="font-sans font-extrabold text-5xl mb-4">BASELINE</h1>
      <p className="text-xl text-muted mb-12">ToolShield complements existing workflow security analysis.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b-2 border-border text-muted">
              <th className="py-4 px-4">FIXTURE</th>
              <th className="py-4 px-4">ZIZMOR</th>
              <th className="py-4 px-4">POUTINE</th>
              <th className="py-4 px-4">RUNNER-GUARD</th>
              <th className="py-4 px-4 text-fg">TOOLSHIELD</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-white/30 transition-colors">
                <td className="py-4 px-4 font-bold">{row.fix}</td>
                <td className="py-4 px-4 opacity-70">{row.z}</td>
                <td className="py-4 px-4 opacity-70">{row.p}</td>
                <td className="py-4 px-4 opacity-70">{row.r}</td>
                <td className={`py-4 px-4 font-bold ${row.t === 'BLOCK' ? 'text-critical' : 'text-fg'}`}>{row.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}