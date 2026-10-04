import os
from pathlib import Path

FILES = {
    "frontend/index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ToolShield</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Martian+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>""",
    
    "frontend/tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F1F3F2',
        fg: '#0E1413',
        secondary: '#59615F',
        muted: '#777D7B',
        surface: '#FFFFFF',
        border: '#D5D9D7',
        critical: '#F0481C',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Martian Mono"', 'monospace'],
      },
      gridTemplateColumns: {
        'story': 'minmax(0, 0.85fr) minmax(0, 1.35fr)',
      }
    },
  },
  plugins: [],
}""",

    "frontend/src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-fg font-sans antialiased m-0;
  }
}

.react-flow__pane {
  background: transparent !important;
}
.react-flow__edge-path {
  stroke-width: 3;
}
""",

    "frontend/src/App.tsx": """import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Overview from './pages/Overview';
import Finding from './pages/Finding';
import Evidence from './pages/Evidence';
import Baseline from './pages/Baseline';
import Validation from './pages/Validation';
import Analyze from './pages/Analyze';

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/finding" element={<Finding />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/baseline" element={<Baseline />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </Router>
  );
}

export default App;""",

    "frontend/src/components/TopNav.tsx": """import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 font-mono text-[12px] font-medium bg-bg/80 backdrop-blur-md">
      <div>
        <NavLink to="/" className="uppercase tracking-wide text-fg hover:text-fg/80">TOOLSHIELD</NavLink>
      </div>
      <div className="flex gap-8">
        {[
          { name: 'Overview', path: '/' },
          { name: 'Findings', path: '/finding' },
          { name: 'Evidence', path: '/evidence' },
          { name: 'Baseline', path: '/baseline' },
          { name: 'Validation', path: '/validation' }
        ].map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => clsx(
              "uppercase tracking-wide transition-colors duration-200",
              isActive ? "text-fg underline underline-offset-4 decoration-2" : "text-muted hover:text-fg"
            )}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <div>
        <NavLink to="/analyze" className="uppercase tracking-wide text-fg hover:text-fg/80">Analyze Repository</NavLink>
      </div>
    </nav>
  );
}""",

    "frontend/src/components/GraphNode.tsx": """import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';

export default function GraphNode({ data, selected }: any) {
  return (
    <div className={clsx(
      "flex flex-col transition-all duration-300",
      data.hidden && "opacity-0 pointer-events-none",
      !data.hidden && "opacity-100",
      selected && "scale-105"
    )}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex items-center gap-4">
        <div className={clsx(
          "w-4 h-4 rounded-full border-2 bg-bg z-10",
          data.critical ? "border-critical" : "border-fg"
        )} />
        <div className="flex flex-col">
          <span className="font-sans font-bold text-[17px] text-fg">{data.label}</span>
          {data.sublabel && (
            <span className="font-mono text-[11px] text-fg/65">{data.sublabel}</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}""",

    "frontend/src/graph/def.ts": """export const initialNodes = [
  { id: '1', position: { x: 50, y: 350 }, data: { label: 'Attacker opens PR', sublabel: 'pull_request.body' }, type: 'custom' },
  { id: '2', position: { x: 200, y: 350 }, data: { label: 'Agent reads it', sublabel: 'triage-agent' }, type: 'custom' },
  { id: '3', position: { x: 350, y: 200 }, data: { label: 'Bot applies label', sublabel: 'safe-to-test, as triage-bot[bot]' }, type: 'custom' },
  { id: '4', position: { x: 500, y: 50 }, data: { label: 'Label fires workflow', sublabel: 'pull_request_target: labeled' }, type: 'custom' },
  { id: '5', position: { x: 650, y: 50 }, data: { label: 'Job runs with secrets', sublabel: 'contents: write, DEPLOY_KEY' }, type: 'custom' }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' }
];""",

    "frontend/src/pages/Overview.tsx": """import { useScroll, motion, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from '../components/GraphNode';
import { initialNodes, initialEdges } from '../graph/def';

const nodeTypes = { custom: GraphNode };

export default function Overview() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [step, setStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (v < 0.15) setStep(0);
      else if (v < 0.3) setStep(1);
      else if (v < 0.5) setStep(2);
      else if (v < 0.7) setStep(3);
      else if (v < 0.85) setStep(4);
      else setStep(5);
    });
  }, [scrollYProgress]);

  const nodes = initialNodes.map((n, i) => ({
    ...n,
    data: { ...n.data, hidden: step < i + 1, critical: step >= 5 && i >= 2 }
  }));

  const edges = initialEdges.map((e, i) => ({
    ...e,
    animated: step > i + 1 && step < 5,
    hidden: step < i + 1,
    style: { stroke: step >= 5 && i >= 1 ? '#F0481C' : '#0E1413', strokeWidth: step >= 5 && i >= 1 ? 5 : 3, opacity: step >= 5 && i < 1 ? 0.2 : 1 }
  }));

  const stepClasses = (idx: number) => `absolute inset-0 flex flex-col justify-center transition-all duration-500 ${step === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`;

  return (
    <div ref={containerRef} className="h-[600vh] relative bg-bg">
      <div className="sticky top-0 h-screen w-full px-12 pt-[100px] pb-[60px] grid lg:grid-cols-story gap-12 items-center">
        
        {/* NARRATIVE */}
        <div className="relative h-[60vh]">
          <div className={stepClasses(0)}>
            <h2 className="font-sans font-extrabold text-[clamp(46px,6.4vw,98px)] leading-[0.96] tracking-tight mb-5">Who really wrote this label?</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">ToolShield traces authority through AI agents in GitHub Actions. Scroll to follow one attack.</p>
          </div>
          
          <div className={stepClasses(1)}>
            <h2 className="font-sans font-extrabold text-[clamp(40px,5.4vw,82px)] leading-[0.96] tracking-tight mb-5">A stranger opens a pull request.</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">The text in the PR body is theirs. Nothing about it is trusted.</p>
            <div className="mt-8 font-mono text-sm leading-relaxed max-w-[52ch]">
              <span className="opacity-50 block mb-1">triage.yml</span>
              PR_BODY: ${`{{ github.event.pull_request.body }}`}
            </div>
          </div>

          <div className={stepClasses(2)}>
            <h2 className="font-sans font-extrabold text-[clamp(40px,5.4vw,82px)] leading-[0.96] tracking-tight mb-5">Your triage agent reads it.</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">It is allowed to. That is its job.</p>
            <div className="mt-8 font-mono text-sm leading-relaxed max-w-[52ch]">
              <span className="opacity-50 block mb-1">triage.yml</span>
              uses: ./.github/actions/mock-agent
            </div>
          </div>

          <div className={stepClasses(3)}>
            <h2 className="font-sans font-extrabold text-[clamp(40px,5.4vw,82px)] leading-[0.96] tracking-tight mb-5">Then it labels the PR as triage-bot.</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">The words are still the attacker's. The name on them is now your bot's.</p>
            <div className="mt-8 font-mono text-sm leading-relaxed max-w-[52ch]">
              <span className="opacity-50 block mb-1">triage.yml</span>
              GH_TOKEN: ${`{{ secrets.AGENT_APP_TOKEN }}`}
            </div>
          </div>

          <div className={stepClasses(4)}>
            <h2 className="font-sans font-extrabold text-[clamp(40px,5.4vw,82px)] leading-[0.96] tracking-tight mb-5">The label starts a privileged workflow.</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">The gate checks the label name. Nothing checks where the text came from.</p>
            <div className="mt-8 font-mono text-sm leading-relaxed max-w-[52ch]">
              <span className="opacity-50 block mb-1">ci.yml</span>
              on: pull_request_target: [labeled]<br/>
              if: github.event.label.name == 'safe-to-test'<br/>
              DEPLOY_KEY: ${`{{ secrets.DEPLOY_KEY }}`}
            </div>
          </div>

          <div className={stepClasses(5)}>
            <h2 className="font-sans font-extrabold text-[clamp(40px,5.4vw,82px)] leading-[0.96] tracking-tight mb-5">ToolShield saw the whole path first.</h2>
            <p className="text-xl max-w-[36ch] text-fg/80">It blocks the label write, so the workflow never starts.</p>
            <div className="mt-8 font-mono text-sm leading-relaxed max-w-[52ch]">
              <span className="opacity-50 block mb-1">toolshield scan</span>
              <span className="text-critical font-bold">TSE-001 CRITICAL</span><br/>
              label write denied
            </div>
          </div>
        </div>

        {/* GRAPH */}
        <div className="h-[70vh] relative border-l border-border/50">
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
            <Background color="#0E1413" gap={16} size={1} opacity={0.05} />
          </ReactFlow>
        </div>
        
      </div>
    </div>
  );
}""",

    "frontend/src/pages/Finding.tsx": """import { ReactFlow, Background } from '@xyflow/react';
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
}""",

    "frontend/src/pages/Evidence.tsx": """import { useState, useRef, useEffect } from 'react';
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
}""",

    "frontend/src/pages/Baseline.tsx": """export default function Baseline() {
  const data = [
    { fix: 'A1', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'A2', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'A3', z: 'NOT DETECTED', p: 'NOT DETECTED', r: 'NOT DETECTED', t: 'BLOCK' },
    { fix: 'C1', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'C2', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'C3', z: 'ALLOW', p: 'ALLOW', r: 'ALLOW', t: 'ALLOW' },
    { fix: 'B4', z: 'DETECTED', p: 'DETECTED', r: 'DETECTED', t: 'ALLOW' },
  ];

  return (
    <div className="min-h-screen pt-32 px-12 max-w-6xl mx-auto">
      <h1 className="font-sans font-extrabold text-5xl mb-4">BASELINE</h1>
      <p className="text-xl text-muted mb-12">ToolShield complements existing workflow security analysis.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b-2 border-border text-muted">
              <th className="py-4 px-4">FIXTURE</th>
              <th className="py-4 px-4">ZIZMOR</th>
              <th className="py-4 px-4">POUTINE</th>
              <th className="py-4 px-4">RUNNER-GUARD</th>
              <th className="py-4 px-4 text-fg">TOOLSHIELD</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-white/30 transition-colors">
                <td className="py-4 px-4 font-bold">{row.fix}</td>
                <td className="py-4 px-4 opacity-70">{row.z}</td>
                <td className="py-4 px-4 opacity-70">{row.p}</td>
                <td className="py-4 px-4 opacity-70">{row.r}</td>
                <td className={`py-4 px-4 font-bold ${row.t === 'BLOCK' ? 'text-critical' : 'text-fg'}`}>{row.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}""",

    "frontend/src/pages/Validation.tsx": """import { motion } from 'framer-motion';

export default function Validation() {
  return (
    <div className="min-h-screen pt-32 px-12 max-w-6xl mx-auto">
      <h1 className="font-sans font-extrabold text-5xl mb-12">VALIDATION</h1>
      
      <div className="mb-16">
        <h2 className="font-mono text-sm text-muted mb-6">STAGE 1 &mdash; REAL GITHUB VALIDATION</h2>
        <div className="grid grid-cols-3 gap-6">
          {['A1', 'A2', 'A3'].map((fix) => (
            <div key={fix} className="border border-border p-6 flex justify-between items-center bg-white/30">
              <span className="font-sans font-bold text-2xl">{fix}</span>
              <span className="font-mono text-sm text-green-600 bg-green-100 px-2 py-1">PASSED</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="font-mono text-sm text-muted mb-6">METRICS</h2>
        <div className="grid grid-cols-4 gap-x-8 gap-y-12">
          {[
            { label: 'Detection rate', val: '100%' },
            { label: 'False-positive rate', val: '0%' },
            { label: 'Median analysis time', val: '0.4s' },
            { label: 'P95 analysis time', val: '0.8s' }
          ].map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-mono text-xs text-muted mb-2">{m.label}</span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="font-sans font-bold text-4xl"
              >
                {m.val}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}""",

    "frontend/src/pages/Analyze.tsx": """import { useState } from 'react';
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
}"""
}

def scaffold():
    for filepath, content in FILES.items():
        p = Path(filepath)
        p.parent.mkdir(parents=True, exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    scaffold()
