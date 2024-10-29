let data = "hale";

const clients = new Set<WebSocket>();

Deno.serve({ port: 8080 }, (req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    socket.send(data);
    clients.add(socket);
    console.log("client count:", clients.size);
  });
  socket.addEventListener("close", () => {
    clients.delete(socket);
    console.log("client count:", clients.size);
  });
  socket.addEventListener("message", (event) => {
    data = event.data;
    clients.forEach((socket) => socket.send(data));
  });
  socket.addEventListener("error", () => {});
  return response;
});
