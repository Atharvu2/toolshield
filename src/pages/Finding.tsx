import { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from '../components/GraphNode';
import Term from '../components/Term';
import { initialNodes, initialEdges } from '../graph/def';

const nodeTypes = { custom: GraphNode };

const fields = [
  {
    label: 'Who posted it',
    technical: 'Identity',
    value: 'triage-bot[bot]',
    plain: 'The AI helper bot that applied the label. Its name appears on the action, not the stranger\'s.',
    nodeId: '2',
    critical: false,
  },
  {
    label: 'Where the text came from',
    technical: 'Provenance',
    value: 'Untrusted — from a public pull request',
    plain: 'The content that caused this label originally came from a stranger\'s pull request body.',
    nodeId: '1',
    critical: true,
  },
  {
    label: 'The credential used',
    technical: 'Token',
    value: 'github_app_installation_token',
    plain: 'The bot used its own app token to apply the label. This is a trusted token — that\'s the problem.',
    nodeId: '2',
    critical: true,
  },
  {
    label: 'What the AI helper created',
    technical: 'Artifact',
    value: 'Label: safe-to-test',
    plain: 'The label is what carries the stranger\'s influence into the second workflow.',
    nodeId: '3',
    critical: true,
  },
  {
    label: 'What started the second workflow',
    technical: 'Trigger',
    value: 'pull_request_target: labeled',
    plain: 'The second workflow starts whenever any label matching its name appears. It does not check who or what applied it.',
    nodeId: '4',
    critical: true,
  },
  {
    label: 'The workflow that ran',
    technical: 'Privileged workflow',
    value: 'privileged-ci',
    plain: 'This workflow has access to secrets. It runs untrusted code indirectly.',
    nodeId: '4',
    critical: false,
  },
  {
    label: 'What it unlocked',
    technical: 'Sink',
    value: 'contents: write / DEPLOY_KEY secret',
    plain: 'The job can push code and read the deployment key. These are real consequences.',
    nodeId: '5',
    critical: true,
  },
  {
    label: 'Why it was stopped',
    technical: 'Finding',
    value: 'TSE-001 — authority escalation detected',
    plain: 'All nine conditions were met. A stranger\'s text reached a privileged job through an AI helper. ToolShield blocked the label write.',
    nodeId: '5',
    critical: true,
  },
];

export default function Finding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(fields.length - 1, Math.floor(v * fields.length));
      setActiveIdx(idx);
    });
  }, [scrollYProgress]);

  const active = fields[activeIdx];

  const nodes = initialNodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      hidden: false,
      critical: n.id === active.nodeId,
    },
  }));

  const edges = initialEdges.map(e => ({
    ...e,
    hidden: false,
    style: {
      stroke: (e.id === 'e2-3' || e.id === 'e3-4' || e.id === 'e4-5') ? '#F0481C' : '#0B3D3D',
      strokeWidth: 2.5,
      opacity: e.source === active.nodeId || e.target === active.nodeId ? 1 : 0.2,
    },
  }));

  return (
    <div ref={containerRef} className="h-[600vh] relative bg-bg">
      <div className="sticky top-0 h-screen w-full pt-[80px] grid lg:grid-cols-story gap-12 px-8 lg:px-20 items-start">

        {/* LEFT */}
        <div className="flex flex-col h-[88vh] py-8">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-border">
            <p className="font-mono text-xs text-muted tracking-widest uppercase mb-3">Finding</p>
            <h1 className="font-serif text-[clamp(28px,3.5vw,48px)] leading-tight text-fg mb-2">
              <Term term="TSE-001">TSE-001</Term>: an outsider's text can start a powerful job through an AI helper
            </h1>
            <div className="flex gap-4 mt-4">
              <span className="font-mono text-xs font-semibold text-critical border border-critical px-2 py-0.5">CRITICAL</span>
              <span className="font-mono text-xs font-semibold text-critical border border-critical px-2 py-0.5">BLOCKED</span>
            </div>
          </div>

          {/* How to read the graph */}
          <div className="mb-8 p-4 bg-fg/5 border border-border text-sm font-sans text-secondary leading-relaxed">
            <span className="font-semibold text-fg">How to read this graph:</span> each circle is a step in the attack. Arrows show what caused what. The red path is where ToolShield detected the problem. Click a step in the list to highlight it.
          </div>

          {/* Scrolling fields */}
          <div className="flex-1 overflow-hidden">
            {fields.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-full text-left py-4 border-b border-border transition-all duration-200 ${
                  i === activeIdx ? 'opacity-100' : i < activeIdx ? 'opacity-40' : 'opacity-20'
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-sans text-base font-semibold ${
                    i === activeIdx && f.critical ? 'text-critical' : 'text-fg'
                  }`}>{f.label}</span>
                  <span className="font-mono text-xs text-muted">{f.technical}</span>
                </div>
                <div className={`font-mono text-sm mt-1 ${
                  i === activeIdx && f.critical ? 'text-critical' : 'text-muted'
                }`}>{f.value}</div>
                {i === activeIdx && (
                  <div className="font-sans text-sm text-secondary mt-2 leading-relaxed">{f.plain}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — graph */}
        <div className="h-[88vh] border-l border-border/60">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
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
  );
}