import { cities, City, Route } from "../entity/bus.ts";
import { Button } from "./Button.tsx";

export interface PageProps {
  routes?: Route[];
  city?: City;
}

export default function CityList({ routes = [], city }: PageProps) {
  return (
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-4 text-center">
        Taiwan City Bus Selector
      </h1>
      <form class="mb-4" method="POST">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="city-select"
        >
          Select a city:
        </label>
        <select
          name="city"
          value={city}
          class="shadow border rounded w-full py-2 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {cities.map((city) => (
            <option>
              <a href={`/city/${city}`}>
                {city}
              </a>
            </option>
          ))}
        </select>
        <Button type="submit" class="px-8">Submit</Button>
      </form>
      {city
        ? (
          <div>
            <h2 class="text-xl font-semibold mb-2">
              Buses in {city}:
            </h2>
            <ul class="space-y-2">
              {routes.map((route, index) => (
                <a href={`${city}/${route.code}`}>
                  <li key={index} class="border-b p-2 rounded">
                    <span class="mx-1 px-2 py-1 bg-sky-300 rounded-md">
                      {route.code}
                    </span>
                    由 {route.path().join(" 到 ")}
                  </li>
                </a>
              ))}
            </ul>
          </div>
        )
        : null}
    </div>
  );
}
