const server = Bun.serve({
  port: 8080,
  hostname: "127.0.0.1",
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
    "/api/getData": {
      GET(request) {
        const url = new URL(request.url);
        const barCode = url.searchParams.get("param") || "";
        const type = url.searchParams.get("type") || "";

        let jsonString = JSON.stringify({
          message: "no data",
        });

        if (type === "csbtszh") {
          jsonString = JSON.stringify({
            code: "200",
            msg: "读取成功，返回数据条数：2",
            data: [
              {
                LBZGZPH: null,
                CLLWKSRZ: 139.3,
                DH: "6622508145029",
                CZZZRQ: "2018-10-01 00:00:00",
                CLLWKSRY: 139.3,
                PJ_ID: "DX0066220250801632",
                LBYGZPH: null,
                LBYLH: "06659",
                MCZZDW: "183",
                SCZZDW: "183",
                LBZCDH: "MG",
                LBYLX: "9H",
                CLLWHSRY: 44,
                CLLWHSRZ: 44.8,
                LBZSXH: "019",
                CLZJSRY: 826.4,
                MCZZRQ: "2019-01-07 00:00:00",
                CLZJSRZ: 827.1,
                LBYZZRQ: "2018-11-01 00:00:00",
                ZH: "79199",
                LBZLH: "06659",
                SCZZRQ: "2019-01-07 00:00:00",
                LBZZZRQ: "2018-11-01 00:00:00",
                CZZZDW: "105",
                LBYSXH: "107",
                ZX: "RE2B",
                LBZLX: "9H",
                LBYCDH: "MG",
              },
              {
                LBZGZPH: "Z",
                CLLWKSRZ: 138.5,
                DH: "6622511035037",
                CZZZRQ: "2015-11-01 00:00:00",
                CLLWKSRY: 139.2,
                PJ_ID: "DX0066220251100037",
                LBYGZPH: "Z",
                LBYLH: null,
                MCZZDW: "105",
                SCZZDW: "105",
                LBZCDH: "CO",
                LBYLX: "9X",
                CLLWHSRY: 32.4,
                CLLWHSRZ: 33.6,
                LBZSXH: "213206",
                CLZJSRY: 805.3,
                MCZZRQ: "2015-12-24 00:00:00",
                CLZJSRZ: 805.2,
                LBYZZRQ: "2015-01-01 00:00:00",
                ZH: "79199",
                LBZLH: null,
                SCZZRQ: "2015-12-24 00:00:00",
                LBZZZRQ: "2015-01-01 00:00:00",
                CZZZDW: "114",
                LBYSXH: "211298",
                ZX: "RE2B",
                LBZLX: "9X",
                LBYCDH: "CO",
              },
            ],
          });
        }

        if (type === "csbts") {
          jsonString = JSON.stringify({
            code: "200",
            msg: "数据读取成功",
            data: [
              {
                CZZZDW: "048",
                CZZZRQ: "2009-10",
                MCZZDW: "131",
                MCZZRQ: "2018-07-09 00:00:00",
                SCZZDW: "131",
                SCZZRQ: "2018-07-09 00:00:00",

                DH: "dh" + barCode,
                ZH: barCode,
                ZX: "RE2B",
                SRYY: "厂修",
                SRDW: "588",
              },
            ],
          });
        }

        const headers = new Headers();
        headers.set("Content-Type", "application/json; charset=utf-8");

        return new Response(jsonString, { headers });
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

console.log(server.url.href);
