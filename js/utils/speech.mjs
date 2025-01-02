import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo } from "../api/cleanlogo.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { shutdown } from "../api/shutdown.mjs";
import { orbit } from "../api/orbit.mjs";

export const speech = (words) => {
  switch (true) {
    case words.includes("clean") && words.includes("logos"):
      cleanlogo();
      break;
    case words.includes("clean") && words.includes("KML"):
      cleankml();
      break;
    case words.includes("reboot"):
      reboot();
      break;
    case words.includes("relaunch"):
      relaunch();
      break;
    case words.includes("send") && words.includes("KML"):
      sendkml();
      break;
    case (words.includes("shut") && words.includes("down")) ||
      (words.includes("turn") && words.includes("off")):
      shutdown();
      break;
    case words.includes("orbit") || words.includes("spin"):
      orbit();
      break;
    default:
      console.log("No matching command found.");
  }
};
