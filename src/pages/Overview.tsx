import { useScroll } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router-dom';
import GraphNode from '../components/GraphNode';
import Term from '../components/Term';
import { initialNodes, initialEdges } from '../graph/def';

const nodeTypes = { custom: GraphNode };

const steps = [
  {
    heading: 'A stranger opens a pull request.',
    body: 'Anyone can propose code changes to a public repository. The text they write — in the title, description, or comments — is completely untrusted.',
    code: 'PR_BODY: ${{ github.event.pull_request.body }}',
    file: 'triage.yml',
  },
  {
    heading: 'Your AI helper reads that text.',
    body: 'You have set up an AI triage agent to read every pull request and decide what to do with it. This is its job. Reading is fine.',
    code: 'uses: ./.github/actions/mock-agent',
    file: 'triage.yml',
  },
  {
    heading: 'The AI helper applies a label — as your trusted bot.',
    body: 'The agent decides the PR looks safe and applies the label "safe-to-test" using triage-bot[bot]\'s token. The label now carries your bot\'s name, not the stranger\'s.',
    code: 'GH_TOKEN: ${{ secrets.AGENT_APP_TOKEN }}',
    file: 'triage.yml',
  },
  {
    heading: 'A second workflow watches for that label.',
    body: 'Your CI workflow starts whenever the label "safe-to-test" appears. It checks the label name, not where the text came from. It now runs with access to your secrets.',
    code: `on:\n  pull_request_target:\n    types: [labeled]\nif: github.event.label.name == 'safe-to-test'\nDEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}`,
    file: 'ci.yml',
  },
  {
    heading: 'ToolShield blocked this before it started.',
    body: 'ToolShield reads both workflow files and the agent registry. It traces the full path from stranger\'s text to privileged job, and blocks the label write before the second workflow can start.',
    code: '$ toolshield scan\nTSE-001 CRITICAL — label write denied',
    file: 'terminal',
    blocked: true,
  },
];

export default function Overview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [step, setStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v < 0.12) setStep(0);
      else if (v < 0.28) setStep(1);
      else if (v < 0.48) setStep(2);
      else if (v < 0.68) setStep(3);
      else if (v < 0.85) setStep(4);
      else setStep(5);
    });
  }, [scrollYProgress]);

  const nodes = initialNodes.map((n, i) => ({
    ...n,
    data: {
      ...n.data,
      hidden: step < i + 1,
      critical: step >= 5 && i >= 2,
    },
  }));

  const edges = initialEdges.map((e, i) => ({
    ...e,
    hidden: step < i + 1,
    style: {
      stroke: step >= 5 && i >= 1 ? '#F0481C' : '#0B3D3D',
      strokeWidth: step >= 5 && i >= 1 ? 4 : 2,
      opacity: step >= 5 && i < 1 ? 0.25 : 1,
    },
  }));

  const currentStep = steps[Math.max(0, Math.min(step - 1, steps.length - 1))];

  return (
    <div className="bg-bg">
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-20 pt-24 pb-16 max-w-5xl">
        <div className="font-mono text-xs text-muted tracking-widest uppercase mb-8">
          GitHub Actions security
        </div>
        <h1 className="font-serif text-[clamp(40px,6vw,80px)] leading-[1.05] tracking-tight text-fg mb-6">
          Catch AI helpers that a stranger can trick into unlocking your secrets.
        </h1>
        <p className="font-sans text-xl text-secondary leading-relaxed max-w-2xl mb-8">
          ToolShield reads your{' '}
          <Term term="GitHub Actions">GitHub Actions</Term> files and warns you when
          text written by an outsider can end up starting a{' '}
          <Term term="privileged job">powerful job</Term> that has access to passwords and keys.
        </p>

        {/* Mini example from A2 */}
        <div className="border-l-2 border-critical pl-6 mb-10 max-w-xl">
          <p className="font-sans text-sm text-muted mb-2 uppercase tracking-wide">Real example — fixture A2</p>
          <p className="font-sans text-base text-fg leading-relaxed">
            A stranger opens a{' '}
            <Term term="pull request">pull request</Term>.
            Your <Term term="AI helper (agent)">AI triage agent</Term> reads the description and adds the{' '}
            <Term term="label">label</Term> <code className="font-mono text-sm">safe-to-test</code> using your bot's token.
            A second <Term term="workflow">workflow</Term> trusts that label and runs with access to{' '}
            <Term term="secret">deployment keys</Term>.
            The stranger never touched the second workflow directly.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="#story"
            className="font-sans text-sm bg-fg text-bg px-6 py-3 hover:bg-accent transition-colors"
          >
            See the attack
          </a>
          <a
            href="#how"
            className="font-sans text-sm border border-fg px-6 py-3 hover:bg-fg hover:text-bg transition-colors"
          >
            How it works
          </a>
        </div>
      </section>

      {/* ── ANALOGY ── */}
      <section id="how" className="px-8 lg:px-20 py-24 border-t border-border max-w-5xl">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-6">The problem in plain words</p>
        <h2 className="font-serif text-4xl text-fg mb-8 leading-tight">
          The receptionist stamps "approved" on forms.<br />
          The vault door opens for any stamped form.
        </h2>
        <p className="font-sans text-lg text-secondary leading-relaxed max-w-2xl mb-12">
          A stranger slips the receptionist a note that says "stamp this". The receptionist reads it and stamps it. The vault opens. No human approved it.
        </p>

        {/* Step-by-step mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-border">
          {[
            { analogy: 'Stranger', real: 'Pull request author', note: 'untrusted' },
            { analogy: 'Note', real: 'PR body text', note: 'attacker-controlled content' },
            { analogy: 'Receptionist', real: 'AI triage agent', note: 'reads the note, acts on it', danger: true },
            { analogy: 'Stamp', real: 'Label: safe-to-test', note: 'applied by trusted bot' },
            { analogy: 'Vault', real: 'Privileged CI workflow', note: 'has access to secrets' },
          ].map((s, i) => (
            <div
              key={i}
              className={`p-6 border-r last:border-r-0 border-border ${s.danger ? 'bg-critical/5' : ''}`}
            >
              <div className="font-mono text-xs text-muted mb-2">{String(i + 1).padStart(2, '0')}</div>
              <div className="font-serif text-xl text-fg mb-1">{s.analogy}</div>
              <div className="font-sans text-sm font-medium text-accent mb-2">{s.real}</div>
              <div className={`font-sans text-xs leading-relaxed ${s.danger ? 'text-critical font-medium' : 'text-muted'}`}>
                {s.danger ? '← danger happens here' : s.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCROLL STORY ── */}
      <div id="story" ref={containerRef} className="h-[640vh] relative">
        <div className="sticky top-0 h-screen w-full px-8 lg:px-20 pt-24 pb-12 grid lg:grid-cols-story gap-16 items-center">

          {/* LEFT */}
          <div className="relative h-[72vh] flex flex-col justify-center">
            {step === 0 && (
              <div>
                <p className="font-mono text-xs text-muted tracking-widest uppercase mb-6">Scroll to follow one attack</p>
                <h2 className="font-serif text-[clamp(36px,5vw,64px)] leading-tight text-fg mb-4">
                  How does a stranger unlock a powerful job?
                </h2>
                <p className="font-sans text-lg text-secondary">
                  Scroll through the five steps of fixture A2. The graph on the right builds as you go.
                </p>
              </div>
            )}

            {step >= 1 && step <= 5 && (
              <div>
                <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
                  Step {step} of 5
                </p>
                <h2 className={`font-serif text-[clamp(28px,4vw,52px)] leading-tight mb-5 ${
                  currentStep?.blocked ? 'text-critical' : 'text-fg'
                }`}>
                  {currentStep?.heading}
                </h2>
                <p className="font-sans text-lg text-secondary leading-relaxed mb-6">
                  {currentStep?.body}
                </p>
                <div className="bg-fg/5 border border-border p-4">
                  <div className="font-mono text-xs text-muted mb-2">{currentStep?.file}</div>
                  <pre className={`font-mono text-sm whitespace-pre-wrap leading-relaxed ${
                    currentStep?.blocked ? 'text-critical' : 'text-fg/80'
                  }`}>{currentStep?.code}</pre>
                </div>
              </div>
            )}

            {step >= 5 && (
              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-mono text-xs text-critical tracking-widest uppercase mb-2">
                  TSE-001 — an outsider's text can start a powerful job through an AI helper
                </p>
                <Link to="/finding" className="font-sans text-sm text-accent underline underline-offset-4">
                  See the full finding
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT — graph */}
          <div className="h-[72vh] border-l border-border/60 relative">
            {step >= 5 && (
              <div className="absolute top-4 right-4 z-10 bg-bg border border-critical px-4 py-2 font-mono text-xs font-semibold text-critical">
                BLOCKED — TSE-001
              </div>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
              panOnDrag={false}
              zoomOnScroll={false}
              nodesDraggable={false}
            >
              <Background color="#0B3D3D" gap={20} size={1} />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* ── HOW TOOLSHIELD WORKS ── */}
      <section className="px-8 lg:px-20 py-24 border-t border-border max-w-5xl">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-6">How ToolShield works</p>
        <h2 className="font-serif text-4xl text-fg mb-10 leading-tight">
          It reads both workflow files at once.
        </h2>
        <div className="grid lg:grid-cols-3 gap-px bg-border">
          {[
            {
              step: '01',
              title: 'Read',
              body: 'ToolShield reads your .github/workflows/ files and a small file (.traceshield/agents.yml) that lists which automations are AI agents.',
            },
            {
              step: '02',
              title: 'Map',
              body: 'It builds a map: who triggers what, which identity is used, what each step can do. This is the authority graph.',
            },
            {
              step: '03',
              title: 'Check',
              body: 'It checks nine conditions. Only when all nine are true does it raise TSE-001. It never runs any code it analyzes.',
            },
          ].map(s => (
            <div key={s.step} className="bg-bg p-8">
              <div className="font-mono text-xs text-muted mb-4">{s.step}</div>
              <div className="font-serif text-2xl text-fg mb-3">{s.title}</div>
              <div className="font-sans text-base text-secondary leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
