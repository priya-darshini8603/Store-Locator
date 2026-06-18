// Haversine formula to calculate distance between two coordinates
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

export function kmToMiles(km) {
  return km * 0.621371;
}

export function formatDistance(km) {
  const miles = kmToMiles(km);
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m · ${(miles * 5280).toFixed(0)} ft`;
  }
  return `${km.toFixed(1)} km · ${miles.toFixed(1)} mi`;
}

export function getCurrentDay(date = new Date()) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

export function isStoreOpen(hours, date = new Date()) {
  const today = getCurrentDay(date);
  const todayHours = hours[today];
  if (!todayHours) return false;

  const normalized = String(todayHours).trim().toLowerCase();
  if (normalized === "holiday") return false;
  if (normalized === "closed") return false;
  if (normalized.includes("24") || normalized.includes("24/7") || normalized.includes("open 24")) {
    return true;
  }

  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const [openStr, closeStr] = String(todayHours).split(/\s*-\s*/);
  if (!openStr || !closeStr) return false;

  const parseToMinutes = (str) => {
    const trimmed = String(str).trim();
    const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
    if (!match) return null;
    let h = Number(match[1]);
    const m = match[2] ? Number(match[2]) : 0;
    const period = match[3].toUpperCase();
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const openMin = parseToMinutes(openStr);
  const closeMin = parseToMinutes(closeStr);
  if (openMin === null || closeMin === null) return false;

  if (closeMin <= openMin) {
    return minutesNow >= openMin || minutesNow < closeMin;
  }

  return minutesNow >= openMin && minutesNow < closeMin;
}

export function getEffectiveStoreStatus(store, currentTime = new Date()) {
  return isStoreOpen(store.hours, currentTime)
    ? "open"
    : "closed";
}

export async function geocodeAddress(address) {
  const query = String(address || "").trim();

  if (!query) {
    throw new Error("Please enter a location.");
  }

 const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
 );

  if (!response.ok) {
    throw new Error("Unable to search location.");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Location not found.");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}