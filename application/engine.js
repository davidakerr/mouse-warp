const { setInterval } = require("timers");
const { MouseWarp } = require("./mouse-warp");
const IPC = require("./icp");
const TrayIcon = require("./tray");
const createWindow = require("./createWindow");
const { screen } = require("electron");

// const { getAllDisplayInformation } = require("./getAllDisplayInformation");

class Engine {
  constructor() {
    this.displays = [];
    this.trayIcon = new TrayIcon();
    this.ipc = new IPC();
    this.mouseWarp = new MouseWarp();
    this.mouseWarpLoop = setInterval(
      () => this.mouseWarp.loop(this.displays),
      10
    );
    this.addDisplay = this.addDisplay.bind(this);
    this.allDisplayInformation = this.allDisplayInformation.bind(this);
  }

  allDisplayInformation() {
    return screen.getAllDisplays().map((display) => ({
      ...display.bounds,
      name: display.id,
      selected: this.displays.some((x) => x.name === display.id),
      index: this.displays.findIndex((y) => y.name === display.id),
    }));
  }

  addDisplay(display) {
    if (this.displays.length === 2) {
      this.displays = [];
    } else {
      this.displays.push(display);
    }
  }

  setup() {
    this.ipc.setupDisplayListeners(
      this.displays,
      this.addDisplay,
      this.allDisplayInformation
    );
    this.trayIcon.setup(createWindow);
  }
}

module.exports = Engine;
