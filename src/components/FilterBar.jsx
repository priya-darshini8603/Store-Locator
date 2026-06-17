import React from "react";

export default function FilterBar({
  radius, setRadius, radiusOptions,
  sortBy, setSortBy,
  filterStatus, setFilterStatus,
  resultCount,
}) {
  const statusFilters = [
    { key: "all", label: "All" },
    { key: "open", label: "Open Now" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 text-sm">
      {/* Status pills */}
      <div className="flex items-center gap-1">
        {statusFilters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
              filterStatus === key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      {/* Radius */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs font-medium whitespace-nowrap">Radius:</span>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {radiusOptions.map((r) => (
            <option key={r} value={r}>{r} km</option>
          ))}
        </select>
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs font-medium">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer capitalize"
        >
          <option value="nearest">Nearest</option>
          <option value="farthest">Farthest</option>
          <option value="alphabetical">A–Z</option>
        </select>
      </div>

      {/* Result count */}
      <span className="ml-auto text-xs text-gray-400 font-medium">
        {resultCount} store{resultCount !== 1 ? "s" : ""} found
      </span>
    </div>
  );
}
