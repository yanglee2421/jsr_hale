Bun.serve({
  port: 8080,
  websocket: {
    open() {},
    message() {},
    close() {},
  },
  fetch(request, server) {
    if (request.headers.get("upgrade") === "websocket") {
      const upgraded = server.upgrade(request);
      if (!upgraded) {
        return new Response("Upgrade failed", { status: 400 });
      }
    }

    return new Response();
  },
});
