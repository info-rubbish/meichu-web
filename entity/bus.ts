import * as Crawler from "./crawler.ts";

export type City = Crawler.City;
export const cities: City[] = ["HsinchuCounty", "Keelung", "Hsinchu"];

export class Bus {
  static buses: { [key: string]: Bus } = {};
  plate: string;
  people: number = 0;
  temperature: number = 0;
  humidity: number = 0;
  constructor(plate: string) {
    this.plate = plate;
  }
  static getByPlate(plate: string) {
    if (Bus.buses[plate]) return Bus.buses[plate];
    const bus = new Bus(plate);
    Bus.buses[plate] = bus;
    return bus;
  }
}

function getStartDist(name: string): [string, string] {
  const [start, _, end] = name.split(/(→|—)/);
  return [start || "my go", end || "my end"];
}

export class Route {
  private rawRoute: Crawler.Route;
  constructor(route: Crawler.Route) {
    this.rawRoute = route;
  }
  static async fetch(city: City): Promise<Route[]> {
    const routes = await new Crawler.RouteSource().fetch(city);
    return routes.map((route) => new Route(route));
  }
  public get name() {
    return this.rawRoute.name;
  }
  public get code() {
    return this.rawRoute.code;
  }
  async goRoute(): Promise<SingleRoute> {
    await this.rawRoute.fetchStops();
    const [start, dist] = getStartDist(this.name);

    return new SingleRoute(this.rawRoute.goStops, [start, dist]);
  }
  async backRoute(): Promise<SingleRoute> {
    await this.rawRoute.fetchStops();
    const [start, dist] = getStartDist(this.name);

    return new SingleRoute(this.rawRoute.backStops, [dist, start]);
  }
  path(): [string, string] {
    return getStartDist(this.name);
  }
  // async fetchRoutes(): Promise<{ [key: string]: SingleRoute }> {
  //   await this.rawRoute.fetchStops();
  //   const [start, end] = getStartDist(this.name);

  //   const result: { [key: string]: SingleRoute } = {};

  //   result[start] = new SingleRoute(this.rawRoute.goStops);
  //   result[end] = new SingleRoute(this.rawRoute.backStops);

  //   return result;
  // }
}

export class SingleRoute {
  public stops: Stop[] = [];
  public start: string;
  public dist: string;
  constructor(stops: Crawler.Stop[], [start, dist]: [string, string]) {
    this.dist = dist;
    this.start = start;

    for (const stop of stops) {
      this.stops.push(new Stop(stop));
    }
  }
}

export class Stop {
  public name: string;
  public status: string;
  public bus?: Bus;
  public arrivalTime: number = 0;
  public latitude?: string;
  public longtitude?: string;
  constructor(stop: Crawler.Stop) {
    this.name = stop.name;
    this.status = stop.status;
    this.bus = stop.busPlate ? Bus.getByPlate(stop.busPlate) : undefined;
    this.latitude = stop.latitude;
    this.longtitude = stop.longtitude;
    if (/^\[\d+分\]$/.test(this.status)) {
      this.arrivalTime = parseInt(this.status.slice(1, -2));
    }
  }
}
