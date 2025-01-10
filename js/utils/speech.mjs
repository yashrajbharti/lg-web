import { cleankml } from "../api/cleankml.mjs";
import { cleanlogo, showlogo } from "../api/logo.mjs";
import { cleanballoon, showballoon } from "../api/balloon.mjs";
import { reboot } from "../api/reboot.mjs";
import { relaunch } from "../api/relaunch.mjs";
import { sendkml } from "../api/sendkml.mjs";
import { shutdown } from "../api/shutdown.mjs";
import { startOrbit, stopOrbit } from "../api/orbit.mjs";

export const speech = (words) => {
  switch (true) {
    case words.includes("clean") && words.includes("logos"):
      cleanlogo();
      break;
    case words.includes("clean") && words.includes("balloon"):
      cleanballoon();
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
    case words.includes("send") && words.includes("balloon"):
      showballoon();
      break;
    case words.includes("send") && words.includes("logo"):
      showlogo();
      break;
    case (words.includes("shut") && words.includes("down")) ||
      (words.includes("turn") && words.includes("off")):
      shutdown();
      break;
    case (words.includes("stop") && words.includes("orbit")) ||
      (words.includes("stop") && words.includes("spin")):
      stopOrbit();
      break;
    case words.includes("orbit") || words.includes("spin"):
      startOrbit();
      break;
    default:
      console.log("No matching command found.");
  }
};
