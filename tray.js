const { app } = require("electron");
const { Tray, Menu } = require("electron");
const path = require("path");

class TrayIcon {
  constructor() {
    this.tray = null;
  }
  setup(createWindow) {
    this.tray = new Tray(path.join(__dirname, "icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "View",
        click: async () => {
          console.error("View - create window");
          await createWindow();
        },
      },
      {
        label: "Quit",
        click: async () => {
          await app.quit();
        },
      },
    ]);
    this.tray.setToolTip("Mouse Warp");
    this.tray.setContextMenu(contextMenu);
  }
}

module.exports = TrayIcon;
