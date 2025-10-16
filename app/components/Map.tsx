'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface POI {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description?: string;
}

interface Traffic {
  id: number;
  lat: number;
  lng: number;
  level: string;
  description?: string;
}

interface Route {
  path: [number, number][];
  distance: number;
  duration: string;
}

export default function Map() {
  const [pois, setPois] = useState<POI[]>([]);
  const [traffic, setTraffic] = useState<Traffic[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    fetch('/api/poi')
      .then(res => res.json())
      .then(setPois);

    fetch('/api/traffic')
      .then(res => res.json())
      .then(setTraffic);
  }, []);

  const handleRoute = async () => {
    const [startLat, startLng] = start.split(',').map(Number);
    const [endLat, endLng] = end.split(',').map(Number);

    const res = await fetch(`/api/routes?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`);
    const data = await res.json();
    setRoute(data);
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white shadow">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Start (lat,lng)"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="End (lat,lng)"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border p-2"
          />
          <button onClick={handleRoute} className="bg-blue-500 text-white px-4 py-2">Route</button>
        </div>
      </div>
      <div className="flex-1">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pois.map(poi => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]}>
              <Popup>
                <strong>{poi.name}</strong><br />
                {poi.description}
              </Popup>
            </Marker>
          ))}
          {traffic.map(t => (
            <Circle
              key={t.id}
              center={[t.lat, t.lng]}
              radius={100}
              pathOptions={{ color: getTrafficColor(t.level) }}
            >
              <Popup>{t.description}</Popup>
            </Circle>
          ))}
          {route && (
            <Polyline positions={route.path} color="blue" />
          )}
        </MapContainer>
      </div>
    </div>
  );
}