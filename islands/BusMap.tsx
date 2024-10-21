import { useEffect } from "preact/hooks";
import { Stop } from "../entity/bus.ts";

// Declare the props type for the component
interface BusMapProps {
  apiKey: string;
  stops: Stop[];
  code: string | undefined;
}

export default function BusMap({ apiKey, stops, code }: BusMapProps) {
  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 13,
          center: { lat: Number(stops[0].latitude), lng: Number(stops[0].longtitude) },
        },
      );
      let id = 0;
      stops.forEach((stop) => {
        id += 1;
        const marker = new window.google.maps.Marker({
          position: { lat: Number(stop.latitude), lng: Number(stop.longtitude) },
          map: map,
          title: `${code} - ${stop.status}`,
          label: {
            text: id.toString(),    // The text you want on the marker
            fontSize: "16px", // Text font size
            color: "white",           
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<h3>${stop.name}</h3><p>Status: ${stop.status}</p>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setTimeout(() => {
            infoWindow.close();
          }, 2000);
        });
      });
    };

    // Dynamically load the Google Maps script with the passed API key
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry&v=3&callback=initMap`;
    script.async = true;
    script.defer = true;
    (window as any).initMap = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
