const setMonitorColor = (selected, element, name) => {
  element.innerText = name + 1;
  if (selected) {
    element.style.backgroundColor = "#fff";
    element.style.color = "#303030";
  } else {
    element.style.backgroundColor = "#303030";
    element.style.color = "white";
  }
};

exports.setMonitorColor = setMonitorColor;
