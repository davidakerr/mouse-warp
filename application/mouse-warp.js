// Modules to control application life and create native browser window
const { screen } = require("electron");
const { isEqual } = require("lodash");

var robot = require("robotjs");

const translate = (value, left_min, left_max, right_min, right_max) => {
  return (
    ((value - left_min) * (right_max - right_min)) / (left_max - left_min) +
    right_min
  );
};

const getPoint = (display, compass_dir) => {
  switch (compass_dir) {
    case "ne":
      return { x: display.width + display.x, y: display.y };
    case "se":
      return { x: display.width + display.x, y: display.height + display.y };
    case "nw":
      return { x: display.x, y: display.y };
    case "sw":
      return { x: display.x, y: display.height + display.y };
    default:
      return { x: 0, y: 0 };
  }
};

class MouseWarp {
  constructor(warpDistance = 100) {
    this.warpDistance = warpDistance;
    this.lastPosition = { x: 0, y: 0 };
  }

  isMoving(position) {
    if (isEqual(position, this.lastPosition)) return false;
    this.lastPosition = position;
    return true;
  }

  loop(displays) {
    if (displays.length == 2) {
      const currentMousePosition = screen.getCursorScreenPoint();
      if (!this.isMoving(currentMousePosition)) {
        return;
      }
      if (
        currentMousePosition.x == getPoint(displays[0], "ne").x - 1 &&
        currentMousePosition.y < getPoint(displays[0], "se").y
      ) {
        robot.moveMouse(
          getPoint(displays[1], "nw").x + this.warpDistance,
          translate(
            currentMousePosition.y,
            getPoint(displays[0], "ne").y,
            getPoint(displays[0], "se").y,
            getPoint(displays[1], "nw").y,
            getPoint(displays[1], "sw").y
          )
        );
      } else if (
        currentMousePosition.x == getPoint(displays[1], "nw").x &&
        currentMousePosition.y < getPoint(displays[0], "se").y
      ) {
        robot.moveMouse(
          getPoint(displays[0], "ne").x - this.warpDistance,
          translate(
            currentMousePosition.y,
            getPoint(displays[1], "nw").y,
            getPoint(displays[1], "sw").y,
            getPoint(displays[0], "ne").y,
            getPoint(displays[0], "se").y
          )
        );
      }
    }
  }
}

module.exports = { MouseWarp };
