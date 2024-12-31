import { Home } from "./components/home.mjs";
import { InteractiveMap } from "./components/maps.mjs";
import { LGtools } from "./components/tools.mjs";

customElements.define("interactive-map", InteractiveMap);
customElements.define("lg-tools", LGtools);
customElements.define("home-page", Home);
