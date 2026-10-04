import { Handle, Position } from '@xyflow/react';
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
}