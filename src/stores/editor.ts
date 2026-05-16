import { atom, map, computed } from "nanostores";
import Runtime from "../lib/runtime/runtime-client";

export const input$ = atom("");
export const code$ = atom("");
export const output$ = atom("");
export const error$ = atom<Error | null>(null);
export const editorLayout$ = map({
  isOrdering: false,
  orderingId: null as string | null,
  orderingName: null as string | null,
  orderingPreviewProps: { width: 0, height: 0 },
  order: [
    [
      ["input", 1],
      ["output", 1],
    ],
    [["code", 2]],
  ] as [string, number][][],
  cols: [-1, -1],
  initCols: [-1, -1],
  row: [-1, -1],
  lock: false,
  initMousePos: { x: 0, y: 0 },
  initColSize: 300,
  expandCol: false,
  rows: ["1fr", "1fr"],
});

export const computedLayout$ = computed(editorLayout$, (layout) => {
  const layoutMap = new Map<string, { order: number; span: number }>();
  let orderIndex = 0;

  layout.order.forEach((row) => {
    row.forEach((item) => {
      layoutMap.set(item[0] as string, {
        order: orderIndex++, // Ensure order is always incremental
        span: item[1] as number,
      });
    });
  });

  return layoutMap;
});

const rt = new Runtime();
code$.subscribe(async (code) => {
  try {
    console.log(input$.get());
    const result = await rt.runCode(code, input$.get());
    console.log("VM RESULT:", result);
    
    output$.set(result);
  } catch (e) {
    error$.set(e as Error);
  }finally{
    localStorage.setItem("code", code);
  }
});

input$.subscribe(async (input) => {
  try {
    console.log(input$.get());
    const result = await rt.runCode(code$.get(), input);
    output$.set(result);
  } catch (e) {
    error$.set(e as Error);
  }
});
