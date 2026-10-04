import { useScroll, motion, useTransform } from 'framer-motion';
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
}