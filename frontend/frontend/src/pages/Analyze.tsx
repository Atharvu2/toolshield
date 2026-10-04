import { useState } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import GraphNode from '../components/GraphNode';
import { initialNodes, initialEdges } from '../graph/def';

const phases = [
  'PARSING WORKFLOWS',
  'PARSING AGENTS',
  'RESOLVING TRIGGERS',
  'RESOLVING TOKENS',
  'BUILDING GRAPH',
  'RUNNING TSE-001'
];

export default function Analyze() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(-1);
  
  const runDemo = () => {
    if (running) return;
    setRunning(true);
    setPhaseIdx(0);
    
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i >= phases.length) {
        clearInterval(t);
        setRunning(false);
      }
      setPhaseIdx(i);
    }, 800);
  };

  const nodes = initialNodes.map((n, i) => ({
    ...n,
    data: { ...n.data, hidden: phaseIdx < 4, critical: phaseIdx >= 5 && (n.id === '3' || n.id === '4' || n.id === '5') }
  }));

  const edges = initialEdges.map((e, i) => ({
    ...e,
    hidden: phaseIdx < 4,
    style: { stroke: (phaseIdx >= 5 && (e.id === 'e2-3' || e.id === 'e3-4' || e.id === 'e4-5')) ? '#F0481C' : '#0E1413', strokeWidth: phaseIdx >= 5 ? 4 : 2 }
  }));

  return (
    <div className="h-screen pt-24 px-12 grid grid-cols-2 gap-12">
      <div className="flex flex-col justify-center max-w-md">
        <h1 className="font-sans font-extrabold text-5xl mb-8">ANALYZE REPOSITORY</h1>
        
        <div className="border-2 border-dashed border-border p-12 text-center text-muted mb-6 flex flex-col items-center">
          <span className="font-mono text-sm mb-2">DROP REPOSITORY ZIP</span>
          <span className="text-xs">or</span>
          <select className="mt-4 bg-transparent border border-border p-2 font-mono text-sm outline-none text-fg">
            <option>Choose demo fixture (A2)</option>
          </select>
        </div>
        
        <button 
          onClick={runDemo}
          disabled={running}
          className="bg-fg text-bg font-sans font-bold tracking-wide py-4 uppercase hover:bg-fg/90 transition-colors disabled:opacity-50"
        >
          {running ? 'Running...' : 'Run Analysis'}
        </button>

        <div className="mt-12 space-y-4">
          {phases.map((p, i) => (
            <div key={i} className={`font-mono text-sm flex items-center gap-3 transition-opacity duration-300 ${i <= phaseIdx ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-2 h-2 rounded-full ${i === phaseIdx && running ? 'bg-critical animate-pulse' : (i < phaseIdx ? 'bg-fg' : 'bg-border')}`} />
              {p}
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-[80vh] border border-border bg-white/30 relative">
        {phaseIdx >= 5 && (
          <div className="absolute top-6 right-6 z-10 bg-white border border-critical p-4 font-mono text-sm font-bold text-critical shadow-lg">
            TSE-001 BLOCKED
          </div>
        )}
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={{ custom: GraphNode }}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}