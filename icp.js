// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, Menu, Tray } = require("electron");
const path = require("path");
const { setInterval } = require("timers");
const { MouseWarp } = require("./mouse-warp");
const { ipcMain } = require("electron"); // include the ipc module to communicate with render process ie to receive the message from render process
const { find_max_x, find_max_y } = require("./utils");

class IPC {
  setup(displays) {
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
  }
}

module.exports = IPC;
