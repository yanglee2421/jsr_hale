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
    clients.forEach((client) => client.send(data));
  });
  socket.addEventListener("error", () => {});

  return response;
});

export const sseBuf = `id: 12345
event: update
retry: 5000
data: {
data:   "message": "Hello, this is an update!",
data:   "timestamp": "2024-12-22T14:25:00Z"
data: }

:comment
id: 12345
event: update
retry: 5000
data: {
data:   "message": "Hello, this is an update!",
data:   "timestamp": "2024-12-22T14:25:00Z"
data: }
`;

const idReg = /^id:(?<id>.+)$/m;
const eventReg = /^event:(?<event>.+)$/m;
const retryReg = /^retry:(?<retry>.+)$/m;
const dataReg = /^data:(?<data>.+)$/gm;

export const decodeSSE = (buf: string) => {
  return buf.split("\n\n").map((i) => {
    const id = idReg.exec(i)?.groups?.id.trim();
    const event = eventReg.exec(i)?.groups?.event.trim();
    const retry = retryReg.exec(i)?.groups?.retry.trim();
    const data = Array.from(
      i.matchAll(dataReg),
      (i) => i.groups?.data || ""
    ).join("");

    return { id, event, retry, data };
  });
};
