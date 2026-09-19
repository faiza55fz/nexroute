import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Coordinate = [number, number];

// Siliguri
const siliguri: Coordinate = [26.7271, 88.3953];

// Gangtok
const gangtok: Coordinate = [27.3314, 88.6138];

// Approximate location used as a DEMO disruption point
const disruption: Coordinate = [27.02, 88.51];

export default function NexRouteMap() {
  const [currentRoute, setCurrentRoute] = useState<Coordinate[]>([]);
  const [alternateRoute, setAlternateRoute] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(false);

        // -----------------------------------------
        // CURRENT ROUTE
        // Siliguri → Gangtok
        // -----------------------------------------

        const currentUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${siliguri[1]},${siliguri[0]};` +
          `${gangtok[1]},${gangtok[0]}` +
          `?overview=full&geometries=geojson`;

        const currentResponse = await fetch(currentUrl);

        if (!currentResponse.ok) {
          throw new Error("Current route request failed");
        }

        const currentData = await currentResponse.json();

        if (currentData.routes?.length > 0) {
          const coordinates: Coordinate[] =
            currentData.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            );

          setCurrentRoute(coordinates);
        }

        // -----------------------------------------
        // ALTERNATE ROUTE
        // Siliguri → Kalimpong area → Gangtok
        // -----------------------------------------

        const alternateWaypoint: Coordinate = [27.066, 88.47];

        const alternateUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${siliguri[1]},${siliguri[0]};` +
          `${alternateWaypoint[1]},${alternateWaypoint[0]};` +
          `${gangtok[1]},${gangtok[0]}` +
          `?overview=full&geometries=geojson`;

        const alternateResponse = await fetch(alternateUrl);

        if (!alternateResponse.ok) {
          throw new Error("Alternate route request failed");
        }

        const alternateData = await alternateResponse.json();

        if (alternateData.routes?.length > 0) {
          const coordinates: Coordinate[] =
            alternateData.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            );

          setAlternateRoute(coordinates);
        }
      } catch (err) {
        console.error("OSRM route error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <MapContainer
        center={gangtok}
        zoom={9}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {/* OpenStreetMap */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* -----------------------------------------
            CURRENT / DANGER ROUTE
        ----------------------------------------- */}

        {currentRoute.length > 0 && (
          <Polyline
            positions={currentRoute}
            pathOptions={{
              color: "#ef4444",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}

        {/* -----------------------------------------
            ALTERNATE / SAFE ROUTE
        ----------------------------------------- */}

        {alternateRoute.length > 0 && (
          <Polyline
            positions={alternateRoute}
            pathOptions={{
              color: "#22c55e",
              weight: 5,
              opacity: 0.9,
              dashArray: "8 8",
            }}
          />
        )}

        {/* -----------------------------------------
            MED-07 VEHICLE
        ----------------------------------------- */}

        <Marker position={gangtok}>
          <Popup>
            <strong>MED-07</strong>
            <br />
            Essential Medicines
            <br />
            Destination: Gangtok Medical Supply Hub
          </Popup>
        </Marker>

        {/* -----------------------------------------
            DISRUPTION
        ----------------------------------------- */}

        <CircleMarker
          center={disruption}
          radius={12}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.35,
          }}
          eventHandlers={{
            click: () => {
              console.log("Landslide disruption clicked");
            },
          }}
        >
          <Popup>
            <strong>⚠ Landslide Disruption</strong>
            <br />
            NH-10 corridor
            <br />
            <br />
            <strong>Status:</strong> At Risk
          </Popup>
        </CircleMarker>

        {/* -----------------------------------------
            ORIGIN
        ----------------------------------------- */}

        <CircleMarker
          center={siliguri}
          radius={7}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#2563eb",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <strong>Siliguri</strong>
            <br />
            Vehicle Origin
          </Popup>
        </CircleMarker>

        {/* -----------------------------------------
            DESTINATION
        ----------------------------------------- */}

        <CircleMarker
          center={gangtok}
          radius={7}
          pathOptions={{
            color: "#7c3aed",
            fillColor: "#7c3aed",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <strong>Gangtok Medical Supply Hub</strong>
            <br />
            Essential medicine destination
          </Popup>
        </CircleMarker>
      </MapContainer>

      {/* -----------------------------------------
          LOADING MESSAGE
      ----------------------------------------- */}

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            background: "white",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Loading road network...
        </div>
      )}

      {/* -----------------------------------------
          ERROR MESSAGE
      ----------------------------------------- */}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            background: "white",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: 13,
          }}
        >
          Unable to load road routes.
        </div>
      )}
    </div>
  );
}