import { checkConnection } from "../api/checkconnection.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { showballoon } from "../api/balloon.mjs";
import { flytoview } from "../api/flytoview.mjs";

export class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            p {
                color: var(--md-sys-color-primary);
            }
            .animate .google {
                animation: reveal 1.2s ease 1 forwards;
                transform-origin: 52px 28px;
            }

            @keyframes reveal {
                to{
                    rotate: 0deg
                }
            }

            .animate .google:nth-last-of-type(1) {
                rotate: -215deg;
            }
            .animate .google:nth-last-of-type(2) {
                rotate: -155deg;
            }
            .animate .google:nth-last-of-type(3) {
                animation-delay: 60ms;
                rotate: -55deg;
            }

            .animate .line {
                animation: scale 1.2s ease 1 forwards;
            }
            .animate .line:nth-of-type(1) {
                scale: 1 0;
                transform-origin: 0px 40px;
            }
            .animate .line:nth-of-type(2) { 
                scale: 0 1;
                transform-origin: 11px -11px;
            }

            @keyframes scale {
                to {
                    scale: 1;
                }
            }
            div {
                display: flex;
                block-size: 100dvh;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 25px;
            }
            md-elevated-button {
                inline-size: 200px;
                padding: 10px 20px;
            }
            md-icon.disconnect {
                filter: hue-rotate(110deg);
            }
        </style>
        <div>
            <svg class="animate" width="280" height="280" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>Liquid Galaxy Web App</title>
                <path class="google" d="M66.08 28.3333C66.08 27.2933 65.9867 26.2933 65.8133 25.3333H52V31.0133H59.8933C59.5467 32.84 58.5067 34.3867 56.9467 35.4267V39.12H61.7067C64.48 36.56 66.08 32.8 66.08 28.3333Z" fill="#4285F4"/>
                <path class="google" d="M52 42.6667C55.96 42.6667 59.28 41.36 61.7067 39.12L56.9467 35.4267C55.64 36.3067 53.9733 36.84 52 36.84C48.1867 36.84 44.9467 34.2667 43.7867 30.8H38.9067V34.5867C41.32 39.3733 46.2667 42.6667 52 42.6667Z" fill="#34A853"/>
                <path class="google" d="M43.7867 30.7867C43.4933 29.9067 43.32 28.9733 43.32 28C43.32 27.0267 43.4933 26.0933 43.7867 25.2133V21.4267H38.9067C37.9067 23.4 37.3333 25.6267 37.3333 28C37.3333 30.3733 37.9067 32.6 38.9067 34.5733L42.7067 31.6133L43.7867 30.7867Z" fill="#FBBC05"/>
                <path class="google" d="M52 19.1733C54.16 19.1733 56.08 19.92 57.6133 21.36L61.8133 17.16C59.2667 14.7867 55.96 13.3333 52 13.3333C46.2667 13.3333 41.32 16.6267 38.9067 21.4267L43.7867 25.2133C44.9467 21.7467 48.1867 19.1733 52 19.1733Z" fill="#EA4335"/>
                <rect class="line" x="11" y="13" width="6.2" height="29.1" fill="#EA4335"/>
                <rect class="line" width="5.1" height="18.7" transform="matrix(0 -1 -1 0 29.7 42.1)" fill="#FBBC05"/>
                <rect x="11" y="37" width="6.2" height="5.1" fill="#4285F4"/>
                <path d="M22.4922 51.16L19.9642 59H18.4602L16.5082 52.984L14.5722 59H13.0842L10.5562 51.16H12.0922L13.8362 57.08H13.8522L15.7882 51.16H17.3082L19.2442 57.08H19.2602L20.9882 51.16H22.4922ZM26.8144 59.256C25.6624 59.256 24.7131 58.8613 23.9664 58.072C23.2198 57.2827 22.8464 56.2853 22.8464 55.08C22.8464 53.8853 23.2091 52.8933 23.9344 52.104C24.6598 51.304 25.5878 50.904 26.7184 50.904C27.8811 50.904 28.8038 51.2827 29.4864 52.04C30.1798 52.7867 30.5264 53.8373 30.5264 55.192L30.5104 55.352H24.3504C24.3718 56.12 24.6278 56.7387 25.1184 57.208C25.6091 57.6773 26.1958 57.912 26.8784 57.912C27.8171 57.912 28.5531 57.4427 29.0864 56.504L30.3984 57.144C30.0464 57.8053 29.5558 58.3227 28.9264 58.696C28.3078 59.0693 27.6038 59.256 26.8144 59.256ZM24.4624 54.136H28.9584C28.9158 53.592 28.6918 53.144 28.2864 52.792C27.8918 52.4293 27.3584 52.248 26.6864 52.248C26.1318 52.248 25.6518 52.4187 25.2464 52.76C24.8518 53.1013 24.5904 53.56 24.4624 54.136ZM36.0166 59.256C35.4406 59.256 34.9126 59.1333 34.4326 58.888C33.9632 58.6427 33.6006 58.3173 33.3446 57.912H33.2806V59H31.8726V47.544H33.3446V51.16L33.2806 52.248H33.3446C33.6006 51.8427 33.9632 51.5173 34.4326 51.272C34.9126 51.0267 35.4406 50.904 36.0166 50.904C37.0512 50.904 37.9259 51.3093 38.6406 52.12C39.3766 52.9413 39.7446 53.928 39.7446 55.08C39.7446 56.2427 39.3766 57.2293 38.6406 58.04C37.9259 58.8507 37.0512 59.256 36.0166 59.256ZM35.7766 57.912C36.4806 57.912 37.0726 57.6453 37.5526 57.112C38.0326 56.5893 38.2726 55.912 38.2726 55.08C38.2726 54.2587 38.0326 53.5813 37.5526 53.048C37.0726 52.5147 36.4806 52.248 35.7766 52.248C35.0619 52.248 34.4646 52.5147 33.9846 53.048C33.5152 53.5813 33.2806 54.2587 33.2806 55.08C33.2806 55.912 33.5152 56.5947 33.9846 57.128C34.4646 57.6507 35.0619 57.912 35.7766 57.912ZM42.1633 56.6C42.1633 56.984 42.3233 57.304 42.6433 57.56C42.974 57.816 43.358 57.944 43.7953 57.944C44.414 57.944 44.9633 57.7147 45.4433 57.256C45.934 56.7973 46.1793 56.2587 46.1793 55.64C45.7206 55.2773 45.0806 55.096 44.2593 55.096C43.662 55.096 43.1606 55.24 42.7553 55.528C42.3606 55.816 42.1633 56.1733 42.1633 56.6ZM44.0673 50.904C45.1553 50.904 46.014 51.1973 46.6433 51.784C47.2726 52.36 47.5873 53.1547 47.5873 54.168V59H46.1793V57.912H46.1153C45.5073 58.808 44.6966 59.256 43.6833 59.256C42.8193 59.256 42.094 59 41.5073 58.488C40.9313 57.976 40.6433 57.336 40.6433 56.568C40.6433 55.7573 40.9473 55.112 41.5553 54.632C42.174 54.152 42.9953 53.912 44.0193 53.912C44.894 53.912 45.614 54.072 46.1793 54.392V54.056C46.1793 53.544 45.9766 53.112 45.5713 52.76C45.166 52.3973 44.6913 52.216 44.1473 52.216C43.326 52.216 42.6753 52.5627 42.1953 53.256L40.8993 52.44C41.614 51.416 42.67 50.904 44.0673 50.904ZM53.0876 57.912C53.7916 57.912 54.3836 57.6453 54.8636 57.112C55.3436 56.5893 55.5836 55.912 55.5836 55.08C55.5836 54.2587 55.3436 53.5813 54.8636 53.048C54.3836 52.5147 53.7916 52.248 53.0876 52.248C52.3729 52.248 51.7756 52.5147 51.2956 53.048C50.8262 53.5813 50.5916 54.2587 50.5916 55.08C50.5916 55.912 50.8262 56.5947 51.2956 57.128C51.7756 57.6507 52.3729 57.912 53.0876 57.912ZM53.3276 59.256C52.7516 59.256 52.2236 59.1333 51.7436 58.888C51.2742 58.6427 50.9116 58.3173 50.6556 57.912H50.5916L50.6556 59V62.456H49.1836V51.16H50.5916V52.248H50.6556C50.9116 51.8427 51.2742 51.5173 51.7436 51.272C52.2236 51.0267 52.7516 50.904 53.3276 50.904C54.3622 50.904 55.2369 51.3093 55.9516 52.12C56.6876 52.9413 57.0556 53.928 57.0556 55.08C57.0556 56.2427 56.6876 57.2293 55.9516 58.04C55.2369 58.8507 54.3622 59.256 53.3276 59.256ZM62.0876 57.912C62.7916 57.912 63.3836 57.6453 63.8636 57.112C64.3436 56.5893 64.5836 55.912 64.5836 55.08C64.5836 54.2587 64.3436 53.5813 63.8636 53.048C63.3836 52.5147 62.7916 52.248 62.0876 52.248C61.3729 52.248 60.7756 52.5147 60.2956 53.048C59.8262 53.5813 59.5916 54.2587 59.5916 55.08C59.5916 55.912 59.8262 56.5947 60.2956 57.128C60.7756 57.6507 61.3729 57.912 62.0876 57.912ZM62.3276 59.256C61.7516 59.256 61.2236 59.1333 60.7436 58.888C60.2742 58.6427 59.9116 58.3173 59.6556 57.912H59.5916L59.6556 59V62.456H58.1836V51.16H59.5916V52.248H59.6556C59.9116 51.8427 60.2742 51.5173 60.7436 51.272C61.2236 51.0267 61.7516 50.904 62.3276 50.904C63.3622 50.904 64.2369 51.3093 64.9516 52.12C65.6876 52.9413 66.0556 53.928 66.0556 55.08C66.0556 56.2427 65.6876 57.2293 64.9516 58.04C64.2369 58.8507 63.3622 59.256 62.3276 59.256Z" fill="#A1A3A5"/>
            </svg>
            <p>Status: <md-assist-chip label="Not Connected"><md-icon class="disconnect" slot="icon">close</md-icon></md-assist-chip></p>
            <md-elevated-button>Send KML</md-elevated-button>
        </div>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const animateAttribute = this.getAttribute("animate");

    if (animateAttribute === "true") {
      this.shadowRoot.querySelector("svg").classList.add("animate");
    }
    this.checkConnectionStatus();
  }
  static get observedAttributes() {
    return ["active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active") {
      if (newValue === "true") {
        this.shadowRoot.querySelector("svg").classList.add("animate");
        this.checkConnectionStatus();
      } else {
        this.shadowRoot.querySelector("svg").classList.remove("animate");
      }
    }
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector("md-elevated-button");
    button.addEventListener("click", async () => {
      await flytoview(28.644936136911202, -17.854219976579774, 12);
      await sendkml();
      await showballoon();
    });
  }

  async checkConnectionStatus() {
    const chip = this.shadowRoot.querySelector("md-assist-chip");
    const icon = chip.querySelector("md-icon");
    if (await checkConnection()) {
      chip.setAttribute("label", "Connected");
      icon.classList.remove("disconnect");
      icon.textContent = "check";
    } else {
      chip.setAttribute("label", "Not Connected");
      icon.classList.add("disconnect");
      icon.textContent = "close";
    }
  }
}
