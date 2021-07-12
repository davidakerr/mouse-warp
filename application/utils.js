const SCALER = 10;

const find_max_minus_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (monitor.y < miny) {
      miny = monitor.y;
    }
  });
  return miny * -1;
};

const find_max_x = (monitors) => {
  let maxx = 0;

  monitors.forEach((monitor) => {
    if (monitor.x / SCALER + monitor.width / SCALER > maxx) {
      maxx = monitor.x / SCALER + monitor.width / SCALER;
    }
  });
  return maxx;
};

const find_max_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (
      (monitor.y + find_max_minus_y(monitors)) / SCALER +
        monitor.height / SCALER >
      miny
    ) {
      miny =
        (monitor.y + find_max_minus_y(monitors)) / SCALER +
        monitor.height / SCALER;
    }
  });
  return miny;
};
module.exports = { SCALER, find_max_minus_y, find_max_x, find_max_y };
