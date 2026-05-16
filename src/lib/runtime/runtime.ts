/// <reference lib="webworker" />
import variant from "@jitl/quickjs-singlefile-browser-release-sync";
import {
  newQuickJSWASMModuleFromVariant,
  QuickJSContext,
  QuickJSWASMModule,
} from "quickjs-emscripten-core";
import {
  CodeResultMessage,
  InitMessage,
  RuntimeMessage,
} from "./runtime-types";
import { Hat } from "./vm-helpers";

globalThis.addEventListener("message", async (event) => {
  const raw = event.data;
  const message = RuntimeMessage.safeParse(raw);
  if (!message.success) return;
  if (message.data.type === "run_code") {
    console.log("EXECUTE", JSON.stringify(message.data.code));
    try {
      const result = await execute(message.data.code, message.data.input);
      const response = CodeResultMessage.encode({
        type: "code_result",
        id: crypto.randomUUID(),
        success: true,
        result: result,
        runId: message.data.id,
        ts: new Date(),
      });
      globalThis.postMessage(response);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      const response = CodeResultMessage.encode({
        type: "code_result",
        id: crypto.randomUUID(),
        success: false,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack || "",
        },
        runId: message.data.id,
        ts: new Date(),
      });
      globalThis.postMessage(response);
    }
  }
});
let QuickJS: QuickJSWASMModule;
async function main() {
  QuickJS = await newQuickJSWASMModuleFromVariant(variant);
  globalThis.postMessage(
    InitMessage.encode({
      id: crypto.randomUUID(),
      ts: new Date(),
      type: "init",
    }),
  );
}

main();

function execute(code: string, inputRaw: string) {
  const vm = QuickJS.newContext();
  const input = vm.newString(inputRaw);
  vm.setProp(vm.global, "input", input);
  input.dispose();

  setupCSV(vm);
  // Create a host namespace with helper functions
  // All functions automatically receive native JS arguments (no need to dump manually)

  const result = vm.evalCode(code);

  return new Promise<string>((resolve, reject) => {
    if (result.error) {
      console.log(vm.dump(result.error));

      reject(vm.dump(result.error));
      result.error.dispose();
    } else {
      const value = vm.dump(result.value);
      resolve(`${value}`);
      result.value.dispose();
    }
  });
}

function setupCSV(vm: QuickJSContext) {
  const hat = new Hat(vm);
  const csv = vm.newObject();
  vm.setProp(csv, "parse", hat.fn(csvModule.pp));
  vm.setProp(vm.global, "csv", csv);
}

import { inferSchema, initParser } from "udsv";

const csvModule = {
  pp: (raw: string) => {
    // console.log(raw);

    const schema = inferSchema(raw, {});
    const csvParser = initParser(schema);
    return csvParser.stringCols(raw);
  },
};
