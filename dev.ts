#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";
import { NXPCollector } from "./entity/nxp/mod.ts";

await Promise.all([
  new NXPCollector().start(),
  dev(import.meta.url, "./main.ts", config),
]);
