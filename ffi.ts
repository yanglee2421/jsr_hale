const stringToPointer = (str: string) => {
  const buf = new Uint16Array(str.length + 1);
  for (let i = 0; i < str.length; ++i) {
    buf[i] = str.charCodeAt(i);
  }

  return Deno.UnsafePointer.of(buf.buffer);
};

const main = () => {
  const winEnum = Object.freeze({
    // ShowWindow
    SW_RESTORE: 9,

    // SendMessageW
    BM_CLICK: 0x00f5,
    WM_CLOSE: 0x0010,
    WM_SETTEXT: 0x000c,
  });

  const user32 = Deno.dlopen("user32.dll", {
    MessageBoxW: {
      parameters: ["pointer", "pointer", "pointer", "u32"],
      result: "i32",
    },
    FindWindowW: {
      parameters: ["pointer", "pointer"],
      result: "pointer",
    },
    FindWindowExW: {
      parameters: ["pointer", "pointer", "pointer", "pointer"],
      result: "pointer",
    },
    SendMessageW: {
      parameters: ["pointer", "u32", "usize", "isize"],
      result: "isize",
    },
    SetForegroundWindow: {
      parameters: ["pointer"],
      result: "bool",
    },
    IsIconic: {
      parameters: ["pointer"],
      result: "bool",
    },
    ShowWindow: {
      parameters: ["pointer", "i32"],
      result: "bool",
    },
  });

  const notepad = user32.symbols.FindWindowW(
    null,
    stringToPointer("无标题 - Notepad")
  );

  if (!notepad) return;

  const isIconic = user32.symbols.IsIconic(notepad);

  user32.symbols.SetForegroundWindow(notepad);
  if (isIconic) {
    user32.symbols.ShowWindow(notepad, winEnum.SW_RESTORE);
  }

  const edit = user32.symbols.FindWindowExW(
    notepad,
    null,
    stringToPointer("edit"),
    null
  );

  if (!edit) return;

  const result = user32.symbols.SendMessageW(
    edit,
    winEnum.WM_SETTEXT,
    0n,
    Deno.UnsafePointer.value(stringToPointer("无标题 - Notepad"))
  );

  console.log("SendMessageW 結果:", notepad, isIconic, edit, result);

  user32.close();
};

main();
