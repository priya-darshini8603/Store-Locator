import React from "react";
import { formatDistance, getCurrentDay } from "../utils/distance";

const statusConfig = {
  open: { label: "OPEN", cls: "bg-green-100 text-green-700" },
  closed: { label: "CLOSED", cls: "bg-red-100 text-red-600" },
};

export default function StoreCard({
  store,
  isNearest,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) {
  const status = store.isOpen ? statusConfig.open : statusConfig.closed;
  const today = getCurrentDay();
  const todayHours = store.hours?.[today] || "—";

  return (
    <div
      className={`store-card relative bg-white rounded-2xl border-2 cursor-pointer shadow-sm overflow-hidden
        ${isSelected ? "border-blue-500 shadow-blue-100 shadow-md" : isHovered ? "border-blue-300 shadow-md" : "border-gray-100 hover:border-blue-200 hover:shadow-md"}
      `}
      onClick={() => onSelect(store.id)}
      onMouseEnter={() => onHover(store.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Nearest badge */}
      {isNearest && (
        <div className="absolute top-3 right-3 z-10 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          ⭐ Closest
        </div>
      )}

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.cls}`}>
                {status.label}
              </span>
              {store.distance !== null && store.distance !== undefined && (
                <span className="text-xs text-gray-400 font-medium">
                  {store.distance.toFixed(1)} km away
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{store.name}</h3>
          </div>
          {/* favorites removed */}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-500 text-xs mb-2">
          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
        </div>

        {/* Hours today */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{today}: <strong className="text-gray-700">{todayHours}</strong></span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address + ', ' + store.city + ', ' + store.state)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
          <a
            href={`tel:${store.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-10 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
