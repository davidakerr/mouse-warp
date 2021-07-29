// Modules to control application life and create native browser window

const { app } = require("electron");
const Engine = require("./application/engine");
const engine = new Engine();

app.on("ready", () => {
  const isMainInstance = app.requestSingleInstanceLock();

  if (!isMainInstance) {
    console.log("Already running");
    app.quit();
  }
  engine.setup();
});

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
