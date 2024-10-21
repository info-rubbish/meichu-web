import { Stop } from "../entity/bus.ts";
import BusMap from "../islands/BusMap.tsx"

export interface PageProps {
  stops?: Stop[];
  routeName?: string;
}

export default function StopList({ stops = [], routeName }: PageProps) {
  const apikey = Deno.env.get('GOOGLE_MAP_API_KEY') as string;
  let preBus = undefined;
  for(const stop of stops) {
    if(stop.bus !== undefined) {
        preBus = stop.bus;
    }
    else {
        stop.bus = preBus;
    }
  }
  return (
    <>
    <h1 class="text-2xl font-bold mb-4 text-white">Bus Stop Status: {routeName}</h1>
    <BusMap code={routeName} stops={stops} apiKey={apikey}/>
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mb-4 text-white">Bus Stop Status</h1>
      <ul class="space-y-2">
        {stops.map((stop) => (
            <li class="border p-2 rounded text-white" key={stop.name}>
                
                    <span class="font-bold">{stop.name + " "}</span>
                {stop.status === '未發車' || stop.status === '末班離' || stop.status == '今停駛' ? stop.status :
                <>
                  <div>
                    Arriving in:{" "}
                    <span class="text-green-600">{stop.status}</span>
                    <br />
                    Humidity: {stop.bus?.humidity} <br />
                    Temperature: {stop.bus?.temperature} <br />
                    People: {stop.bus?.people} <br />
                    Plate: {stop.bus?.plate}
                  </div>
                </>
            }
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
