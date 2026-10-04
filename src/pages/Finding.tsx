import { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from '../components/GraphNode';
import { initialNodes, initialEdges } from '../graph/def';

const nodeTypes = { custom: GraphNode };

const dossierFields = [
  { label: 'IDENTITY',    value: 'triage-bot[bot]',                  nodeId: '2', critical: false },
  { label: 'PROVENANCE',  value: 'UNTRUSTED_DERIVED',                nodeId: '1', critical: true  },
  { label: 'CREDENTIAL',  value: 'github_app_installation_token',    nodeId: '2', critical: true  },
  { label: 'ARTIFACT',    value: 'safe-to-test',                     nodeId: '3', critical: true  },
  { label: 'TRIGGER',     value: 'pull_request_target:labeled',      nodeId: '4', critical: true  },
  { label: 'WORKFLOW',    value: 'privileged-ci',                    nodeId: '4', critical: false },
  { label: 'PRIVILEGE',   value: 'contents:write / secrets.*',       nodeId: '5', critical: true  },
  { label: 'DECISION',    value: 'BLOCK',                            nodeId: '5', critical: true  },
];

export default function Finding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(dossierFields.length - 1, Math.floor(v * dossierFields.length));
      setActiveIdx(idx);
    });
  }, [scrollYProgress]);

  const activeField = dossierFields[activeIdx];

  const nodes = initialNodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      hidden: false,
      critical: n.id === activeField.nodeId,
    }
  }));

  const edges = initialEdges.map(e => ({
    ...e,
    hidden: false,
    style: {
      stroke: (e.id === 'e2-3' || e.id === 'e3-4' || e.id === 'e4-5') ? '#F0481C' : '#0E1413',
      strokeWidth: 3,
      opacity: e.source === activeField.nodeId || e.target === activeField.nodeId ? 1 : 0.2,
    }
  }));

  return (
    <div ref={containerRef} className="h-[500vh] relative bg-bg">
      <div className="sticky top-0 h-screen w-full pt-[88px] pb-8 grid lg:grid-cols-story gap-12 px-12 items-start">

        {/* LEFT — scrolling dossier */}
        <div className="flex flex-col justify-center h-[88vh]">
          <div className="mb-10">
            <h1 className="font-sans font-extrabold text-[clamp(32px,4vw,56px)] leading-tight mb-2">
              TSE-001
            </h1>
            <p className="font-sans text-xl text-muted mb-3">Agent-Mediated Authority Escalation</p>
            <div className="flex gap-4 font-mono text-sm font-bold">
              <span className="text-critical">CRITICAL</span>
              <span className="text-critical">BLOCKED</span>
            </div>
          </div>

          <div className="space-y-0">
            {dossierFields.map((field, i) => (
              <div
                key={i}
                className={`py-5 border-b border-border transition-all duration-300 ${
                  i === activeIdx ? 'opacity-100' : i < activeIdx ? 'opacity-40' : 'opacity-20'
                }`}
              >
                <div className={`font-mono text-xs mb-1 transition-colors duration-300 ${
                  i === activeIdx ? 'text-critical' : 'text-muted'
                }`}>
                  {field.label}
                </div>
                <div className={`font-sans font-medium text-lg transition-colors duration-300 ${
                  i === activeIdx && field.critical ? 'text-critical' : 'text-fg'
                }`}>
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — sticky graph */}
        <div className="h-[88vh] border-l border-border/50">
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
            <Background color="#0E1413" gap={16} size={1} />
          </ReactFlow>
        </div>

      </div>
    </div>
  );
}