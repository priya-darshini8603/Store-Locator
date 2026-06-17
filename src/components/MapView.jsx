import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  LayersControl,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER = [30.2672, -97.7431];
const DEFAULT_ZOOM = 12;

function createStoreIcon(isSelected, isHovered) {
  let color = "#2563eb";
  let size = 32;

  if (isSelected) {
    color = "#1d4ed8";
    size = 44;
  } else if (isHovered) {
    color = "#f59e0b";
    size = 38;
  }

  return L.divIcon({
    className: "store-marker",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 6px 18px rgba(0,0,0,0.18);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="transform:rotate(45deg);color:white;font-size:14px;line-height:1;">📍</div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -(size + 8)],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "user-marker",
    html: `<div style="
      width:24px;height:24px;
      background:#2563eb;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 6px rgba(37,99,235,0.18);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function FitMapView({ stores, userLocation, selectedStore }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedStore) {
      const selected = stores.find((store) => store.id === selectedStore);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], 15, { animate: true, duration: 1.0 });
        return;
      }
    }

    // Calculate bounds from all stores
    if (stores.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    const bounds = L.latLngBounds(
      stores.map((store) => [store.lat, store.lng])
    );

    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.18), { animate: true, duration: 1.0 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [map, stores, userLocation, selectedStore]);

  return null;
}

export default function MapView({ stores, userLocation, selectedStore, hoveredStore, radius, onSelectStore }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
        className="leaflet-container"
      >
        <ZoomControl position="bottomright" />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='Map data: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a>'
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FitMapView stores={stores} userLocation={userLocation} selectedStore={selectedStore} />

        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius * 1000}
              pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.08 }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
              <Popup>
                <div className="text-sm font-semibold text-slate-800">📍 Your location</div>
              </Popup>
            </Marker>
          </>
        )}

        {stores.map((store) => {
          const isSelected = store.id === selectedStore;
          const isHovered = store.id === hoveredStore;
          let statusText = "● CLOSED";
          let statusClass = "text-rose-600";

          if (store.isOpen) {
            statusText = "● OPEN";
            statusClass = "text-emerald-600";
          }

          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createStoreIcon(isSelected, isHovered)}
              eventHandlers={{ click: () => onSelectStore(store.id) }}
            >
              <Tooltip direction="top" offset={[0, -18]} opacity={0.95} permanent={false}>
                <div className="text-sm font-semibold">{store.name}</div>
              </Tooltip>
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", minWidth: 210 }}>
                  <div className="font-semibold text-slate-900 text-sm">{store.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{store.address}, {store.city}</div>
                  <div className={`text-xs font-semibold ${statusClass}`}>
                    {statusText}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{store.phone}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {!userLocation && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-2 rounded-full shadow-md border border-gray-100 pointer-events-none">
          📍 Share your location to see nearest stores
        </div>
      )}
    </div>
  );
}
