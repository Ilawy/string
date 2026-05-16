import { useStore } from "@nanostores/react";
import { computedLayout$, editorLayout$ } from "../../stores/editor";

interface ReorderTestProps {
  isOrdering: boolean;
}

function swap(from: string, to: string, order: [string, number][][]): [string, number][][] {
  return order.map((row) =>
    row.map((item) => {
      if (item[0] === from) {
        return [to, item[1]];
      } else if (item[0] === to) {
        return [from, item[1]];
      } else {
        return item;
      }
    }),
  );
}

export default function ReorderTest({ isOrdering }: ReorderTestProps) {
  const layout = useStore(editorLayout$);
  console.log(layout.order, computedLayout$.get());
  
  return (
    <div
      className={`absolute top-0 left-0 w-full ${isOrdering ? "grid" : "hidden pointer-events-none"} z-40 h-full`}
      style={{
        gridTemplateColumns: layout.cols
          .map((col) => (col === -1 ? "1fr" : `${col}px`))
          .join(" "),
        gridTemplateRows: "1fr 1fr",
      }}
    >
      {layout.order.flat().map((item) => (
        <button style={{
          border: "1px solid red",
          gridColumn: `span ${item[1]}`
        }} 
        onClick={()=>{
          console.log("swapping", layout.orderingName, "with", item[0]);
          const result = swap(layout.orderingName!, item[0] as string, layout.order);
          console.log(result);
          
          editorLayout$.setKey("order", result);
          editorLayout$.setKey("orderingName", null);
          editorLayout$.setKey("isOrdering", false);
          
        }}
        className="bg-green-500/50 hover:bg-green-500/70">
          
        </button>
      ))}
    </div>
  );
}
