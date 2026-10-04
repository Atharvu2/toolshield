import Term from '../components/Term';

const fixtures = [
  {
    id: 'A1',
    story: 'A stranger writes hidden instructions in a pull request comment. The AI agent reads it and posts a comment that triggers a privileged workflow.',
    correct: 'BLOCK',
    zizmor: 'Not detected',
    poutine: 'Not detected',
    runner: 'Not detected',
    ts: 'BLOCK',
  },
  {
    id: 'A2',
    story: 'A stranger\'s pull request description causes an AI agent to apply the label "safe-to-test". A second workflow trusts that label and runs with secrets.',
    correct: 'BLOCK',
    zizmor: 'Not detected',
    poutine: 'Not detected',
    runner: 'Not detected',
    ts: 'BLOCK',
  },
  {
    id: 'A3',
    story: 'A stranger triggers a repository_dispatch event through an AI agent. A privileged workflow listens for that event.',
    correct: 'BLOCK',
    zizmor: 'Not detected',
    poutine: 'Not detected',
    runner: 'Not detected',
    ts: 'BLOCK',
  },
  {
    id: 'C1',
    story: 'An AI agent applies a label, but the workflow that watches for it has no access to secrets. There is no privileged job downstream.',
    correct: 'ALLOW',
    zizmor: 'Allow',
    poutine: 'Allow',
    runner: 'Allow',
    ts: 'ALLOW',
  },
  {
    id: 'C2',
    story: 'A human (not an AI agent) applies the label. The path does not go through an agent, so TSE-001 does not apply.',
    correct: 'ALLOW',
    zizmor: 'Allow',
    poutine: 'Allow',
    runner: 'Allow',
    ts: 'ALLOW',
  },
  {
    id: 'C3',
    story: 'An AI agent sends an event, but no workflow is listening for it. There is no consumer.',
    correct: 'ALLOW',
    zizmor: 'Allow',
    poutine: 'Allow',
    runner: 'Allow',
    ts: 'ALLOW',
  },
  {
    id: 'B4',
    story: 'There is no AI agent in this repository at all. A normal workflow runs with secrets. Other tools may flag this; ToolShield should stay silent.',
    correct: 'ALLOW',
    zizmor: 'Detected',
    poutine: 'Detected',
    runner: 'Detected',
    ts: 'ALLOW',
  },
];

export default function Baseline() {
  return (
    <div className="min-h-screen bg-bg pt-24 px-8 lg:px-20 pb-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Comparison</p>
          <h1 className="font-serif text-[clamp(36px,5vw,60px)] leading-tight text-fg mb-4">
            ToolShield complements existing tools.
          </h1>
          <p className="font-sans text-lg text-secondary leading-relaxed max-w-2xl">
            Existing tools (Zizmor, Poutine, Runner-Guard) inspect one{' '}
            <Term term="workflow">workflow</Term> at a time.
            They cannot see the link between two workflows through an{' '}
            <Term term="AI helper (agent)">AI helper</Term>.
            This table shows how each tool performs on the same seven test cases.
          </p>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-px bg-border mb-10">
          {[
            { prefix: 'A', label: 'Attack', desc: 'A real attack path. The correct answer is BLOCK.' },
            { prefix: 'C', label: 'Safe look-alike', desc: 'Looks similar to an attack but is safe. The correct answer is ALLOW.' },
            { prefix: 'B', label: 'Baseline', desc: 'No AI agent. Other tools may flag it; ToolShield must stay silent (ALLOW).' },
          ].map(l => (
            <div key={l.prefix} className="bg-bg p-5">
              <div className="font-serif text-2xl text-fg mb-1">{l.prefix}</div>
              <div className="font-sans text-sm font-semibold text-fg mb-1">{l.label}</div>
              <div className="font-sans text-sm text-muted leading-relaxed">{l.desc}</div>
            </div>
          ))}
        </div>

        {/* What BLOCK and ALLOW mean */}
        <div className="grid grid-cols-2 gap-px bg-border mb-10">
          <div className="bg-bg p-5">
            <span className="font-mono text-xs font-semibold text-critical block mb-2">BLOCK</span>
            <span className="font-sans text-sm text-secondary leading-relaxed">
              ToolShield found a real attack path. The AI helper's action is denied before it can unlock a privileged workflow.
            </span>
          </div>
          <div className="bg-bg p-5">
            <span className="font-mono text-xs font-semibold text-accent block mb-2">ALLOW</span>
            <span className="font-sans text-sm text-secondary leading-relaxed">
              No attack path was found. The action is safe to proceed. A <Term term="false positive">false positive</Term> would be an ALLOW case that a tool wrongly blocks.
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-4 pr-6 font-semibold text-fg w-14">Case</th>
                <th className="text-left py-4 pr-6 font-normal text-muted w-64">What this test case represents</th>
                <th className="text-left py-4 pr-4 font-semibold text-muted">Correct answer</th>
                <th className="text-left py-4 pr-4 font-normal text-muted">Zizmor</th>
                <th className="text-left py-4 pr-4 font-normal text-muted">Poutine</th>
                <th className="text-left py-4 pr-4 font-normal text-muted">Runner-Guard</th>
                <th className="text-left py-4 font-semibold text-fg">ToolShield</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-fg/5 transition-colors">
                  <td className="py-4 pr-6">
                    <span className="font-mono font-semibold text-fg">{row.id}</span>
                  </td>
                  <td className="py-4 pr-6 text-secondary leading-relaxed">{row.story}</td>
                  <td className="py-4 pr-4">
                    <span className={`font-mono text-xs font-semibold ${row.correct === 'BLOCK' ? 'text-critical' : 'text-accent'}`}>
                      {row.correct}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-muted font-mono text-xs">{row.zizmor}</td>
                  <td className="py-4 pr-4 text-muted font-mono text-xs">{row.poutine}</td>
                  <td className="py-4 pr-4 text-muted font-mono text-xs">{row.runner}</td>
                  <td className={`py-4 font-mono text-xs font-semibold ${row.ts === 'BLOCK' ? 'text-critical' : 'text-accent'}`}>
                    {row.ts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-sans text-xs text-muted mt-6 leading-relaxed">
          "Not detected" means the tool does not raise any finding. "Detected" means the tool raises a finding, but for a different reason (general workflow security, not agent-mediated escalation).
        </p>
      </div>
    </div>
  );
}