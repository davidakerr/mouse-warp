// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, Menu, Tray } = require("electron");
const path = require("path");
const { setInterval } = require("timers");
const { MouseWarp } = require("./mouse-warp");
let tray = null;

let displays = [];

const { ipcMain } = require("electron"); // include the ipc module to communicate with render process ie to receive the message from render process

const find_max_minus_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (monitor.y < miny) {
      miny = monitor.y;
    }
  });
  return miny * -1;
};

const find_max_x = (monitors) => {
  let maxx = 0;

  monitors.forEach((monitor) => {
    if (monitor.x / 10 + monitor.width / 10 > maxx) {
      maxx = monitor.x / 10 + monitor.width / 10;
    }
  });
  return maxx;
};

const find_max_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (
      (monitor.y + find_max_minus_y(monitors)) / 10 + monitor.height / 10 >
      miny
    ) {
      miny =
        (monitor.y + find_max_minus_y(monitors)) / 10 + monitor.height / 10;
    }
  });
  return miny;
};

ipcMain.on("getDisplays", (event, data) => {
  const x = screen.getAllDisplays().map((display) => ({
    ...display.bounds,
    name: display.id,
    selected: displays.some((x) => x.name === display.id),
    index: displays.findIndex((y) => y.id === display.name),
  }));
  event.sender.send("showDisplays", x);
});

ipcMain.on("setDisplay", (event, data) => {
  console.log("setDisplay", data);
  if (displays.length === 2) {
    displays = [];
  } else {
    displays.push(data);
  }

  console.log(screen.getAllDisplays(), displays);
  event.sender.send(
    "setDisplayResponse",
    screen.getAllDisplays().map((display) => ({
      ...display.bounds,
      name: display.id,
      selected: displays.some((x) => x.name === display.id),
      index: displays.findIndex((y) => y.name === display.id),
    }))
  );
});

function createWindow() {
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

  app.on("before-quit", () => {
    mainWindow.removeAllListeners("close");
    mainWindow.close();
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  mainWindow.on("close", function (event) {
    // if (!application.isQuiting) {
    event.preventDefault();
    mainWindow.hide();
    // }

    return false;
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, "icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "View",
      click: async () => {
        console.error("nothing here yet");
        createWindow();
      },
    },
    {
      label: "Quit",
      click: async () => {
        const { app } = require("electron");
        await app.quit();
      },
    },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);

  const mouseWarp = new MouseWarp();
  setInterval(() => mouseWarp.loop(displays), 30);

  // console.log(screen.getAllDisplays());

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
