import { RouteSource } from "./crawler.ts";

Deno.test("Route.fetchRoutes", async () => {
  const source = new RouteSource();
  const routes = await source.fetch("HsinchuCounty");
  console.log(routes);
  const route = routes[0];
  await route.fetchStops();
  console.log(route);
});
