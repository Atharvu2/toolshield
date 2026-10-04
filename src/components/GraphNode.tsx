import { Handle, Position } from '@xyflow/react';

export default function GraphNode({ data, selected }: any) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-300 ${
      data.hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
    } ${selected ? 'scale-105' : ''}`}>
      <Handle type="target" position={Position.Top} className="opacity-0 !w-0 !h-0" />
      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors duration-300 ${
        data.critical ? 'border-critical bg-critical/20' : 'border-fg bg-bg'
      }`} />
      <div className="flex flex-col">
        <span className={`font-sans font-semibold text-[15px] leading-tight transition-colors duration-300 ${
          data.critical ? 'text-critical' : 'text-fg'
        }`}>{data.label}</span>
        {data.sublabel && (
          <span className="font-mono text-[11px] text-muted leading-tight mt-0.5">{data.sublabel}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0 !w-0 !h-0" />
    </div>
  );
}