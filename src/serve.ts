Deno.serve(
  {
    port: 8080,
  },
  async (request) => {
    console.log(request.url);
    const jwt = request.headers.get("Authorization");
    console.log(jwt, request.method);

    const body = await request.json();
    console.log("body", body);

    const res = new Response();
    return res;
  }
);
