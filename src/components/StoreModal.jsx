import React, { useEffect } from "react";
import { getCurrentDay } from "../utils/distance";

const serviceIcons = {
  "Pharmacy": "💊",
  "Photo Center": "📸",
  "Deli & Bakery": "🍞",
  "Check Cashing": "💵",
  "Garden Center": "🌿",
};

const statusConfig = {
  open: { label: "OPEN NOW", cls: "text-green-600", dot: "bg-green-500" },
  closed: { label: "CLOSED", cls: "text-red-500", dot: "bg-red-500" },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ModalContent({ store, onClose, nearestStoreId }) {
  const today = getCurrentDay();
  const status = store?.isOpen ? statusConfig.open : statusConfig.closed;

  return (
    <>
      <div className="relative bg-gradient-to-br from-blue-800 to-blue-600 h-36 flex items-center justify-center rounded-t-3xl overflow-hidden">
        <div className="text-white text-6xl opacity-20">🏪</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {store.id === nearestStoreId && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
            ⭐ Closest Store
          </div>
        )}
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <div className="mb-1">
          <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${status.cls}`}>
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            {store.distance !== null && store.distance !== undefined && (
              <span className="text-gray-400 text-sm">· {store.distance.toFixed(1)} km away</span>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 text-gray-600 text-sm mt-3">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {store.wheelchairAccessible && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">♿ Wheelchair</span>
          )}
          {store.parking && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">🅿 Parking</span>
          )}
        </div>
        <a href={`tel:${store.phone}`} className="flex items-center gap-2 mt-4 text-blue-600 font-semibold text-sm border border-blue-100 rounded-xl px-4 py-2.5 hover:bg-blue-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {store.phone}
        </a>
        <div className="flex gap-2 mt-3">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address + ', ' + store.city + ', ' + store.state)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
          <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm" onClick={() => {navigator.share?.({ title: store.name, text: `${store.name}\n${store.address}` });}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Operating Hours
          </h3>
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            {DAYS.map((day, i) => {
              const hrs = store.hours?.[day] || "—";
              const isToday = day === today;
              return (
                <div key={day} className={`flex justify-between items-center px-4 py-2.5 text-sm ${isToday ? "bg-blue-50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className={isToday ? "text-blue-700" : "text-gray-700"}>{day}{isToday && " (Today)"}</span>
                  <span className={hrs === "Closed" ? "text-red-500 font-semibold" : isToday ? "text-blue-700" : "text-gray-600"}>{hrs}</span>
                </div>
              );
            })}
          </div>
        </div>
        {store.services?.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Services at This Location
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {store.services.map((svc) => (
                <div key={svc} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium">
                  <span>{serviceIcons[svc] || "✓"}</span>
                  {svc}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function StoreModal({ store, onClose, nearestStoreId, viewMode }) {
  // Treat `map` the same as `split` on large screens so the details panel
  // can appear as a right-side fixed sidebar when a marker is clicked.
  const isSplitView = viewMode === "split" || viewMode === "map";

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    if (!isSplitView) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, isSplitView]);

  if (!store) return null;

  // Split view: side panel on lg screens, modal on mobile
  if (isSplitView) {
    return (
      <>
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:hidden" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <ModalContent store={store} onClose={onClose} nearestStoreId={nearestStoreId} />
          </div>
        </div>
        <div className="hidden lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 lg:bg-white lg:shadow-2xl lg:overflow-y-auto lg:block" style={{ zIndex: 9999 }}>
          <ModalContent store={store} onClose={onClose} nearestStoreId={nearestStoreId} />
        </div>
      </>
    );
  }

  // Full screen modal for list/map-only views
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <ModalContent store={store} onClose={onClose} nearestStoreId={nearestStoreId} />
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.32,0.72,0,1); }
        @media (min-width: 640px) {
          .animate-slide-up { animation: none; }
        }
      `}</style>
    </div>
  );
}

