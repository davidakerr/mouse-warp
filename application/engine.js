const { setInterval } = require("timers");
const { MouseWarp } = require("./mouse-warp");
const IPC = require("./icp");
const TrayIcon = require("./tray");
const createWindow = require("./createWindow");
const { screen } = require("electron");
const fs = require("fs");
const path = require("path");

const configFile = path.join(__dirname, "config.json");

class Engine {
  constructor() {
    this.displays = [];
    this.trayIcon = new TrayIcon();
    this.ipc = new IPC();
    this.mouseWarp = new MouseWarp();
    this.mouseWarpLoop = null;
    this.addDisplay = this.addDisplay.bind(this);
    this.allDisplayInformation = this.allDisplayInformation.bind(this);
  }

  loadConfiguration() {
    try {
      const data = fs.readFileSync(configFile, "utf8");
      this.displays = JSON.parse(data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  saveConfiguration() {
    try {
      fs.writeFileSync(configFile, JSON.stringify(this.displays));
    } catch (err) {
      console.error(err);
    }
  }

  allDisplayInformation() {
    return screen.getAllDisplays().map((display, index) => ({
      ...display.bounds,
      name: display.id,
      selected: this.displays.some((x) => x.name === display.id),
      index,
    }));
  }

  addDisplay(display) {
    clearInterval(this.mouseWarpLoop);
    if (this.displays.length === 2) {
      this.displays = [];
    } else {
      this.displays.push(display);
      this.saveConfiguration();

      this.mouseWarpLoop = setInterval(
        () => this.mouseWarp.loop(this.displays),
        10
      );
    }
  }

  setup() {
    this.ipc.setupDisplayListeners(this.addDisplay, this.allDisplayInformation);
    this.trayIcon.setup(createWindow);
    if (this.loadConfiguration()) {
      this.mouseWarpLoop = setInterval(
        () => this.mouseWarp.loop(this.displays),
        10
      );
    }
  }
}

module.exports = Engine;
