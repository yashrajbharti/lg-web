import { checkConnection } from "../api/checkconnection.mjs";
import { connecttolg } from "../api/connect.mjs";
import QrScanner from "../utils/qrscanner.js";

export class Settings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.classList.add("container");

    container.innerHTML = `
        <p>Status: <md-assist-chip label="Not Connected"><md-icon class="disconnect" slot="icon">close</md-icon></md-assist-chip></p>
        <md-filled-tonal-button id="scan-qr"><md-icon slot="icon">qr_code_scanner</md-icon>Scan QR to Connect</md-filled-tonal-button>
        <p class="divider"><span>OR<span><p>
        <form>
            <md-outlined-text-field id="username" label="Username" value=""></md-outlined-text-field>
            <md-outlined-text-field id="ip" label="IP Address" value=""></md-outlined-text-field>
            <md-outlined-text-field id="port" label="Port Number" value=""></md-outlined-text-field>
            <md-outlined-text-field id="password" label="Password" value=""></md-outlined-text-field>
            <md-outlined-text-field id="rigs" label="Number of Rigs" value=""></md-outlined-text-field>
            <md-filled-button type="button">Connect to LG</md-filled-button>
        </form>
        <video hidden></video>
        <div class="icon-button">
            <md-filled-tonal-icon-button>
                <md-icon>arrow_back</md-icon>
            </md-filled-tonal-icon-button>
        </div>
        `;

    const style = document.createElement("style");
    style.textContent = `
            p {
                color: var(--md-sys-color-primary);
            }
            md-icon.disconnect {
                filter: hue-rotate(110deg);
            }
            .container {
                padding: 20px;
                margin-block-start: 15px;
            }
            form {
                margin-block-start: 25px;
                margin-block-end: 55px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .divider {
                position: relative;
                text-align: center;
            }
            .divider::after {
                position: absolute;
                content: "";
                inline-size: 100%;
                block-size: 1px;
                background-color: var(--md-sys-color-outline);
                inset-inline-start: 0;
                inset-block-start: 1ch;
                 z-index: -1;
            }
            .divider span {
                display: inline-block;
                background-color: var(--md-sys-color-background);
                padding-inline-start: 5px;
            }
            md-filled-tonal-button {
                inline-size: 100%;
                margin-block: 10px;
            }
            .icon-button {
                position: fixed;
                display: none;
                inset-inline-start: 20px;
                inset-block-start: 20px;
                z-index: 2;
            }
            video {
                inline-size: 100%;
                block-size: 100dvh;
                opacity: 1;
                transform: scaleX(1);
                position: fixed;
                inset-block-start: 0;
                inset-inline-start: 0;
                z-index: 1;
                background-color: var(--md-sys-color-background);
            }
            .scan-region-highlight, .code-outline-highlight {
                z-index: 2;
            }
          `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    this.loadConfig();

    this.shadowRoot
      .querySelector("md-filled-button")
      .addEventListener("click", () => this.saveConfig());

    this.shadowRoot
      .getElementById("scan-qr")
      .addEventListener("click", () => this.startQrScanner());
  }

  static get observedAttributes() {
    return ["active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active") {
      if (newValue === "true") {
        this.checkConnectionStatus();
      } else {
        this.shadowRoot.querySelector("md-filled-tonal-icon-button").click();
      }
    }
  }

  checkConnectionStatus() {
    const chip = this.shadowRoot.querySelector("md-assist-chip");
    const icon = chip.querySelector("md-icon");
    if (checkConnection()) {
      chip.setAttribute("label", "Connected");
      icon.classList.remove("disconnect");
      icon.textContent = "check";
    } else {
      chip.setAttribute("label", "Not Connected");
      icon.classList.add("disconnect");
      icon.textContent = "close";
    }
  }

  saveConfig() {
    const username = this.shadowRoot.getElementById("username").value;
    const ip = this.shadowRoot.getElementById("ip").value;
    const port = this.shadowRoot.getElementById("port").value;
    const password = this.shadowRoot.getElementById("password").value;
    const rigs = this.shadowRoot.getElementById("rigs").value;

    const config = {
      username,
      ip,
      port,
      password,
      rigs,
    };

    localStorage.setItem("lgconfigs", JSON.stringify(config));
    connecttolg(config);
    this.checkConnectionStatus();
  }

  loadConfig() {
    const savedConfig = localStorage.getItem("lgconfigs");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);

      this.shadowRoot.getElementById("username").value = config.username || "";
      this.shadowRoot.getElementById("ip").value = config.ip || "";
      this.shadowRoot.getElementById("port").value = config.port || "";
      this.shadowRoot.getElementById("password").value = config.password || "";
      this.shadowRoot.getElementById("rigs").value = config.rigs || "";
    }
  }

  startQrScanner() {
    const qrVideo = this.shadowRoot.querySelector("video");
    const backArrowContainer = this.shadowRoot.querySelector(".icon-button");
    const backButton = this.shadowRoot.querySelector(
      "md-filled-tonal-icon-button"
    );
    qrVideo?.removeAttribute("hidden");

    const scanner = new QrScanner(
      qrVideo,
      (result) => {
        // { "username": "lg", "ip": "192.168.29.124", "port": "2222", "password": "lg", "rigs": "5" }
        scanner.stop();
        qrVideo?.setAttribute("hidden", "");
        backArrowContainer.style.display = "none";
        console.log(result.data);
        const config = JSON.parse(result.data.trim());
        if (config.username) {
          localStorage.setItem("lgconfigs", JSON.stringify(config));
          this.loadConfig();
          connecttolg(config);
          this.checkConnectionStatus();
        }
      },
      {
        onDecodeError: (error) => console.error("QR scanning error:", error),
      }
    );
    backButton.addEventListener("click", () => {
      scanner.stop();
      qrVideo?.setAttribute("hidden", "");
      backArrowContainer.style.display = "none";
    });
    scanner
      .start()
      .then(() => {
        backArrowContainer.style.display = "block";
      })
      .catch((err) => {
        console.error("Failed to start QR scanner:", err);
      });
  }
}
