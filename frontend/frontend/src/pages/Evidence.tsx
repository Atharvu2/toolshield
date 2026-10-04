import { useState, useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { ReactFlow, Background } from '@xyflow/react';
import GraphNode from '../components/GraphNode';
import { initialNodes, initialEdges } from '../graph/def';

const evidenceSteps = [
  { step: '01', title: 'INPUT', detail: 'pull_request.body' },
  { step: '02', title: 'AGENT', detail: 'triage-agent' },
  { step: '03', title: 'OUTPUT', detail: 'safe-to-test' },
  { step: '04', title: 'IDENTITY', detail: 'triage-bot[bot]' },
  { step: '05', title: 'TRIGGER', detail: 'pull_request_target:labeled' },
  { step: '06', title: 'WORKFLOW', detail: 'privileged-ci' },
  { step: '07', title: 'SINK', detail: 'secrets / repository write' }
];

export default function Evidence() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      const idx = Math.min(6, Math.floor(v * 7));
      setActiveIdx(idx);
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="h-[400vh] relative bg-bg">
      <div className="sticky top-0 h-screen pt-24 px-12 grid grid-cols-2 gap-12">
        
        {/* Forensics list */}
        <div className="flex flex-col justify-center h-[80vh] pl-12">
          <h2 className="font-sans font-bold text-4xl mb-12">Forensic Reconstruction</h2>
          <div className="space-y-8 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border -z-10" />
            
            {evidenceSteps.map((ev, i) => (
              <div key={i} className={`flex items-start gap-8 transition-opacity duration-300 ${i <= activeIdx ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-mono text-sm border bg-bg transition-colors ${i === activeIdx ? 'border-critical text-critical' : 'border-border text-muted'}`}>
                  {ev.step}
                </div>
                <div className="pt-2">
                  <div className={`font-mono text-xs mb-1 ${i === activeIdx ? 'text-critical' : 'text-muted'}`}>{ev.title}</div>
                  <div className="font-sans font-medium text-lg">{ev.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Highlight */}
        <div className="h-[80vh] border border-border bg-white/30">
          <ReactFlow 
            nodes={initialNodes.map((n, i) => ({ ...n, data: { ...n.data, hidden: false, critical: i === activeIdx } }))}
            edges={initialEdges.map(e => ({ ...e, hidden: false, style: { stroke: '#0E1413', opacity: 0.3 } }))}
            nodeTypes={{ custom: GraphNode }}
            fitView
            proOptions={{ hideAttribution: true }}
            panOnDrag={false}
            zoomOnScroll={false}
          >
            <Background />
          </ReactFlow>
        </div>

      </div>
    </div>
  );
}