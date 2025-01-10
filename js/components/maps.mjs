import { flytoview } from "../api/flytoview.mjs";

export class InteractiveMap extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initMap();
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
        #map {
          inline-size: 100%;
          block-size: 100dvh;
        }
        .leaflet-control-attribution.leaflet-control {
          display: none;
        }
      `;

    const mapDiv = document.createElement("div");
    mapDiv.id = "map";

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(mapDiv);
  }

  initMap() {
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    this.shadowRoot.appendChild(leafletCSS);

    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletJS.onload = () => this.initializeLeafletMap();
    this.shadowRoot.appendChild(leafletJS);
  }

  initializeLeafletMap() {
    const mapContainer = this.shadowRoot.getElementById("map");

    const map = L.map(mapContainer, {
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
    }).setView([28.644936136911202, -17.854219976579774], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
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
}
