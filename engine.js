const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { setInterval } = require("timers");
const { MouseWarp } = require("./mouse-warp");
const { find_max_x, find_max_y } = require("./utils");
const IPC = require("./icp");
const TrayIcon = require("./tray");

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
  }

  createWindow() {
    // Create the browser window.
    const all = screen.getAllDisplays().map((display) => ({
      ...display.bounds,
    }));

    const mainWindow = new BrowserWindow({
      width: Math.floor(find_max_x(all)) + 50,
      height: find_max_y(all) + 50,
      // frame: false,
      roundedCorners: true,
      resizable: false,
      icon: path.join(__dirname, "icon.png"),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
      },
    });

    mainWindow.loadFile("index.html");

    // Worried about this one.
    app.on("before-quit", () => {
      mainWindow.removeAllListeners("close");
      mainWindow.close();
    });

    mainWindow.on("close", function (event) {
      // if (!application.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      // }

      return false;
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
  }

  setup() {
    this.ipc.setup(this.displays);
    this.trayIcon.setup(
      () => this.createWindow(),
      () => this.reset()
    );
  }
}

module.exports = Engine;
