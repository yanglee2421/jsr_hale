const wk = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

console.log("main", new Date().toLocaleString());
wk.onmessage = wk.terminate.bind(wk);
