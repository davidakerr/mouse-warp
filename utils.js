const find_max_minus_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (monitor.y < miny) {
      miny = monitor.y;
    }
  });
  return miny * -1;
};
exports.find_max_minus_y = find_max_minus_y;

const find_max_x = (monitors) => {
  let maxx = 0;

  monitors.forEach((monitor) => {
    if (monitor.x / 10 + monitor.width / 10 > maxx) {
      maxx = monitor.x / 10 + monitor.width / 10;
    }
  });
  return maxx;
};
exports.find_max_x = find_max_x;
const find_max_y = (monitors) => {
  let miny = 0;
  monitors.forEach((monitor) => {
    if (
      (monitor.y + find_max_minus_y(monitors)) / 10 + monitor.height / 10 >
      miny
    ) {
      miny =
        (monitor.y + find_max_minus_y(monitors)) / 10 + monitor.height / 10;
    }
  });
  return miny;
};
exports.find_max_y = find_max_y;
