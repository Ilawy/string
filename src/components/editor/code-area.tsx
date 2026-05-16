import Editor from "@monaco-editor/react";
import { useStore } from "@nanostores/react";
import { useRef } from "react";
import { code$, error$ } from "../../stores/editor";
import javascriptDefaults from "../../assets/default-lib.d.ts.txt?raw";

interface CodeAreaProps {
  order: number;
  span: number;
}

export default function CodeArea({ order, span }: CodeAreaProps) {
  const errorContent = useStore(error$);
  const areaRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={areaRef}
      className="relative border col-span-2 bg-primary/10 rounded-lg flex flex-col overflow-hidden text-sm"
      style={{
        order,
        gridColumn: `span ${span}`,
        anchorName: `--pane-${order}`,
      }}
    >
      <div className="flex items-center justify-between p-2">
        <span className="flex items-center gap-2"></span>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="mode">Mode</label>
          <select id="mode" defaultValue="raw" className="select select-xs">
            <option value={"raw"}>Raw text</option>
            <option value={"json"}>JSON</option>
            <option value={"csv"}>CSV</option>
          </select>
        </div>
      </div>
      <Editor
        defaultLanguage="javascript"
        theme="vs-dark"
        value={localStorage.getItem("code") || ""}
        beforeMount={(instance: any) => {
          instance.languages.typescript.javascriptDefaults.addExtraLib(
            javascriptDefaults,
            "filename/myLib.d.ts",
          );
        }}
        onChange={(code) => {
          code$.set(code || "");
        }}
      />

      {errorContent && (
        <div className="absolute right-5 top-12 z-50 bg-base-100/50 hover:bg-base-100 transition-colors w-100 p-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-error">Error</span>{" "}
            <pre>{errorContent.message}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
