import { Home } from "./components/home.mjs";
import { InteractiveMap } from "./components/maps.mjs";
import { LGtools } from "./components/tools.mjs";

customElements.define("interactive-map", InteractiveMap);
customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);

const tabs = document.querySelector("md-tabs");

tabs.addEventListener("change", (event) => {
  if (event.target.activeTabIndex === 0) {
    document.querySelector("home-page").setAttribute("active", "true");
  } else {
    document.querySelector("home-page").setAttribute("active", "false");
  }
});
