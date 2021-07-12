// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const ipcRenderer = require("electron").ipcRenderer;
const { find_max_x, find_max_y, find_max_minus_y } = require("./utils");

const setMonitorColor = (selected, element, name) => {
  element.innerText = selected ? name + 1 : "Not Selected";
  if (selected) {
    element.style.backgroundColor = "#fff";
    element.style.color = "#303030";
  } else {
    element.style.backgroundColor = "#303030";
    element.style.color = "white";
  }
};

function showMonitor(response) {
  return (monitor, index) => {
    console.log("monitor", monitor);
    const newDiv = document.createElement("div");
    newDiv.id = monitor.name;
    newDiv.className = "mon";
    newDiv.style.top = (monitor.y + find_max_minus_y(response)) / 10 + "px";
    newDiv.style.left = monitor.x / 10 + "px";
    newDiv.innerText = index > -1 ? index + 1 : "Not Selected";
    newDiv.style.border = "1px solid black";

    newDiv.style.width = monitor.width / 10 + "px";
    newDiv.style.height = monitor.height / 10 + "px";
    // newDiv.style.backgroundColor = colors[index];
    setMonitorColor(monitor.selected, newDiv, index);

    newDiv.onclick = async () => {
      ipcRenderer.send("setDisplay", monitor);
    };

    console.log("new div", newDiv);

    const currentDiv = document.getElementById("container");
    currentDiv.appendChild(newDiv);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("setDisplayResponse", (event, response) => {
    response.forEach((monitor) => {
      setMonitorColor(
        monitor.selected,
        document.getElementById(monitor.name),
        monitor.index
      );
    });
  });

  ipcRenderer.once("showDisplays", (event, monitors) => {
    let colors = ["red", "blue", "green"];

    monitors.forEach(showMonitor(monitors));
    console.log("showDisplays Response", monitors);
  });
  ipcRenderer.send("getDisplays");
});
