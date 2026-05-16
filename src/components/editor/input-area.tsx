import { FileTextIcon, UploadIcon } from "lucide-react";
import { input$ } from "../../stores/editor";
import { useStore } from "@nanostores/react";
import OrderHandle from "../order-handle";
import { useRef } from "react";

interface InputAreaProps {
  order: number;
  span: number;
}

export default function InputArea({ order, span }: InputAreaProps) {
  const inputContent = useStore(input$);
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="border bg-primary/10 rounded-lg flex flex-col overflow-hidden text-sm @container"
      style={{
        anchorName: `--pane-${order}`,
        order,
        gridColumn: `span ${span}`,
      }}
      ref={rootRef}
    >
      <div className="flex items-center justify-between p-2">
        <OrderHandle root={rootRef.current} name="input" />
        <span className="items-center gap-2 flex">
          <FileTextIcon className="hidden @xs:block" size={16} /> <span className="hidden @sm:block @sm:animation-fade-in">Input Area</span>
          <button className="btn btn-xs">
            <UploadIcon size={14} /> <span className="hidden @sm:block @sm:animation-fade-in">Upload file</span>
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
      <textarea
        className="textarea w-full h-full rounded-lg"
        placeholder="Paste your text here"
        value={inputContent}
        onChange={(event) => input$.set(event.currentTarget.value)}
      ></textarea>
    </div>
  );
}


