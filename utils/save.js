const fs = require("fs");

function loadData(file, defaultData = {}) {
  if (fs.existsSync(file)) {
    return JSON.parse(
      fs.readFileSync(file, "utf8")
    );
  }

  return defaultData;
}


function saveData(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}


module.exports = {
  loadData,
  saveData
};
