Bun.build({
  entrypoints: [Bun.fileURLToPath(new URL("./index.ts", import.meta.url))],
  outdir: Bun.fileURLToPath(new URL("../dist", import.meta.url)),
  naming: {
    entry: "[name]-[hash].[ext]",
    chunk: "[name]-[hash].[ext]",
    asset: "[name]-[hash].[ext]",
  },
  minify: true,
});
