import test from "node:test";
import assert from "node:assert/strict";
import { S3CallbackStore } from "../src/server/metaNurtureCallback";
const remoteError = (status: number) => Object.assign(new Error("test"), { name: "AccessDenied", $metadata: { httpStatusCode: status } });
test("conditionally initializes a missing object hidden by S3 ListBucket restrictions", async () => {
  let body: string | undefined; const puts: any[] = [];
  const client = { send: async (cmd: any) => {
    if (cmd.constructor.name === "GetObjectCommand") { if (!body) throw remoteError(403); return { ETag: '"one"', Body: { transformToString: async () => body } }; }
    puts.push(cmd.input); assert.equal(cmd.input.IfNoneMatch, "*"); body = cmd.input.Body; return {};
  } } as any;
  assert.deepEqual(await new S3CallbackStore(client, "test").read(), { version: 1, contacts: {} });
  assert.equal(puts.length, 1); assert.equal(puts[0].ServerSideEncryption, "AES256");
});
test("existing but unreadable state is never overwritten or treated as empty", async () => {
  let puts = 0;
  const client = { send: async (cmd: any) => {
    if (cmd.constructor.name === "GetObjectCommand") throw remoteError(403);
    puts++; assert.equal(cmd.input.IfNoneMatch, "*"); throw remoteError(412);
  } } as any;
  await assert.rejects(() => new S3CallbackStore(client, "test").read()); assert.equal(puts, 1);
});
test("true write permission failure remains a failure", async () => {
  const client = { send: async () => { throw remoteError(403); } } as any;
  await assert.rejects(() => new S3CallbackStore(client, "test").mutate(s => { s.contacts.x = { id: "1", email: "x@example.com", firstName: "X", registeredAt: 1 }; }));
});
