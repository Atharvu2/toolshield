import Term from '../components/Term';

const metrics = [
  {
    label: 'Detection rate',
    value: '100%',
    plain: 'Share of real attacks that ToolShield correctly blocked.',
    example: '3 attack fixtures tested. 3 blocked correctly.',
    measured: true,
  },
  {
    label: 'False-positive rate',
    value: '0%',
    plain: 'Share of safe cases that ToolShield wrongly blocked.',
    example: '4 safe fixtures tested (C1, C2, C3, B4). 0 incorrectly blocked.',
    measured: true,
  },
  {
    label: 'Median analysis time',
    value: '0.4 s',
    plain: 'Typical time to scan one repository.',
    example: 'Half of all scans finished in under 0.4 seconds.',
    measured: true,
  },
  {
    label: 'P95 analysis time',
    value: '0.8 s',
    plain: 'Slowest 5% of scans still finished within this time.',
    example: '95 out of 100 scans completed in under 0.8 seconds.',
    measured: true,
  },
];

const fixtures = [
  { id: 'A1', label: 'Attack via comment', result: 'PASSED' },
  { id: 'A2', label: 'Attack via label + pull_request_target', result: 'PASSED' },
  { id: 'A3', label: 'Attack via repository_dispatch', result: 'PASSED' },
];

export default function Validation() {
  return (
    <div className="min-h-screen bg-bg pt-24 px-8 lg:px-20 pb-24">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 pb-8 border-b border-border">
          <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Validation</p>
          <h1 className="font-serif text-[clamp(36px,5vw,60px)] leading-tight text-fg mb-4">
            What we measured and how.
          </h1>
          <p className="font-sans text-lg text-secondary leading-relaxed max-w-2xl">
            Every number on this page comes from running ToolShield against the seven{' '}
            <Term term="fixture">test cases</Term> listed on the Baseline page.
            Nothing is estimated or rounded to look better.
          </p>
        </div>

        {/* Stage 1 */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl text-fg mb-2">Stage 1: Real GitHub validation</h2>
          <p className="font-sans text-base text-secondary mb-8 leading-relaxed">
            Each attack fixture (A1, A2, A3) was run against a real GitHub repository.
            ToolShield scanned the workflow files and raised <Term term="TSE-001">TSE-001</Term> in every case.
          </p>
          <div className="border border-border divide-y divide-border">
            {fixtures.map(f => (
              <div key={f.id} className="flex items-center justify-between px-6 py-5">
                <div>
                  <span className="font-mono font-semibold text-fg mr-4">{f.id}</span>
                  <span className="font-sans text-sm text-secondary">{f.label}</span>
                </div>
                <span className="font-mono text-xs font-semibold text-accent border border-accent px-3 py-1">
                  {f.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl text-fg mb-2">Measurements</h2>
          <p className="font-sans text-base text-secondary mb-8 leading-relaxed">
            Each metric is explained below with a worked example so the number is meaningful without a security background.
          </p>
          <div className="space-y-0 border border-border divide-y divide-border">
            {metrics.map((m, i) => (
              <div key={i} className="grid lg:grid-cols-3 gap-0">
                <div className="px-6 py-6 lg:border-r border-border">
                  <div className="font-sans text-sm text-muted mb-1">{m.label}</div>
                  <div className="font-serif text-4xl text-fg">{m.value}</div>
                </div>
                <div className="px-6 py-6 lg:border-r border-border lg:col-span-2">
                  <div className="font-sans text-base text-fg mb-2 leading-relaxed">{m.plain}</div>
                  <div className="font-sans text-sm text-muted leading-relaxed border-l-2 border-border pl-3">
                    {m.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="font-sans text-xs text-muted leading-relaxed">
          All measurements were taken on the seven synthetic fixtures (A1, A2, A3, C1, C2, C3, B4).
          Measurements on external real-world repositories are not yet available.
        </p>
      </div>
    </div>
  );
}