import { Alert, SeverityLevel } from "../../shared/schema";

// Philippine Bounding Box
const PH_BOUNDS = {
  minLat: 4,
  maxLat: 21,
  minLng: 116,
  maxLng: 127,
};

function isWithinPH(lat: number, lng: number): boolean {
  return (
    lat >= PH_BOUNDS.minLat &&
    lat <= PH_BOUNDS.maxLat &&
    lng >= PH_BOUNDS.minLng &&
    lng <= PH_BOUNDS.maxLng
  );
}

export async function fetchRealTimeAlerts(): Promise<Alert[]> {
  const alerts: Alert[] = [];

  try {
    // 1. Fetch Earthquakes from USGS
    const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4.0&starttime=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`;
    const usgsRes = await fetch(usgsUrl);
    if (usgsRes.ok) {
      const data = await usgsRes.json();
      for (const feature of data.features || []) {
        const [lng, lat] = feature.geometry.coordinates;
        if (isWithinPH(lat, lng)) {
          const mag = feature.properties.mag;
          alerts.push({
            id: `usgs-${feature.id}`,
            type: "earthquake",
            title: `Magnitude ${mag} Earthquake`,
            date: new Date(feature.properties.time).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            description: feature.properties.place,
            severity: mag >= 6 ? "High" : mag >= 5 ? "Medium" : "Low",
            location: feature.properties.place.split(" of ")[1] || feature.properties.place,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching USGS alerts:", error);
  }

  try {
    // 2. Fetch from GDACS (RSS)
    // For simplicity without an XML parser in a restricted environment, 
    // we'll focus on the most reliable JSON sources first.
    // GDACS also provides GeoJSON for specific events if we knew the IDs, 
    // but its RSS is the main feed.
    const gdacsUrl = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/json?eventtypes=TC,FL,EQ";
    const gdacsRes = await fetch(gdacsUrl);
    if (gdacsRes.ok) {
        const data = await gdacsRes.json();
        // GDACS JSON structure varies, but usually it's an array of features
        for (const feature of data.features || []) {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            const [lng, lat] = coords;
            
            if (isWithinPH(lat, lng)) {
                let type: "typhoon" | "flood" | "earthquake" | "landslide" | "fire" = "typhoon";
                if (props.eventtype === "TC") type = "typhoon";
                else if (props.eventtype === "FL") type = "flood";
                else if (props.eventtype === "EQ") type = "earthquake";
                
                const severity: SeverityLevel = props.alertlevel === "Red" ? "High" : props.alertlevel === "Orange" ? "Medium" : "Low";
                
                alerts.push({
                    id: `gdacs-${props.eventid}`,
                    type,
                    title: props.eventname,
                    date: new Date(props.fromdate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }),
                    description: `${props.eventtype} event in ${props.country}. ${props.episodealertlevel || ""} alert level.`,
                    severity,
                    location: props.country,
                });
            }
        }
    }
  } catch (error) {
    console.error("Error fetching GDACS alerts:", error);
  }

  // Deduplicate and sort by date (newest first - though our date format is string, we'd need timestamps for real sorting)
  // For now, return as is or add manual static fallbacks if empty
  if (alerts.length === 0) {
      return []; // Or return static data
  }

  return alerts;
}
