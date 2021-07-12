const { find_max_minus_y, SCALER } = require("../application/utils");
const { setMonitorColor } = require("./setMonitorColor");
const ipcRenderer = require("electron").ipcRenderer;

function renderMonitor(response) {
  return (monitor, index) => {
    const newDiv = document.createElement("div");
    newDiv.id = monitor.name;
    newDiv.className = "mon";
    newDiv.style.top = (monitor.y + find_max_minus_y(response)) / SCALER + "px";
    newDiv.style.left = monitor.x / SCALER + "px";
    newDiv.innerText = index > -1 ? index + 1 : "Not Selected";
    newDiv.style.border = "1px solid black";
    newDiv.style.width = monitor.width / SCALER + "px";
    newDiv.style.height = monitor.height / SCALER + "px";

    setMonitorColor(monitor.selected, newDiv, index);

    newDiv.onclick = async () => {
      ipcRenderer.send("addDisplayAppListener", monitor);
    };

    const currentDiv = document.getElementById("container");
    currentDiv.appendChild(newDiv);
  };
}

exports.renderMonitor = renderMonitor;
