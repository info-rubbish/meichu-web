type MessageKind = "people" | "temperature" | "humidity";

function getMessageKind(value: number): MessageKind | undefined {
  switch (value) {
    case 1:
      return "people";
    case 2:
      return "temperature";
    case 3:
      return "humidity";
    default:
      return undefined;
  }
}

export class NXPReceiver {
  listener: Deno.TcpListener;
  callbacks: Map<MessageKind, ((value: number) => void)[]> = new Map();
  constructor(port: number) {
    this.listener = Deno.listen({ port });
    for (const kind of ["people", "temperature", "humidity"]) {
      this.callbacks.set(kind as MessageKind, []);
    }
  }
  addEventListener(
    event: `recieve_${MessageKind}`,
    callback: (value: number) => void,
  ) {
    const kind = event.split("_")[1] as MessageKind;
    this.addEvent(kind, callback);
  }
  private addEvent(kind: MessageKind, callback: (value: number) => void) {
    const callbacks = this.callbacks.get(kind) || [];
    callbacks.push(callback);

    this.callbacks.set(kind, callbacks);
  }
  private callEvent(kind: MessageKind, value: number) {
    for (const callback of this.callbacks.get(kind) || []) callback(value);
  }

  private async handleConn(conn: Deno.TcpConn) {
    const buffer = new Uint8Array(128);

    const readByte = await conn.read(buffer);
    if (readByte != 5) {
      console.trace("byte must be five");
      return;
    }
    const kind = getMessageKind(buffer[0]);
    if (!kind) {
      console.trace("message kind must be 1-3 int");
      return;
    }

    conn.close();

    let value = 0;
    for (let i = 0; i < 4; i++) value += Math.pow(256, i) * buffer[i + 1];

    console.log(`recieve ${kind} ${value}`);

    this.callEvent(kind, value);
  }
  async start() {
    for await (const conn of this.listener) this.handleConn(conn);
  }
}

export async function writeInfoTcpRepeat(
  conn: Deno.TcpConn,
  info: { people: number; humidity: number; temperature: number },
) {
  const buffer = new Uint8Array(12);
  const signal = new Uint8Array(5);

  while (true) {
    await conn.read(signal);

    for (let i = 0; i < 4; i++) buffer[i] = (info.people >> (i * 8)) & 0xff;
    for (let i = 0; i < 4; i++) {
      buffer[i + 4] = (info.humidity >> (i * 8)) & 0xff;
    }
    for (let i = 0; i < 4; i++) {
      buffer[i + 8] = (info.temperature >> (i * 8)) & 0xff;
    }
    
    try {
      await conn.write(buffer);
    } catch (_) {
      break;
    }
  }
}
