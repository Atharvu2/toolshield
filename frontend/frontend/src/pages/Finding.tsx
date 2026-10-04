import { ReactFlow, Background } from '@xyflow/react';
import GraphNode from '../components/GraphNode';
import { initialNodes, initialEdges } from '../graph/def';
import { useState } from 'react';

const nodeTypes = { custom: GraphNode };

export default function Finding() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = initialNodes.map(n => ({
    ...n,
    data: { ...n.data, hidden: false, critical: n.id === '3' || n.id === '4' || n.id === '5' }
  }));

  const edges = initialEdges.map(e => ({
    ...e,
    hidden: false,
    style: { stroke: (e.id === 'e2-3' || e.id === 'e3-4' || e.id === 'e4-5') ? '#F0481C' : '#0E1413', strokeWidth: 4 }
  }));

  return (
    <div className="h-screen pt-24 px-12 pb-12 flex flex-col">
      <header className="mb-8">
        <h1 className="font-sans font-bold text-4xl mb-2">TSE-001 <span className="font-normal text-muted">| Agent-Mediated Authority Escalation</span></h1>
        <div className="flex gap-4 font-mono text-sm font-bold">
          <span className="text-critical">CRITICAL</span>
          <span className="text-critical">BLOCKED</span>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-3 gap-8 min-h-0">
        <div className="col-span-2 border border-border bg-white/30 rounded">
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
          >
            <Background />
          </ReactFlow>
        </div>
        
        <div className="border border-border p-6 bg-white/50 font-mono text-sm overflow-y-auto">
          <h3 className="font-sans font-bold text-lg mb-6 uppercase">Technical Dossier</h3>
          
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">IDENTITY</div>
              <div className="font-medium">triage-bot[bot]</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">PROVENANCE</div>
              <div className="font-medium">UNTRUSTED_DERIVED</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">CREDENTIAL</div>
              <div className="font-medium break-all">github_app_installation_token</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">ARTIFACT</div>
              <div className="font-medium">safe-to-test</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">TRIGGER</div>
              <div className="font-medium break-all">pull_request_target:labeled</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">WORKFLOW</div>
              <div className="font-medium">privileged-ci</div>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-muted text-xs mb-1">PRIVILEGE</div>
              <div className="font-medium text-critical">contents:write<br/>secrets.*</div>
            </div>
            <div>
              <div className="text-muted text-xs mb-1">DECISION</div>
              <div className="font-medium text-critical">BLOCK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}