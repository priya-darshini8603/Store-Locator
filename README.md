# 🗺️ Store Locator App

A responsive Store Locator web application built with React and Tailwind CSS that helps users find nearby stores based on their current location or a manually entered location. The application displays stores on an interactive map and provides distance calculations, filtering, sorting, and directions.

---

## Features

* 📍 Browser Geolocation Support
* 🔍 Manual Location Search
* 📏 Distance Calculation using Haversine Formula
* 🗺️ Interactive Map with Leaflet & OpenStreetMap
* 🏪 Store Listing with Detailed Information
* 🎯 Nearest Store Highlighting
* 🔄 Real-time Filtering and Sorting
* 📱 Fully Responsive Design
* 🚗 Get Directions via Google Maps

---

## Technology Stack

* React 18
* JavaScript (ES6+)
* Tailwind CSS
* React Leaflet
* OpenStreetMap
* Haversine Distance Formula

---

## Setup and Run Instructions

### Prerequisites

* Node.js 16+
* npm or yarn

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd store-locator
```

Install dependencies:

```bash
npm install
```

### Run Development Server

```bash
npm start
```

or (for Vite projects)

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

or

```text
http://localhost:5173
```

depending on the setup.

---

## Production Build

Create an optimized production build:

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx         # Logo + view mode toggle
│   ├── LocationInput.jsx  # GPS + manual search
│   ├── FilterBar.jsx      # Radius, sort, status filters
│   ├── StoreList.jsx      # List of StoreCards
│   ├── StoreCard.jsx      # Individual store card
│   ├── MapView.jsx        # Leaflet map integration
│   └── StoreModal.jsx     # Store detail modal/drawer
├── data/
│   └── stores.js          # Store data
├── pages/
│   └── StoreLocator.jsx   # Main page that manages store search, user location, filtering, sorting, and coordinates all components.  
├── utils/
│   └── distance.js        # Haversine formula, geocoding, helpers
├── App.jsx                # Root component, state management
└── index.jsx              # Entry point
```

---

## Assumptions Made During Development

* Store data is maintained locally in `stores.js`.
* User location is obtained through the browser Geolocation API.
* If location permission is denied, users can manually search for a location.
* OpenStreetMap is used instead of paid map providers to avoid API costs.
* Distance calculations are performed client-side using the Haversine formula.
* Store operating hours are static and provided in the dataset.
* Internet connectivity is required for map tiles and geolocation services.
* The application does not require a backend server for the current implementation.

---

## Customization

### Add More Stores

Update:

```text
src/data/stores.js
```

with additional store locations.

### Integrate Real Geocoding

Replace the mock geocoding logic in:

```text
src/utils/distance.js
```

with:

* Google Maps Geocoding API
* Mapbox Geocoding API
* OpenCage Geocoding API

### Change Map Provider

Modify:

```text
src/components/MapView.js
```

to use:

* Google Maps
* Mapbox
* HERE Maps

instead of OpenStreetMap.




