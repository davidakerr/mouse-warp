const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { find_max_x, find_max_y } = require("./utils");

// TODO:  Will split this up UI / Warp Logic
const createWindow = () => {
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
    icon: path.join(__dirname, "../icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "../chrome/preload.js"),
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
};

module.exports = createWindow;
