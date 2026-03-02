import { dlopen, FFIType } from "bun:ffi";

const ffs = dlopen("user32.dll", {
  sendmessage: {
    args: [FFIType.bool] as const,
    returns: FFIType.void,
  },
});

ffs.symbols.sendmessage(true);
