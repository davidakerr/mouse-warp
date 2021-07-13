const { ipcMain } = require("electron");

class IPC {
  setupDisplayListeners(addDisplay, allDisplayInformation) {
    ipcMain.on("getAllDisplaysAppListener", (event, data) => {
      event.sender.send(
        "bootstrapDisplaysChromeListener",
        allDisplayInformation()
      );
    });

    ipcMain.on("addDisplayAppListener", (event, display) => {
      console.log("addDisplayAppListener", display);
      addDisplay(display);
      event.sender.send("setDisplayChromeListener", allDisplayInformation());
    });
  }
}

module.exports = IPC;
