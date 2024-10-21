import { DOMParser, Element } from "deno-dom";
interface Data{
  "longtitude": number,
  "latitude": number
}
import data from "../hsinchu.json" with {"type":"json"}
import { toPathString } from "$std/fs/_to_path_string.ts";

const data2 = data as {[key: string]:Data};

export type City = "HsinchuCounty" | "Keelung" | "Hsinchu";

export class RouteSource {
  url = "https://yunbus.tw/lite/search.php?city=";
  async fetch(city: City): Promise<Route[]> {
    const url = this.url + city;
    const rawHtml = await fetch(url).then((res) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");

    const routes: Route[] = [];
    for (const routeDom of dom.querySelectorAll("tr.route > td > a")) {
      routes.push(new Route(routeDom, url));
    }

    return routes;
  }
}

export class Route {
  goStops: Stop[] = [];
  backStops: Stop[] = [];
  private url: string;
  code: string;
  name: string;
  constructor(element: Element, baseUrl: string) {
    this.url = new URL(element.getAttribute("href")!, baseUrl).toString();
    const textContent = element.textContent;

    this.code = textContent?.split("]")[0].slice(1) ?? "";
    this.name = textContent?.split("]")[1] ?? "";

    this.code = this.code.trim();
    this.name = this.name.trim();
  }
  async fetchStops() {
    const rawHtml = await fetch(this.url).then((res) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");

    for (const stopDom of dom.querySelectorAll("table[id='go'] tr > td")) {
      const stop = new Stop(stopDom);
      await stop.fetchPosition();
      this.goStops.push(stop);
    }
    for (const stopDom of dom.querySelectorAll("table[id='bk'] tr > td")) {
      const stop = new Stop(stopDom);
      await stop.fetchPosition();
      this.backStops.push(stop);
    }
  }
}

export class Stop {
  name: string;
  status: string;
  busPlate?: string;
  UID: string;
  latitude: string;
  longtitude: string;

  fetchPosition() {
    this.latitude = data2[this.UID].latitude.toString();
    this.longtitude = data2[this.UID]?.longtitude.toString();
  }

  constructor(element: Element) {
    this.UID = element.querySelector('a')!.getAttribute('href')!.split('/')[4];
    this.latitude = '22';
    this.longtitude = '122';
    this.status = element.querySelector("a > :nth-child(1)")?.textContent!;
    this.name = element.querySelector("a > :nth-child(2)")?.textContent!;
    this.busPlate = element.querySelector("a > :nth-child(3)")?.textContent;
    this.status = this.status.replaceAll("[", "").replaceAll("]", "");
  }
}
