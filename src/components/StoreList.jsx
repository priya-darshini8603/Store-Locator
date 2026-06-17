import React from "react";
import StoreCard from "./StoreCard";

export default function StoreList({
  stores,
  nearestStoreId,
  selectedStore,
  hoveredStore,
  onSelectStore,
  onHoverStore,
  userLocation,
}) {
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-gray-700 font-semibold text-base mb-1">No stores found</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Try increasing the search radius or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isNearest={store.id === nearestStoreId}
          isSelected={selectedStore === store.id}
          isHovered={hoveredStore === store.id}
          onSelect={onSelectStore}
          onHover={onHoverStore}
        />
      ))}
    </div>
  );
}
