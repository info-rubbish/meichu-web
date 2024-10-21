import { Bus } from "../bus.ts";
import { NXPReceiver, writeInfoTcpRepeat } from "./message.ts";

const hardcodedPlate = "SKL-0123";

export class NXPCollector {
  receiver = new NXPReceiver(10001);
  constructor() {
    this.receiver.addEventListener("recieve_temperature", (value) => {
      Bus.getByPlate(hardcodedPlate).temperature = value;
    });
    this.receiver.addEventListener("recieve_people", (value) => {
      Bus.getByPlate(hardcodedPlate).people = value;
    });
    this.receiver.addEventListener("recieve_humidity", (value) => {
      Bus.getByPlate(hardcodedPlate).humidity = value;
    });
  }
  private async serveInfo() {
    for await (const conn of Deno.listen({ port: 10002 })) {
      const bus = Bus.getByPlate(hardcodedPlate);
      writeInfoTcpRepeat(conn, {
        people: bus.people,
        temperature: bus.temperature,
        humidity: bus.humidity,
      });
    }
  }
  start() {
    return Promise.all([this.receiver.start(), this.serveInfo()]);
  }
}
