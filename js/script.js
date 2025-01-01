import { Home } from "./components/home.mjs";
import { InteractiveMap } from "./components/maps.mjs";
import { Settings } from "./components/settings.mjs";
import { LGtools } from "./components/tools.mjs";

customElements.define("interactive-map", InteractiveMap);
customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);
customElements.define("lg-settings", Settings);

const tabs = document.querySelector("md-tabs");

tabs.addEventListener("change", (event) => {
  if (event.target.activeTabIndex === 0) {
    document?.querySelector("home-page")?.setAttribute("active", "true");
  } else {
    document?.querySelector("home-page")?.setAttribute("active", "false");
  }
  if (event.target.activeTabIndex === 4) {
    document?.querySelector("lg-settings")?.setAttribute("active", "true");
  } else {
    document?.querySelector("lg-settings")?.setAttribute("active", "false");
  }
});
