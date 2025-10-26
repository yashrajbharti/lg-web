import { flytoview } from "../api/flytoview.mjs";
import { getFeatures } from "../utils/get-features.mjs";

export class InteractiveMap extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.map = null;
    this.idleTimeout = null;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        gmp-map {
          inline-size: 100%;
          block-size: calc(100dvh - 64px);
        }
        #leaflet-map {
          inline-size: 100%;
          block-size: calc(100dvh - 64px);
        }
        .leaflet-control-attribution.leaflet-control {
          display: none;
        }
      </style>
      <gmp-map center="34.07022,-118.54453" zoom="11" map-id="DEMO_MAP_ID"></gmp-map>
      <div id="leaflet-map" style="display: none;"></div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const apiKey = localStorage.getItem("googleMapsApiKey");
    if (!apiKey) {
      this.useFallbackMap();
      return;
    }
    this.waitForGoogleMaps();
  }

  useFallbackMap() {
    const gmapElement = this.shadowRoot.querySelector("gmp-map");
    const leafletContainer = this.shadowRoot.getElementById("leaflet-map");

    gmapElement.style.display = "none";
    leafletContainer.style.display = "block";

    this.initLeafletMap();
  }

  initLeafletMap() {
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    this.shadowRoot.appendChild(leafletCSS);

    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletJS.onload = () => this.initializeLeafletMap();
    this.shadowRoot.appendChild(leafletJS);
  }

  async initializeLeafletMap() {
    const mapContainer = this.shadowRoot.getElementById("leaflet-map");

    const map = L.map(mapContainer, {
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
    }).setView([34.07022, -118.54453], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(map);

    const features = await getFeatures();

    const customIcon = L.icon({
      iconUrl: "https://yashrajbharti.github.io/lg-web/assets/Fire.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.geoJSON(features, {
      style: {
        color: "#ff0000",
        weight: 2,
        opacity: 0.8,
        fillColor: "#ff6b00",
        fillOpacity: 0.25,
      },
      pointToLayer: function (_, latlng) {
        return L.marker(latlng, { icon: customIcon });
      },
    }).addTo(map);

    let idleTimeout;

    const onIdle = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      flytoview(center.lat, center.lng, zoom);
    };

    map.on("movestart", () => {
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
    });

    map.on("moveend", () => {
      idleTimeout = setTimeout(onIdle, 1000);
    });
  }

  async waitForGoogleMaps() {
    if (typeof google === "undefined" || !google.maps) {
      setTimeout(() => this.waitForGoogleMaps(), 100);
      return;
    }
    await this.initializeGoogleMap();
  }

  async initializeGoogleMap() {
    const mapElement = this.shadowRoot.querySelector("gmp-map");

    await customElements.whenDefined("gmp-map");
    this.map = mapElement;
    await this.initializeDataLayer();
    await this.addFireMarkers();

    this.setupMapListeners();
  }

  async initializeDataLayer() {
    try {
      await this.map.innerMap;
      const internalMap = this.map.innerMap;

      if (!internalMap) return;

      const features = await getFeatures();

      internalMap.data.addGeoJson(features);

      internalMap.data.setStyle((feature) => {
        const geometryType = feature.getGeometry().getType();

        if (
          geometryType === "Polygon" ||
          geometryType === "GeometryCollection"
        ) {
          return {
            fillColor: "#ff6b00",
            fillOpacity: 0.25,
            strokeColor: "#ff0000",
            strokeWeight: 2,
            strokeOpacity: 0.8,
          };
        }

        return { visible: false };
      });
    } catch (error) {
      console.log("Could not load polygon data:", error);
    }
  }

  async addFireMarkers() {
    const features = await getFeatures();

    if (!features || !features.features) return;

    features.features.forEach((feature) => {
      if (feature.geometry.type === "Point") {
        const [lng, lat] = feature.geometry.coordinates;

        const marker = document.createElement("gmp-advanced-marker");
        marker.setAttribute("position", `${lat},${lng}`);
        marker.setAttribute(
          "title",
          feature.properties?.name || "Fire Location"
        );

        const pin = document.createElement("img");
        pin.src = "https://yashrajbharti.github.io/lg-web/assets/Fire.png";
        pin.style.width = "32px";
        pin.style.height = "32px";
        marker.appendChild(pin);

        this.map.appendChild(marker);
      }
    });
  }

  setupMapListeners() {
    this.map.addEventListener("gmp-center-changed", () => {
      this.handleMapChange();
    });

    this.map.addEventListener("gmp-zoom-changed", () => {
      this.handleMapChange();
    });

    this.map.addEventListener("gmp-drag", () => {
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
      }
    });

    this.map.addEventListener("gmp-dragend", () => {
      this.handleMapChange();
    });
  }

  handleMapChange() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    this.idleTimeout = setTimeout(() => {
      const center = this.map.center;
      const zoom = this.map.zoom;

      if (center && zoom) {
        flytoview(center.lat, center.lng, zoom);
      }
    }, 1000);
  }
}
