import { RouteSource } from "../../entity/crawler.ts";
import BusMap from "../../islands/BusMap.tsx";
import { City, Route} from "../../entity/bus.ts";
import { FreshContext, PageProps } from "$fresh/server.ts";
import StopList from "../../components/StopList.tsx";

export default async function Home(_: FreshContext, props: PageProps) {
  const city = props.params.city as City | undefined;
  const code = props.params.code as string | undefined;
  let route!: Route;
  if (city) {
    const routes = await Route.fetch(city);
    for (let i = 0; i < routes.length; i++) {
        if(routes[i].code === decodeURI(code!)) {
        route = routes[i];
        break;
      }
    }
  }
  const stopsRoute = await route.goRoute();
  
  return (
    <StopList
      stops={stopsRoute.stops}
      routeName={route.path().join(" to ")}
    />
  );
}
