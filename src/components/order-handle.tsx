import { DotSquareIcon } from "lucide-react";
import { useEffect, useId } from "react";
import { editorLayout$ } from "../stores/editor";
import { useStore } from "@nanostores/react";

interface OrderHandleProps {
  root: HTMLElement | null;
  name: string;
}

// const ensureOwnership = (id: string, event: Event) =>
//   event
//     .composedPath()
//     .find(
//       (el) =>
//         el instanceof HTMLElement && el.getAttribute("data-reorder-id") === id,
//     );

// function createPointerDown(id: string) {
//   return function pointerDown(event: Event) {
//     if (!ensureOwnership(id, event)) return;
//     console.log("SHOULD REORDER");
//   };
// }

function createPointerMove(id: string) {
  return function pointerMove(_event: PointerEvent) {
    const layout = editorLayout$.get();
    if (!layout.isOrdering || layout.orderingId !== id) return;
    
  };
}

// function createPointerUp(id: string) {
//   return function pointerUp(event: PointerEvent) {
//     if (!ensureOwnership(id, event)) return;
//   };
// }

export default function OrderHandle({ root, name }: OrderHandleProps) {
  const id = useId();
  const layout = useStore(editorLayout$);

  useEffect(() => {
    if (!layout.isOrdering || !root || layout.orderingId !== id) return;
    const computedStyle = root.getBoundingClientRect();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    editorLayout$.setKey("orderingPreviewProps", {
      width: computedStyle.width,
      height: computedStyle.height,
    });
  }, [layout.isOrdering]);

  useEffect(() => {
    // const pointerDown = createPointerDown(id);
    const pointerMove = createPointerMove(id);
    // const pointerUp = createPointerUp(id);

    window.addEventListener("pointermove", pointerMove);
    // window.addEventListener("pointerup", pointerUp);
    // window.addEventListener("pointerdown", pointerDown);
    return () => {
      window.removeEventListener("pointermove", pointerMove);
      // window.removeEventListener("pointerdown", pointerDown);
      // window.removeEventListener("pointerup", pointerUp);
    };
  });

  return (
    <>
      <div
        data-reorder-id={id}
        onDoubleClick={() => {
          editorLayout$.setKey("isOrdering", true);
          editorLayout$.setKey("orderingId", id);
          editorLayout$.setKey("orderingName", name);
        }}
      >
        <DotSquareIcon />
      </div>
      {layout.isOrdering && layout.orderingId === id && (
        <div
          id="WTF"
          className="fixed z-50 scale-80 bg-gray-300 pointer-events-none"
          style={{
            width: layout.orderingPreviewProps.width,
            height: layout.orderingPreviewProps.height,
            positionAnchor: "--pointer-guide",
            positionArea: "center",
          }}
        ></div>
      )}
    </>
  );
}
