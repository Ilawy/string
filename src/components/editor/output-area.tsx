import { CopyIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import { output$ } from "../../stores/editor";
import { useStore } from "@nanostores/react";
import OrderHandle from "../order-handle";
import { useRef } from "react";

interface OutputAreaProps {
  order: number;
  span: number;
}

export default function OutputArea({ order, span }: OutputAreaProps) {
  const outputContent = useStore(output$);
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="border bg-primary/10 rounded-lg flex flex-col overflow-hidden text-sm"
      style={{
        order,
        gridColumn: `span ${span}`,
        anchorName: `--pane-${order}`,
      }}
      ref={rootRef}
    >
      <div className="flex items-center justify-between p-2">
        <OrderHandle name="output" root={rootRef.current} />
        <span className="flex items-center gap-2">
          <FileTextIcon size={16} /> Output Area
          <button className="btn btn-xs">
            <DownloadIcon size={14} /> Download
          </button>
          <button className="btn btn-xs">
            <CopyIcon size={14} /> Copy
          </button>
        </span>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="mode">Mode</label>
          <select id="mode" defaultValue="raw" className="select select-xs">
            <option value={"raw"}>Raw text</option>
            <option value={"json"}>JSON</option>
            <option value={"csv"}>CSV</option>
          </select>
        </div>
      </div>
      <pre className="flex-1 p-1 bg-base-100 rounded-lg">
        {outputContent || "No output yet..."}
      </pre>
    </div>
  );
}
