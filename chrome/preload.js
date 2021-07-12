// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const ipcRenderer = require("electron").ipcRenderer;
const { renderMonitor } = require("./renderMonitor");
const { setMonitorColor } = require("./setMonitorColor");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("setDisplayChromeListener", (event, response) => {
    response.forEach((monitor) => {
      setMonitorColor(
        monitor.selected,
        document.getElementById(monitor.name),
        monitor.index
      );
    });
  });

  ipcRenderer.once("bootstrapDisplaysChromeListener", (event, monitors) => {
    let colors = ["red", "blue", "green"];
    console.log("bootstrapDisplaysChromeListener Response", monitors);

    monitors.forEach(renderMonitor(monitors));
  });

  ipcRenderer.send("getAllDisplaysAppListener");
});
