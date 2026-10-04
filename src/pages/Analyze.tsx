import { useState, useCallback } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from '../components/GraphNode';
import { scanZipFile, type Finding } from '../scanner/clientScanner';

const nodeTypes = { custom: GraphNode };

export default function Analyze() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [scannedFileName, setScannedFileName] = useState<string | null>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a .zip file containing a GitHub repository');
      return;
    }

    setRunning(true);
    setError(null);
    setFindings(null);
    setScannedFileName(file.name);

    try {
      // First try instant client-side scanning in the browser
      const clientFindings = await scanZipFile(file);
      setFindings(clientFindings);
    } catch (err: any) {
      // Fallback to server API if zip parsing fails
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else setFindings(data.findings || []);
      } catch (backendErr: any) {
        setError(err.message || 'Failed to scan repository zip file');
      }
    } finally {
      setRunning(false);
    }
  };

  // Build graph from the first finding, or show empty state
  let nodes: any[] = [];
  let edges: any[] = [];
  let blocked = false;

  if (findings && findings.length > 0) {
    const f = findings[0].evidence;
    blocked = true;
    nodes = [
      { id: '1', position: { x: 0, y: 520 }, data: { label: 'Untrusted Input', sublabel: f.input }, type: 'custom' },
      { id: '2', position: { x: 240, y: 390 }, data: { label: 'AI Agent reads it', sublabel: `${f.agent} (${f.identity})` }, type: 'custom' },
      { id: '3', position: { x: 480, y: 260 }, data: { label: 'Agent creates artifact', sublabel: f.artifact }, type: 'custom' },
      { id: '4', position: { x: 720, y: 130 }, data: { label: 'Workflow triggered', sublabel: `${f.workflow} (${f.trigger})` }, type: 'custom' },
      { id: '5', position: { x: 960, y: 0 }, data: { label: 'Privileged job runs', sublabel: `${f.job} [${f.privileges.join(', ')}]` }, type: 'custom' },
    ].map(n => ({
      ...n,
      data: { ...n.data, hidden: false, critical: n.id === '3' || n.id === '4' || n.id === '5' },
    }));

    edges = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ].map(e => ({
      ...e,
      hidden: false,
      style: { stroke: e.id === 'e2-3' || e.id === 'e3-4' || e.id === 'e4-5' ? '#F0481C' : '#0B3D3D', strokeWidth: 2.5 },
    }));
  } else if (findings && findings.length === 0) {
    nodes = [
      {
        id: '1',
        position: { x: 350, y: 250 },
        data: { label: 'Clean Repository', sublabel: 'No TSE-001 authority escalation paths found', hidden: false, critical: false },
        type: 'custom',
      },
    ];
  }

  return (
    <div className="h-screen pt-[88px] px-8 lg:px-20 grid lg:grid-cols-story gap-12 bg-bg">
      <div className="flex flex-col justify-center max-w-md h-[88vh]">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Scanner</p>
        <h1 className="font-serif text-[clamp(36px,5vw,52px)] leading-tight text-fg mb-6">
          Analyze repository
        </h1>

        <label
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed ${
            running ? 'border-accent bg-accent/5' : 'border-border hover:border-accent hover:bg-fg/5'
          } cursor-pointer p-10 text-center transition-colors mb-6 flex flex-col items-center group`}
        >
          <input type="file" accept=".zip" onChange={handleChange} className="hidden" />
          <span className="font-sans font-semibold text-lg text-fg mb-2">
            {running ? 'Analyzing...' : 'Drop repository .zip here'}
          </span>
          <span className="font-sans text-sm text-secondary">or click to select file</span>
        </label>

        {error && (
          <div className="font-sans text-sm text-critical bg-critical/10 p-4 border border-critical/20 mb-4 leading-relaxed">
            {error}
          </div>
        )}

        {findings !== null && (
          <div className="pt-6 border-t border-border">
            <div className="font-mono text-xs text-muted mb-2">Scanned: {scannedFileName}</div>
            <h3 className="font-serif text-2xl text-fg mb-2">Analysis Complete</h3>
            {blocked ? (
              <div>
                <p className="font-sans text-critical font-semibold mb-2">
                  TSE-001 detected — {findings.length} authority escalation path(s) found.
                </p>
                <div className="font-mono text-xs text-muted bg-fg/5 p-3 border border-border">
                  Workflow: {findings[0].evidence.workflow}<br />
                  Privileged Job: {findings[0].evidence.job}<br />
                  Agent Identity: {findings[0].evidence.identity}
                </div>
              </div>
            ) : (
              <p className="font-sans text-accent font-semibold">
                No authority escalation paths detected. Safe to proceed (ALLOW).
              </p>
            )}
          </div>
        )}
      </div>

      <div className="h-[88vh] border-l border-border/60 relative">
        {blocked && (
          <div className="absolute top-6 right-6 z-10 bg-bg border border-critical px-4 py-2 font-mono text-xs font-semibold text-critical">
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
  );
}