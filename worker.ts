import { timeout } from "@yotulee/run";

console.log(new Date().toLocaleString());

await timeout(1000 * 2);

console.log("hale", new Date().toLocaleString());

void (() => {
  if (!("postMessage" in self)) {
    return;
  }

  if (typeof self.postMessage !== "function") {
    return;
  }

  self.postMessage({});
})();

self.close();
