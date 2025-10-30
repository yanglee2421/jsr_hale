Bun.serve({
  port: 8080,
  hostname: "localhost",
  websocket: {
    open() {},
    close() {},
    message() {},
    drain() {},
  },
  routes: {
    "/api": {
      GET(request) {
        const headers = new Headers();

        headers.set("Content-Type", "application/json; charset=utf-8");

        return new Response(
          JSON.stringify({
            message: "hello world",
          }),
          { headers }
        );
      },
    },
    "/": {
      GET() {
        return new Response(Bun.file("./src/build.ts"));
      },
    },
  },
  fetch(request, server) {
    if (request.headers.get("upgrade") === "websocket") {
      const upgraded = server.upgrade(request);
      if (upgraded) return;
    }

    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    return new Response(error.message, { status: 500 });
  },
});

console.log();
