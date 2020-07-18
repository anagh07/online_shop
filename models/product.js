const path = require('path');
const fs = require('fs');

// Find directory to data file
const path_data = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const readDataFile = (callback) => {

  fs.readFile(path_data, (err, fileData) => {
    if (err) callback([]);
    else callback(JSON.parse(fileData));
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    readDataFile((data) => {
      // Push new data into products
      data.push(this);

      // Update data file
      fs.writeFile(path_data, JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    readDataFile(callback);
  }
};
