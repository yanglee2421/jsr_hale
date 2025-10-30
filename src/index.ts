const bootstrap = async () => {
  const response = await fetch("http://127.0.0.1:8080", {
    body: JSON.stringify({ message: "xx" }),
    method: "POST",
  });
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("reader is falsy");
  }

  const textDecoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const data = textDecoder.decode(value, { stream: true });

    console.log("chunk: ", data);
  }

  textDecoder.decode();
};
