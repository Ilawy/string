import { RunCodeMessage, RuntimeMessage } from "./runtime-types";
import RuntimeWorker from "./runtime?worker";

export default class RuntimeClient {
  private worker: Worker | null = null;

  async #getWorker() {
    return new Promise<Worker>((resolve) => {
      if (this.worker) {
        resolve(this.worker);
        return;
      }
      this.worker = new RuntimeWorker();
      const callback = (event: MessageEvent) => {
        const raw = event.data;
        const message = RuntimeMessage.safeParse(raw);
        // ignore non-formatted message
        if (message.success) {
          if (message.data.type === "init") {
            console.log("Runtime initialized with id:", message.data.id);
            resolve(this.worker!);
            this.worker?.removeEventListener("message", callback);
          }
        }
      };
      this.worker?.addEventListener("message", callback);
    });
  }

  async runCode(code: string, input: string) {
    const worker = await this.#getWorker();
    const id = crypto.randomUUID();
    return new Promise<string>((resolve, reject) => {
      const callback = (event: MessageEvent) => {
        const raw = event.data;
        const message = RuntimeMessage.safeParse(raw);
        // ignore non-formatted message
        if (!message.success) {
          return;
        }

        if (message.data.type === "code_result" && raw.runId === id) {
          if (message.data.success) {
            resolve(message.data.result!);
          } else {
            reject(
              new Error(message.data.error!.message!, {
                cause: message.data.error!.stack,
              }),
            );
          }
          worker.removeEventListener("message", callback);
        }
      };
      worker.addEventListener("message", callback);
      const response = RunCodeMessage.encode({
        type: "run_code",
        id,
        code,
        input,
        ts: new Date(),
      });
      worker.postMessage(response);
    });
  }
}
