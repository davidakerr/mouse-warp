const { ipcMain } = require("electron"); // include the ipc module to communicate with render process ie to receive the message from render process

class IPC {
  // pass in display info too not displays
  setupDisplayListeners(displays, addDisplay, allDisplayInformation) {
    ipcMain.on("getAllDisplaysAppListener", (event, data) => {
      event.sender.send(
        "bootstrapDisplaysChromeListener",
        allDisplayInformation(displays)
      );
    });

    ipcMain.on("addDisplayAppListener", (event, display) => {
      console.log("addDisplayAppListener", display);
      addDisplay(display);
      event.sender.send(
        "setDisplayChromeListener",
        allDisplayInformation(displays)
      );
    });
  }
}

module.exports = IPC;
