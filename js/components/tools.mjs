import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo } from "../api/cleanlogo.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { shutdown } from "../api/shutdown.mjs";

export class LGtools extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.classList.add("container");

    container.innerHTML = `
      <div class="button-wrapper">
          <md-filled-tonal-button data-action="clean-logo"> Clean Logo </md-filled-tonal-button>
          <md-filled-tonal-button data-action="clean-kml"> Clean KML </md-filled-tonal-button>
          <md-filled-tonal-button data-action="relaunch-lg"> Relaunch LG </md-filled-tonal-button>
          <md-filled-tonal-button data-action="reboot-lg"> Reboot LG </md-filled-tonal-button>
          <md-filled-tonal-button data-action="shutdown-lg"> Shutdown LG </md-filled-tonal-button>
      </div>
      <md-dialog>
          <form slot="content" id="form-id" method="dialog">Are you sure you want to perform this action?</form>
          <div slot="actions">
              <md-text-button form="form-id" value="cancel">Cancel</md-text-button>
              <md-filled-button form="form-id" value="yes">Proceed</md-filled-button>
          </div>
      </md-dialog>
      `;

    const style = document.createElement("style");
    style.textContent = `
          .container {
              block-size: 100dvh;
              margin: auto;
              display: grid;
              align-items: center;
          }
          .button-wrapper {
              block-size: max-content;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
              gap: 15px;
              justify-content: center;
              align-items: center;
              padding: 30px;
          }
          md-filled-tonal-button {
              padding: 40px;
              font-size: 20px;
          }
          md-filled-tonal-button:nth-of-type(1) {
              filter: hue-rotate(80deg)
          }
          md-filled-tonal-button:nth-of-type(2) {
              filter: hue-rotate(-40deg)
          }
          md-filled-tonal-button:nth-of-type(3) {
              filter: hue-rotate(-60deg)
          }
          md-filled-tonal-button:nth-of-type(4) {
              filter: hue-rotate(195deg)
          }
          md-filled-tonal-button:nth-of-type(5) {
              filter: hue-rotate(135deg)
          }
        `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  connectedCallback() {
    const buttons = this.shadowRoot.querySelectorAll("md-filled-tonal-button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        this.handleAction(action);
      });
    });
  }

  handleAction(action) {
    switch (action) {
      case "clean-logo":
        cleanlogo();
        break;
      case "clean-kml":
        cleankml();
        break;
      case "relaunch-lg":
        this.activateDialog(
          "Are you sure you want to relaunch the liquid galaxy?",
          relaunch
        );
        break;
      case "reboot-lg":
        this.activateDialog(
          "Are you sure you want to reboot the liquid galaxy?",
          reboot
        );
        break;
      case "shutdown-lg":
        this.activateDialog(
          "Are you sure you want to shut down the liquid galaxy?",
          shutdown
        );
        break;
      default:
        console.log("Unknown action.");
    }
  }
  activateDialog(content, action) {
    const dialog = this.shadowRoot.querySelector("md-dialog");
    dialog.querySelector("form").textContent = content;
    dialog.open = true;
    const button = dialog.querySelector("md-filled-button");
    button.onclick = action();
  }
}
