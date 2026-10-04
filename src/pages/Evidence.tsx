import { useState, useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from '../components/GraphNode';
import Term from '../components/Term';
import { initialNodes, initialEdges } from '../graph/def';

const nodeTypes = { custom: GraphNode };

const steps = [
  {
    num: '01',
    title: 'Input',
    plain: 'Where the stranger\'s text enters',
    detail: 'pull_request.body',
    explanation: 'The pull request description. Anyone can write anything here.',
    nodeId: '1',
  },
  {
    num: '02',
    title: 'AI helper reads it',
    plain: 'The triage agent processes the PR',
    detail: 'triage-agent',
    explanation: 'The AI agent runs on a workflow triggered by the new pull request. It reads the body.',
    nodeId: '2',
  },
  {
    num: '03',
    title: 'The label is applied',
    plain: 'Agent output — the artifact',
    detail: 'Label: safe-to-test',
    explanation: 'The agent decides the PR looks fine and adds the label using the bot\'s token.',
    nodeId: '3',
  },
  {
    num: '04',
    title: 'Trusted identity',
    plain: 'The bot whose name is on the action',
    detail: 'triage-bot[bot]',
    explanation: 'The label appears to come from a trusted bot. The second workflow does not question this.',
    nodeId: '2',
  },
  {
    num: '05',
    title: 'Trigger fires',
    plain: 'The label starts the second workflow',
    detail: 'pull_request_target: labeled',
    explanation: 'The second workflow\'s trigger matches. It starts immediately.',
    nodeId: '4',
  },
  {
    num: '06',
    title: 'Privileged workflow runs',
    plain: 'A powerful job with access to secrets',
    detail: 'privileged-ci',
    explanation: 'This workflow has permissions to read secrets and write to the repository.',
    nodeId: '4',
  },
  {
    num: '07',
    title: 'The vault opens',
    plain: 'Secrets and write access become available',
    detail: 'DEPLOY_KEY / contents: write',
    explanation: 'The stranger\'s text has now, indirectly, unlocked a deployment key. This is the sink.',
    nodeId: '5',
  },
];

export default function Evidence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(steps.length - 1, Math.floor(v * steps.length));
      setActiveIdx(idx);
    });
  }, [scrollYProgress]);

  const active = steps[activeIdx];

  const nodeMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };

  const nodes = initialNodes.map((n, i) => ({
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
      stroke: '#0B3D3D',
      strokeWidth: 2,
      opacity: 0.25,
    },
  }));

  return (
    <div ref={containerRef} className="h-[500vh] relative bg-bg">
      <div className="sticky top-0 h-screen w-full pt-[80px] grid lg:grid-cols-story gap-12 px-8 lg:px-20 items-start">

        {/* LEFT */}
        <div className="flex flex-col h-[88vh] py-8">
          <div className="mb-8 pb-6 border-b border-border">
            <p className="font-mono text-xs text-muted tracking-widest uppercase mb-3">Evidence</p>
            <h1 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-tight text-fg">
              Tracing the path from stranger to secrets
            </h1>
            <p className="font-sans text-base text-secondary mt-3 leading-relaxed">
              Scroll through each step. The graph highlights the part of the attack being described.
            </p>
          </div>

          <div className="flex-1 space-y-0">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`py-5 border-b border-border transition-all duration-300 ${
                  i === activeIdx ? 'opacity-100' : i < activeIdx ? 'opacity-35' : 'opacity-15'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`font-mono text-xs flex-shrink-0 mt-1 ${
                    i === activeIdx ? 'text-critical font-semibold' : 'text-muted'
                  }`}>{s.num}</span>
                  <div className="flex-1">
                    <div className="font-sans font-semibold text-fg">{s.title}</div>
                    <div className="font-sans text-sm text-muted">{s.plain}</div>
                    <div className="font-mono text-xs text-accent mt-1">{s.detail}</div>
                    {i === activeIdx && (
                      <div className="font-sans text-sm text-secondary mt-2 leading-relaxed border-l-2 border-accent pl-3">
                        {s.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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