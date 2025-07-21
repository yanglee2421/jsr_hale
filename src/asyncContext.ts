import assert from "node:assert";

function program() {
  const value = { key: 123 };

  // Implicitly propagated via shared reference to an external variable.
  // The value is only available only for the _synchronous execution_ of
  // the try-finally code.
  try {
    shared = value;
    implicit();
  } finally {
    shared = undefined;
  }
}

let shared: { key: number } | undefined;
async function implicit() {
  const value = shared?.key;
  console.log(Object.is(value, 123), "/", Object.is(shared?.key, 123));

  // The shared reference is still set to the correct value.
  assert.strictEqual(shared?.key, 123);

  await 1;

  // After awaiting, the shared reference has been reset to `undefined`.
  // We've lost access to our original value.
  assert.throws(() => {
    console.log(Object.is(value, 123), "/", Object.is(shared?.key, 123));

    assert.strictEqual(shared?.key, 123);
  });
}

program();
