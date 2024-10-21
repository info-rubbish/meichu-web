import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import CityList from "../../components/CityList.tsx";
import { City, Route } from "../../entity/bus.ts";

export const handler: Handlers = {
  async POST(req, _) {
    const form = await req.formData();
    const city = form.get("city")?.toString();

    const headers = new Headers();
    headers.set("location", "/" + city);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default async function Home(_: FreshContext, props: PageProps) {
  const city = props.params.city as City | undefined;
  let routes;
  if (city) routes = await Route.fetch(city);

  return <CityList city={city} routes={routes} />;
}
