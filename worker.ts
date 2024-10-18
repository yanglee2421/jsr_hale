import { timeout } from "@yotulee/run";

console.log(new Date().toLocaleString());

await timeout(1000 * 2);

console.log("hale", new Date().toLocaleString());

self.close();
