import * as fs from "node:fs/promises";
import * as path from "node:path";
import { z } from "zod";

const createProxy = <TData extends NonNullable<unknown>>(
  data: TData,
  onChange: () => void
) =>
  new Proxy(data, {
    get(object, property) {
      const value = Reflect.get(object, property);

      if (typeof value !== "object") {
        return value;
      }

      if (!value) {
        return value;
      }

      return createProxy(value, onChange);
    },
    set(object, property, value) {
      const result = Reflect.set(object, property, value);

      if (result) {
        onChange();
      }

      return result;
    },
  });

class Storage<TData extends NonNullable<unknown>> {
  private timer: number | undefined;
  private data: TData;
  private current: TData | null = null;
  constructor(
    private parse: (data: unknown) => TData,
    private filename: string
  ) {
    this.data = this.parse({});
  }

  private save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      try {
        const json = JSON.stringify(this.data);
        const filePath = path.join("./", this.filename);
        await fs.writeFile(filePath, json, "utf-8");
      } catch (error) {
        console.error(error);
      }
    }, 200);
  }

  private async hydrate() {
    try {
      const filePath = path.join("./", this.filename);
      const json = await fs.readFile(filePath, "utf-8");
      const presisted = JSON.parse(json);
      this.data = this.parse(presisted);
    } catch (error) {
      console.error(error);
    }
  }

  async ref() {
    if (!this.current) {
      await this.hydrate();
    }

    this.current ||= createProxy(this.data, () => this.save());
    return this.current;
  }
}

const schema = z.object({
  name: z.string().default(""),
  profile: z
    .object({
      homePath: z.string().default("/settings"),
    })
    .default({
      homePath: "/settings",
    }),
});

const init = async () => {
  const state = new Storage(schema.parse, "test.json");
  const ref = await state.ref();

  ref.name = "yanglee2421";
  ref.profile.homePath = "io.github.yanglee2421";
  // ref.profile.email = "yanglee2421@gmail.com";
  ref.name = "xx";

  console.log(ref);
};

init();
