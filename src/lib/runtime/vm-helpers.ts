import type { QuickJSContext, QuickJSHandle } from "quickjs-emscripten-core";

export class Hat {
  private vm: QuickJSContext;
  constructor(vm: QuickJSContext) {
    this.vm = vm;
  }

  fn(callback: CallableFunction) {
    const fn = (...args: QuickJSHandle[]) => {
      const hostArgs = args.map((arg) => fromVm2(this.vm, arg));
      const result = callback(...hostArgs);

      // Convert the result back to a QuickJS handle
      if (result !== undefined) {
        // Serialize the result to JSON for generic handling
        // const jsonString = JSON.stringify(result);
        // return this.vm.newString(jsonString);
        return this.toPtr(result);
      }

      return this.vm.undefined;
    };
    return this.vm.newFunction(callback.name || `<anonymous native>`, fn);
  }


  toPtr(value: Value){
    if(value === null){
      return this.vm.null;
    }
    if(value === undefined){
      return this.vm.undefined;
    }
    if(typeof value === "string"){
      return this.vm.newString(value);
    }
    if(typeof value === "number"){
      return this.vm.newNumber(value);
    }
    if(typeof value === "boolean"){
      return value ? this.vm.true : this.vm.false;
    }
    if(Array.isArray(value)){
      const arr = this.vm.newArray();
      value.forEach((item) => {
        pushToQuickJSArray(this.vm, arr, this.toPtr(item));
      });
      return arr;
    }
    if(typeof value === "object"){
      const obj = this.vm.newObject();
      for(const key in value){
        this.vm.setProp(obj, key, this.toPtr(value[key]));
      }
      return obj;
    }
    throw new Error(`Unsupported type: ${typeof value}`);
  }
}

export function fromVm2(vm: QuickJSContext, handle: QuickJSHandle): any {
  const raw = vm.dump(handle);
  console.log(raw);
  return raw;
}


type Value = string | number | boolean | null | undefined | Value[] | { [key: string]: Value };

function pushToQuickJSArray(vm: QuickJSContext, array: QuickJSHandle, value: QuickJSHandle) {
  const length = vm.getProp(array, "length").consume((len) => vm.dump(len));
  vm.setProp(array, length, value);
}