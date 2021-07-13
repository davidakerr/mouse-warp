// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const ipcRenderer = require("electron").ipcRenderer;
const { renderMonitor } = require("./renderMonitor");
const { setMonitorColor } = require("./setMonitorColor");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.once("bootstrapDisplaysChromeListener", (event, monitors) => {
    console.log("bootstrapDisplaysChromeListener Response", monitors);
    monitors.forEach(renderMonitor(monitors));
  });

  ipcRenderer.on("setDisplayChromeListener", (event, monitors) => {
    monitors.forEach((monitor) => {
      setMonitorColor(
        monitor.selected,
        document.getElementById(monitor.name),
        monitor.index
      );
    });
  });

  ipcRenderer.send("getAllDisplaysAppListener");
});
