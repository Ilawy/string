import { useStore } from "@nanostores/react";
import CodeArea from "../components/editor/code-area";
import InputArea from "../components/editor/input-area";
import OutputArea from "../components/editor/output-area";
import { computedLayout$, editorLayout$ } from "../stores/editor";
import { useCallback, useEffect, useRef } from "react";
import ReorderTest from "../components/editor/reorder-test";


function pointerDown(event: PointerEvent) {
  const hasResizer = (event)
    .composedPath()
    .find((el) =>
      el instanceof HTMLElement ? el.getAttribute("data-resizer") : false,
    );
  if (!hasResizer) return;

  editorLayout$.setKey("lock", true);

  document.documentElement.style.userSelect = "none";
  document.documentElement.style.pointerEvents = "none";
  document.documentElement.style.cursor = "col-resize";
  document.documentElement.style.overflowX = "hidden";

  editorLayout$.setKey("initMousePos", {
    x: event.clientX,
    y: event.clientY,
  });
  editorLayout$.setKey("initCols", editorLayout$.get().cols);
}
function pointerMove(event: PointerEvent) {
  const layout = editorLayout$.get();
  if (!layout.lock) return;
  const deltaX = event.clientX - layout.initMousePos.x;
  // const deltaY = event.clientY - layout.initMousePos.y;

  const newCols = [layout.initCols[0] + deltaX, -1];
  editorLayout$.setKey("cols", newCols);
}
function pointerUp() {
  editorLayout$.setKey("lock", false);
  document.documentElement.style.userSelect = "auto";
  document.documentElement.style.pointerEvents = "auto";
  document.documentElement.style.cursor = "auto";
  document.documentElement.style.overflowX = "auto";
}

export default function ProcessRoute() {
  useEffect(() => {
    window.addEventListener("pointerup", _ev=>{
      pointerUp();
      ensureMaxSafeArea();
    });
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerdown", pointerDown);
    
    return () => {
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerdown", pointerDown);
    };
  }, []);
  const layout = useStore(editorLayout$);
  const computedLayout = useStore(computedLayout$);
  const rootRef = useRef<HTMLDivElement>(null);


  const ensureMaxSafeArea = useCallback(()=>{
    const layout = editorLayout$.get();
    const totalWidth = rootRef.current?.getBoundingClientRect().width || window.innerWidth;
    const leftColWidth = layout.cols[0] === -1 ? totalWidth / 2 : layout.cols[0];
    const percentage = (leftColWidth / totalWidth) * 100;
    if(percentage < 30){
      editorLayout$.setKey("cols", [totalWidth * 0.3, -1]);
    } else if(percentage > 70){
      editorLayout$.setKey("cols", [totalWidth * 0.7, -1]);
    }
  }, [])
  
  return (
    <div className="w-full flex-1 flex flex-col p-1">
      <div className="p-2"></div>
      <ReorderTest isOrdering={layout.isOrdering} />
      <div
        className="grid gap-3 flex-1"
        ref={rootRef}
        style={{
          gridTemplateColumns: layout.cols
            .map((col) => (col === -1 ? "1fr" : `${col}px`))
            .join(" "),
          gridTemplateRows: "1fr 1fr",
        }}
      >
        <InputArea order={computedLayout.get("input")?.order!} span={computedLayout.get("input")?.span!} />
        <div
          data-resizer
          className={`bg-gray-400 hover:bg-gray-700 rounded-full ${layout.lock && "bg-red-700!"}`}
          style={{
            // backgroundColor: "green",
            width: "6px",
            position: "fixed",
            positionAnchor: "--pane-0",
            positionArea: "right",
            marginLeft: "2px",
            height: "anchor-size(height)",
          }}
          onDoubleClick={() => {
            editorLayout$.setKey("expandCol", !layout.expandCol);
          }}
        ></div>
        <OutputArea order={computedLayout.get("output")?.order!} span={computedLayout.get("output")?.span!} />
        <CodeArea order={computedLayout.get("code")?.order!} span={computedLayout.get("code")?.span!} />
      </div>
    </div>
  );
}
