import React, { useState, useCallback, useMemo, useEffect } from "react";
import Header from "../components/Header";
import LocationInput from "../components/LocationInput";
import StoreList from "../components/StoreList";
import StoreModal from "../components/StoreModal";
import MapView from "../components/MapView";
import FilterBar from "../components/FilterBar";
import { stores as storeData } from "../data/stores";
import { haversineDistance, getEffectiveStoreStatus } from "../utils/distance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];
const SORT_OPTIONS = ["nearest", "farthest", "alphabetical"];

export default function StoreLocator() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualSearchActive, setManualSearchActive] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [hoveredStore, setHoveredStore] = useState(null);
  const [radius, setRadius] = useState(25);
  const [sortBy, setSortBy] = useState("nearest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("split");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const enrichedStores = useMemo(() => {
    return storeData.map((store) => {
      const distance = userLocation
        ? haversineDistance(
            userLocation.lat,
            userLocation.lng,
            store.lat,
            store.lng
          )
        : null;
      const effectiveStatus = getEffectiveStoreStatus(store, currentTime);
      return {
        ...store,
        distance,
        isOpen: effectiveStatus === "open",
        effectiveStatus,
      };
    });
  }, [userLocation, currentTime]);

  const filteredStores = useMemo(() => {
    let result = [...enrichedStores];

    if (searchQuery.trim()) {
      const searchKey = searchQuery.toLowerCase();
      result = result.filter((store) => {
        const searchable = [
          store.name,
          store.address,
          store.city,
          store.state,
          store.zip,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(searchKey);
      });
    }

    if (userLocation) {
      result = result.filter(
        (s) => s.distance === null || s.distance <= radius
      );
    }

    if (filterStatus === "open") {
      result = result.filter((s) => s.isOpen);
    } else if (filterStatus === "closed") {
      result = result.filter((s) => !s.isOpen);
    }

    if (sortBy === "nearest" && userLocation) {
      result.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    } else if (sortBy === "farthest" && userLocation) {
      result.sort((a, b) => (b.distance ?? 0) - (a.distance ?? 0));
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [enrichedStores, searchQuery, radius, sortBy, filterStatus, userLocation]);

  const nearestStore = useMemo(() => {
    if (!userLocation) return null;
    const sorted = [...enrichedStores].sort(
      (a, b) => (a.distance ?? 999) - (b.distance ?? 999)
    );
    return sorted[0] || null;
  }, [enrichedStores, userLocation]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel("Your current location");
        setSearchQuery("");
        setManualSearchActive(false);
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please enter your address below."
            : "Unable to get your location. Please try entering it manually."
        );
        setLocationLoading(false);
      }
    );
  }, []);

  const handleQueryChange = useCallback((value) => {
    setSearchQuery(value);
    setLocationLabel(value);
    setLocationError("");
    setManualSearchActive(!!value);
  }, []);

  useEffect(() => {
    if (locationError) {
      toast.error(locationError, { position: "top-right" });
    } else if (locationLabel && !searchQuery && !manualSearchActive) {
      toast.success(locationLabel, { position: "top-right", autoClose: 3000 });
    }
  }, [locationError, locationLabel, searchQuery, manualSearchActive]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      <ToastContainer />

      <main className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <LocationInput
              query={searchQuery}
              onQueryChange={handleQueryChange}
              onGetLocation={handleGetLocation}
              locationLabel={locationLabel}
              isLoading={locationLoading}
              error={locationError}
            />
          </div>
        </div>

        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4">
            <FilterBar
              radius={radius}
              setRadius={setRadius}
              radiusOptions={RADIUS_OPTIONS}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOptions={SORT_OPTIONS}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              resultCount={filteredStores.length}
            />
          </div>
        </div>

        <div className={`flex-1 max-w-screen-xl mx-auto w-full ${viewMode === 'split' && selectedStore ? 'px-0' : 'px-4'} py-4`}>
          <div
            className={`flex ${
              viewMode === "map"
                ? "gap-4 flex-col h-full"
                : viewMode === "split" && selectedStore
                ? "flex-col lg:flex-row lg:gap-0 h-full"
                : "gap-4 flex-col lg:flex-row h-full"
            }`}
            style={{ minHeight: "calc(100vh - 220px)" }}
          >
            {viewMode !== "map" && (
              <div
                className={`${
                  viewMode === "split" ? "lg:w-2/5 xl:w-1/3" : "w-full"
                } flex flex-col gap-3 overflow-y-auto`}
                style={{ maxHeight: viewMode === "split" ? "calc(100vh - 230px)" : "auto" }}
              >
                {!userLocation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📍</div>
                    <p className="text-blue-800 font-semibold text-sm">
                      Share your location to find nearby stores
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      All {storeData.length} stores shown below
                    </p>
                  </div>
                )}
                {nearestStore && userLocation && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 text-white text-sm flex items-center gap-2 shadow">
                    <span className="text-lg">⭐</span>
                    <div>
                      <span className="font-bold">Closest to you: </span>
                      <span>{nearestStore.name}</span>
                      <span className="ml-2 text-blue-200">
                        {nearestStore.distance?.toFixed(1)} km away
                      </span>
                    </div>
                  </div>
                )}

                <StoreList
                  stores={filteredStores}
                  nearestStoreId={nearestStore?.id}
                  selectedStore={selectedStore}
                  hoveredStore={hoveredStore}
                  onSelectStore={setSelectedStore}
                  onHoverStore={setHoveredStore}
                  userLocation={userLocation}
                />
              </div>
            )}

            {viewMode !== "list" && (
              <div
                className={`${
                  viewMode === "split" ? "lg:flex-1" : "w-full"
                } rounded-2xl overflow-hidden shadow-md`}
                style={{
                  minHeight: "500px",
                  height: viewMode === "map" ? "calc(100vh - 230px)" : "500px",
                  flex: viewMode === "split" ? 1 : undefined,
                }}
              >
                <MapView
                  stores={filteredStores}
                  userLocation={userLocation}
                  radius={radius}
                  selectedStore={selectedStore}
                  hoveredStore={hoveredStore}
                  onSelectStore={setSelectedStore}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedStore && (
        <StoreModal
          store={enrichedStores.find((s) => s.id === selectedStore)}
          onClose={() => setSelectedStore(null)}
          nearestStoreId={nearestStore?.id}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}
